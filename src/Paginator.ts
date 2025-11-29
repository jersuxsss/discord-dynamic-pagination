import { EventEmitter } from 'events';
import { AdapterInterface } from './adapters/AdapterInterface';
import {
    PaginatorOptions,
    PaginatorContext,
    PaginationType,
    ButtonStyle,
    SelectMenuOption,
    PageBuilder,
} from './types';

/**
 * Main Paginator class for creating interactive paginated messages
 */
export class Paginator extends EventEmitter {
    private adapter: AdapterInterface;
    private options: any;
    private context: PaginatorContext;
    private message: any;
    private collector: any;
    private timeoutTimer: NodeJS.Timeout | null = null;
    private pages: any[];
    private isPageBuilder: boolean;

    constructor(adapter: AdapterInterface, options: PaginatorOptions) {
        super();
        this.adapter = adapter;

        // Set defaults
        this.options = {
            pages: options.pages,
            type: options.type || PaginationType.BUTTONS,
            timeout: options.timeout || 300000,
            ephemeral: options.ephemeral || false,
            customButtons: options.customButtons || {},
            pageDisplay: options.pageDisplay || {},
            filter: options.filter || (() => true),
            onTimeout: options.onTimeout || (() => { }),
            onPageChange: options.onPageChange || (() => { }),
            onDestroy: options.onDestroy || (() => { }),
            startPage: options.startPage || 0,
            showFirstLast: options.showFirstLast !== false,
            deleteOnEnd: options.deleteOnEnd || false,
            singleUserMode: options.singleUserMode || false,
            userId: options.userId,
        };

        this.isPageBuilder = typeof this.options.pages === 'function';
        this.pages = [];

        this.context = {
            currentPage: this.options.startPage,
            totalPages: 0,
            userId: this.options.userId,
            isActive: false,
        };
    }

    async send(target: any): Promise<void> {
        try {
            if (!this.context.userId) {
                this.context.userId = this.adapter.getUserId(target);
            }

            this.context.channelId = this.adapter.getChannelId(target);
            this.context.guildId = this.adapter.getGuildId(target);

            await this.loadPages();

            if (this.context.totalPages === 0) {
                throw new Error('No pages to display');
            }

            if (this.context.currentPage >= this.context.totalPages) {
                this.context.currentPage = this.context.totalPages - 1;
            }

            this.context.isActive = true;

            const { content, components } = await this.renderPage();
            this.message = await this.adapter.sendMessage(target, content, components, this.options.ephemeral);

            if (this.context.totalPages > 1) {
                this.setupCollector();
            } else {
                this.emit('ready', this.context);
            }
        } catch (error) {
            this.emit('error', error);
            throw error;
        }
    }

    async update(): Promise<void> {
        if (!this.context.isActive || !this.message) {
            throw new Error('Pagination is not active');
        }

        await this.loadPages();
        const { content, components } = await this.renderPage();
        await this.adapter.updateMessage(this.message, content, components);
    }

    async goToPage(index: number): Promise<boolean> {
        if (!this.context.isActive) {
            return false;
        }

        if (index < 0 || index >= this.context.totalPages) {
            return false;
        }

        const oldPage = this.context.currentPage;
        this.context.currentPage = index;

        await this.options.onPageChange(oldPage, index, this.context);
        this.emit('pageChange', oldPage, index, this.context);

        const { content, components } = await this.renderPage();
        await this.adapter.updateMessage(this.message, content, components);

        return true;
    }

    async destroy(): Promise<void> {
        if (!this.context.isActive) {
            return;
        }

        this.context.isActive = false;

        if (this.timeoutTimer) {
            clearTimeout(this.timeoutTimer);
            this.timeoutTimer = null;
        }

        if (this.collector) {
            this.collector.stop('destroyed');
        }

        if (this.options.deleteOnEnd && this.message) {
            try {
                await this.adapter.deleteMessage(this.message);
            } catch (error) {
                // Ignore
            }
        } else if (this.message) {
            const { content, components } = await this.renderPage(true);
            try {
                await this.adapter.updateMessage(this.message, content, components);
            } catch (error) {
                // Ignore
            }
        }

        await this.options.onDestroy(this.context);
        this.emit('destroy', this.context);
    }

    getCurrentPage(): number {
        return this.context.currentPage;
    }

    getTotalPages(): number {
        return this.context.totalPages;
    }

    isActive(): boolean {
        return this.context.isActive;
    }

    getContext(): PaginatorContext {
        return { ...this.context };
    }

    private async loadPages(): Promise<void> {
        if (this.isPageBuilder) {
            this.pages = [];
            let pageIndex = 0;
            let shouldContinue = true;

            while (shouldContinue) {
                const page = await (this.options.pages as PageBuilder)(pageIndex, this.context);
                if (page === null || page === undefined) {
                    shouldContinue = false;
                    break;
                }
                this.pages.push(page);
                pageIndex++;

                if (pageIndex > 1000) {
                    throw new Error('PageBuilder generated more than 1000 pages');
                }
            }
        } else {
            this.pages = this.options.pages as any[];
        }

        this.context.totalPages = this.pages.length;
    }

    private async renderPage(disabled = false): Promise<{ content: any; components: any[] }> {
        let pageContent = this.pages[this.context.currentPage];

        if (typeof pageContent === 'function') {
            pageContent = await pageContent(this.context.currentPage, this.context);
        }

        if (this.options.pageDisplay.showInFooter && typeof pageContent === 'object' && pageContent.embeds) {
            const pageText = this.getPageDisplayText();
            if (pageContent.embeds[0]) {
                pageContent.embeds[0].footer = { text: pageText };
            }
        }

        const components = this.context.totalPages > 1 ? this.createComponents(disabled) : [];

        return { content: pageContent, components };
    }

