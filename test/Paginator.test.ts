import { Paginator } from '../src/Paginator';
import { PaginationType, ButtonStyle } from '../src/types';

// Mock adapter
class MockAdapter {
    public messages: any[] = [];
    public lastComponents: any[] = [];

    async sendMessage(target: any, content: any, components: any[], ephemeral = false) {
        const message = {
            id: 'msg_1234',
            content,
            components,
            ephemeral,
        };
        this.messages.push(message);
        this.lastComponents = components;
        return message;
    }

    async updateMessage(message: any, content: any, components: any[]) {
        message.content = content;
        message.components = components;
        this.lastComponents = components;
        return message;
    }

    async deleteMessage(message: any) {
        const index = this.messages.indexOf(message);
        if (index > -1) {
            this.messages.splice(index, 1);
        }
    }

    createButton(customId: string, label: string, style: ButtonStyle, emoji?: string, disabled = false) {
        return { customId, label, style, emoji, disabled, type: 'button' };
    }

    createSelectMenu(customId: string, options: any[], placeholder?: string, disabled = false) {
        return { customId, options, placeholder, disabled, type: 'select' };
    }

    createCollector(message: any, filter: any, timeout: number, componentType?: any) {
        const collector = {
            listeners: { collect: [] as any[], end: [] as any[] },
            on(event: string, callback: any) {
                if (event === 'collect') {
                    this.listeners.collect.push(callback);
                } else if (event === 'end') {
                    this.listeners.end.push(callback);
                }
                return this;
            },
            stop(reason: string) {
                this.listeners.end.forEach((cb) => cb([], reason));
            },
            simulate(interaction: any) {
                this.listeners.collect.forEach((cb) => cb(interaction));
            },
        };

        // Auto-timeout
        setTimeout(() => collector.stop('time'), timeout);

        return collector;
    }

    getCustomId(interaction: any) {
        return interaction.customId;
    }

    getUserId(source: any) {
        return source.userId || 'user_123';
    }

    getChannelId(source: any) {
        return source.channelId || 'channel_123';
    }

    getGuildId(source: any) {
        return source.guildId;
    }

    getSelectMenuValues(interaction: any) {
        return interaction.values || [];
    }

    async deferUpdate(interaction: any) {
        // Mock defer
    }

    createActionRow(components: any[]) {
        return { type: 1, components };
    }
}