    private createComponents(disabled = false): any[] {
        const rows: any[] = [];

        if (this.options.type === PaginationType.BUTTONS || this.options.type === PaginationType.HYBRID) {
            rows.push(this.createButtonRow(disabled));
        }

        if (this.options.type === PaginationType.SELECT_MENU || this.options.type === PaginationType.HYBRID) {
            rows.push(this.createSelectMenuRow(disabled));
        }

        return rows;
    }

    private createButtonRow(disabled = false): any {
        const buttons: any[] = [];

        if (this.options.showFirstLast) {
            const firstBtn = this.options.customButtons.first || {};
            buttons.push(
                this.adapter.createButton(
                    'paginator_first',
                    firstBtn.label || '⏮️',
                    firstBtn.style || ButtonStyle.SECONDARY,
                    firstBtn.emoji,
                    disabled || this.context.currentPage === 0
                )
            );
        }

        const prevBtn = this.options.customButtons.previous || {};
        buttons.push(
            this.adapter.createButton(
                'paginator_previous',
                prevBtn.label || '◀️',
                prevBtn.style || ButtonStyle.PRIMARY,
                prevBtn.emoji,
                disabled || this.context.currentPage === 0
            )
        );

        if (this.options.pageDisplay.showAsButton) {
            const pageText = this.getPageDisplayText();
            buttons.push(
                this.adapter.createButton(
                    'paginator_indicator',
                    pageText,
                    ButtonStyle.SECONDARY,
                    undefined,
                    true
                )
            );
        }

        const nextBtn = this.options.customButtons.next || {};
        buttons.push(
            this.adapter.createButton(
                'paginator_next',
                nextBtn.label || '▶️',
                nextBtn.style || ButtonStyle.PRIMARY,
                nextBtn.emoji,
                disabled || this.context.currentPage === this.context.totalPages - 1
            )
        );

        if (this.options.showFirstLast) {
            const lastBtn = this.options.customButtons.last || {};
            buttons.push(
                this.adapter.createButton(
                    'paginator_last',
                    lastBtn.label || '⏭️',
                    lastBtn.style || ButtonStyle.SECONDARY,
                    lastBtn.emoji,
                    disabled || this.context.currentPage === this.context.totalPages - 1
                )
            );
        }

        return this.adapter.createActionRow(buttons);
    }

    private createSelectMenuRow(disabled = false): any {
        const options: SelectMenuOption[] = [];
        const maxOptions = 25;

        if (this.context.totalPages <= maxOptions) {
            for (let i = 0; i < this.context.totalPages; i++) {
                options.push({
                    label: `Page ${i + 1}`,
                    value: `page_${i}`,
                    description: `Go to page ${i + 1}`,
                    default: i === this.context.currentPage,
                });
            }
        } else {
            for (let i = 0; i < maxOptions - 1; i++) {
                options.push({
                    label: `Page ${i + 1}`,
                    value: `page_${i}`,
                    description: `Go to page ${i + 1}`,
                    default: i === this.context.currentPage,
                });
            }

            options.push({
                label: `More pages (${maxOptions}-${this.context.totalPages})...`,
                value: 'page_more',
                description: `There are ${this.context.totalPages - maxOptions + 1} more pages`,
            });
        }

        const selectMenu = this.adapter.createSelectMenu('paginator_select', options, 'Jump to page...', disabled);

        return this.adapter.createActionRow([selectMenu]);
    }

    private getPageDisplayText(): string {
        const format = this.options.pageDisplay.format || 'Page {current}/{total}';
        return format
            .replace('{current}', (this.context.currentPage + 1).toString())
            .replace('{total}', this.context.totalPages.toString());
    }

    private setupCollector(): void {
        const filter = async (interaction: any): Promise<boolean> => {
            const userId = this.adapter.getUserId(interaction);

            if (this.options.singleUserMode && userId !== this.context.userId) {
                return false;
            }

            const customFilterPass = await this.options.filter(userId, this.context);
            return customFilterPass;
        };

        this.collector = this.adapter.createCollector(this.message, filter, this.options.timeout);

        this.collector.on('collect', async (interaction: any) => {
            try {
                await this.adapter.deferUpdate(interaction);

                const customId = this.adapter.getCustomId(interaction);

                if (customId === 'paginator_first') {
                    await this.goToPage(0);
                } else if (customId === 'paginator_previous') {
                    await this.goToPage(this.context.currentPage - 1);
                } else if (customId === 'paginator_next') {
                    await this.goToPage(this.context.currentPage + 1);
                } else if (customId === 'paginator_last') {
                    await this.goToPage(this.context.totalPages - 1);
                } else if (customId === 'paginator_select') {
                    const values = this.adapter.getSelectMenuValues(interaction);
                    if (values.length > 0) {
                        const value = values[0];
                        if (value.startsWith('page_')) {
                            const pageIndex = parseInt(value.split('_')[1]);
                            if (!isNaN(pageIndex)) {
                                await this.goToPage(pageIndex);
                            }
                        }
                    }
                }
            } catch (error) {
                this.emit('error', error);
            }
        });

        this.collector.on('end', async (collected: any, reason: string) => {
            if (reason === 'time') {
                await this.handleTimeout();
            }
        });
    }

    private async handleTimeout(): Promise<void> {
        await this.options.onTimeout(this.context);
        this.emit('timeout', this.context);
        await this.destroy();
    }
}