describe('Paginator', () => {
    let adapter: any;
    let mockInteraction: any;

    beforeEach(() => {
        adapter = new MockAdapter();
        mockInteraction = {
            userId: 'user_123',
            channelId: 'channel_123',
            guildId: 'guild_123',
        };
    });

    describe('Initialization', () => {
        it('should create paginator with default options', () => {
            const pages = ['Page 1', 'Page 2', 'Page 3'];
            const paginator = new Paginator(adapter, { pages });

            expect(paginator).toBeDefined();
            expect(paginator.isActive()).toBe(false);
        });

        it('should accept custom options', () => {
            const pages = ['Page 1', 'Page 2'];
            const paginator = new Paginator(adapter, {
                pages,
                type: PaginationType.SELECT_MENU,
                timeout: 60000,
                ephemeral: true,
            });

            expect(paginator).toBeDefined();
        });
    });

    describe('Basic Navigation', () => {
        it('should send initial message with pages', async () => {
            const pages = ['Page 1', 'Page 2', 'Page 3'];
            const paginator = new Paginator(adapter, { pages });

            await paginator.send(mockInteraction);

            expect(adapter.messages.length).toBe(1);
            expect(adapter.messages[0].content).toBe('Page 1');
            expect(paginator.isActive()).toBe(true);
        });

        it('should navigate to next page', async () => {
            const pages = ['Page 1', 'Page 2', 'Page 3'];
            const paginator = new Paginator(adapter, { pages });

            await paginator.send(mockInteraction);

            const result = await paginator.goToPage(1);

            expect(result).toBe(true);
            expect(paginator.getCurrentPage()).toBe(1);
        });

        it('should navigate to previous page', async () => {
            const pages = ['Page 1', 'Page 2', 'Page 3'];
            const paginator = new Paginator(adapter, {
                pages,
                startPage: 1
            });

            await paginator.send(mockInteraction);

            const result = await paginator.goToPage(0);

            expect(result).toBe(true);
            expect(paginator.getCurrentPage()).toBe(0);
        });

        it('should not navigate beyond page bounds', async () => {
            const pages = ['Page 1', 'Page 2'];
            const paginator = new Paginator(adapter, { pages });

            await paginator.send(mockInteraction);

            const result = await paginator.goToPage(5);

            expect(result).toBe(false);
            expect(paginator.getCurrentPage()).toBe(0);
        });
    });

    describe('Components', () => {
        it('should create button components for button type', async () => {
            const pages = ['Page 1', 'Page 2', 'Page 3'];
            const paginator = new Paginator(adapter, {
                pages,
                type: PaginationType.BUTTONS
            });

            await paginator.send(mockInteraction);

            const components = adapter.lastComponents;
            expect(components.length).toBeGreaterThan(0);
            expect(components[0].components.some((c: any) => c.type === 'button')).toBe(true);
        });

        it('should create select menu for select_menu type', async () => {
            const pages = ['Page 1', 'Page 2', 'Page 3'];
            const paginator = new Paginator(adapter, {
                pages,
                type: PaginationType.SELECT_MENU
            });

            await paginator.send(mockInteraction);

            const components = adapter.lastComponents;
            expect(components[0].components.some((c: any) => c.type === 'select')).toBe(true);
        });

        it('should create both buttons and select menu for hybrid type', async () => {
            const pages = ['Page 1', 'Page 2', 'Page 3'];
            const paginator = new Paginator(adapter, {
                pages,
                type: PaginationType.HYBRID
            });

            await paginator.send(mockInteraction);

            const components = adapter.lastComponents;
            expect(components.length).toBe(2); // Button row and select menu row
        });

        it('should disable first/previous buttons on first page', async () => {
            const pages = ['Page 1', 'Page 2', 'Page 3'];
            const paginator = new Paginator(adapter, {
                pages,
                type: PaginationType.BUTTONS,
                showFirstLast: true
            });

            await paginator.send(mockInteraction);

            const buttonRow = adapter.lastComponents[0];
            const firstButton = buttonRow.components.find((c: any) => c.customId === 'paginator_first');
            const prevButton = buttonRow.components.find((c: any) => c.customId === 'paginator_previous');

            expect(firstButton.disabled).toBe(true);
            expect(prevButton.disabled).toBe(true);
        });
    });

    describe('Events', () => {
        it('should emit pageChange event', async () => {
            const pages = ['Page 1', 'Page 2', 'Page 3'];
            const paginator = new Paginator(adapter, { pages });

            let eventFired = false;
            paginator.on('pageChange', () => {
                eventFired = true;
            });

            await paginator.send(mockInteraction);
            await paginator.goToPage(1);

            expect(eventFired).toBe(true);
        });

        it('should call onPageChange callback', async () => {
            const pages = ['Page 1', 'Page 2', 'Page 3'];
            let callbackCalled = false;

            const paginator = new Paginator(adapter, {
                pages,
                onPageChange: (oldPage, newPage, context) => {
                    callbackCalled = true;
                    expect(oldPage).toBe(0);
                    expect(newPage).toBe(1);
                },
            });

            await paginator.send(mockInteraction);
            await paginator.goToPage(1);

            expect(callbackCalled).toBe(true);
        });
    });

    describe('Dynamic Pages', () => {
        it('should support PageBuilder function', async () => {
            let buildCount = 0;

            const paginator = new Paginator(adapter, {
                pages: (pageIndex, context) => {
                    buildCount++;
                    if (pageIndex >= 3) return null;
                    return `Dynamic Page ${pageIndex + 1}`;
                },
            });

            await paginator.send(mockInteraction);

            expect(paginator.getTotalPages()).toBe(3);
            expect(buildCount).toBeGreaterThan(0);
        });
    });

    describe('Cleanup', () => {
        it('should destroy pagination and mark as inactive', async () => {
            const pages = ['Page 1', 'Page 2'];
            const paginator = new Paginator(adapter, { pages });

            await paginator.send(mockInteraction);
            expect(paginator.isActive()).toBe(true);

            await paginator.destroy();
            expect(paginator.isActive()).toBe(false);
        });

        it('should call onDestroy callback', async () => {
            const pages = ['Page 1', 'Page 2'];
            let destroyCalled = false;

            const paginator = new Paginator(adapter, {
                pages,
                onDestroy: () => {
                    destroyCalled = true;
                },
            });

            await paginator.send(mockInteraction);
            await paginator.destroy();

            expect(destroyCalled).toBe(true);
        });
    });

    describe('Edge Cases', () => {
        it('should handle single page without creating components', async () => {
            const pages = ['Single Page'];
            const paginator = new Paginator(adapter, { pages });

            await paginator.send(mockInteraction);

            expect(adapter.lastComponents.length).toBe(0);
        });

        it('should handle empty pages array', async () => {
            const paginator = new Paginator(adapter, { pages: [] });

            await expect(paginator.send(mockInteraction)).rejects.toThrow('No pages to display');
        });
    });
});
