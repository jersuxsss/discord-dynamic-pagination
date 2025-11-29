import Eris from 'eris';
import { AdapterInterface } from './AdapterInterface';
import { MessageContent, CollectorFilter, ButtonStyle, SelectMenuOption, ComponentType } from '../types';

/**
 * Eris v0.17+ adapter implementation
 */
export class ErisAdapter extends AdapterInterface {
    private client: Eris.Client;
    private collectors: Map<string, any> = new Map();

    constructor(client: Eris.Client) {
        super();
        this.client = client;
    }

    async sendMessage(
        target: any,
        content: MessageContent,
        components: any[],
        ephemeral = false
    ): Promise<Eris.Message> {
        const messageOptions: any = typeof content === 'string' ? { content } : content;
        messageOptions.components = components;

        // Check if target is an interaction
        if (target.createMessage) {
            // It's a message, reply in channel
            return await this.client.createMessage(target.channel.id, messageOptions);
        } else if (target.channel) {
            // Message object
            return await this.client.createMessage(target.channel.id, messageOptions);
        } else {
            // Interaction
            messageOptions.flags = ephemeral ? 64 : 0;
            await target.createMessage(messageOptions);
            return (await target.getOriginalMessage()) as Eris.Message;
        }
    }

    async updateMessage(message: Eris.Message, content: MessageContent, components: any[]): Promise<Eris.Message> {
        const messageOptions: any = typeof content === 'string' ? { content } : content;
        messageOptions.components = components;
        return await this.client.editMessage(message.channel.id, message.id, messageOptions);
    }

    async deleteMessage(message: Eris.Message): Promise<void> {
        await this.client.deleteMessage(message.channel.id, message.id);
    }

    createButton(customId: string, label: string, style: ButtonStyle, emoji?: string, disabled = false): any {
        const button: any = {
            type: 2, // Button component type
            style: this.mapButtonStyle(style),
            custom_id: customId,
            label,
            disabled,
        };

        if (emoji) {
            // Check if it's a custom emoji (format: <:name:id> or <a:name:id>)
            const customEmojiMatch = emoji.match(/^<a?:(\w+):(\d+)>$/);
            if (customEmojiMatch) {
                button.emoji = {
                    name: customEmojiMatch[1],
                    id: customEmojiMatch[2],
                    animated: emoji.startsWith('<a:'),
                };
            } else {
                // Unicode emoji
                button.emoji = {
                    name: emoji,
                };
            }
        }

        return button;
    }

    createSelectMenu(
        customId: string,
        options: SelectMenuOption[],
        placeholder = 'Select a page',
        disabled = false
    ): any {
        return {
            type: 3, // String select menu type
            custom_id: customId,
            placeholder,
            disabled,
            options: options.map((opt) => {
                const option: any = {
                    label: opt.label,
                    value: opt.value,
                };

                if (opt.description) option.description = opt.description;
                if (opt.default) option.default = opt.default;

                if (opt.emoji) {
                    const customEmojiMatch = opt.emoji.match(/^<a?:(\w+):(\d+)>$/);
                    if (customEmojiMatch) {
                        option.emoji = {
                            name: customEmojiMatch[1],
                            id: customEmojiMatch[2],
                        };
                    } else {
                        option.emoji = {
                            name: opt.emoji,
                        };
                    }
                }

                return option;
            }),
        };
    }

    createCollector(message: any, filter: CollectorFilter, timeout: number, componentType?: ComponentType): any {
        const collectorId = `${message.id}_${Date.now()}`;

        const collector: any = {
            id: collectorId,
            filter,
            timeout,
            componentType,
            ended: false,
            collected: [] as any[],
            listeners: {
                collect: [] as Array<(interaction: any) => void>,
                end: [] as Array<(collected: any[], reason: string) => void>,
            },
            on(event: string, callback: any) {
                if (event === 'collect') {
                    this.listeners.collect.push(callback);
                } else if (event === 'end') {
                    this.listeners.end.push(callback);
                }
                return this;
            },
            stop(reason = 'user') {
                // Access parent scope through closure
                endCollectorFn(collectorId, reason);
            },
        };

        // Set up timeout
        const timeoutTimer = setTimeout(() => {
            if (!collector.ended) {
                this.endCollector(collectorId, 'time');
            }
        }, timeout);

        // Listen for interactions
        const interactionHandler = async (interaction: any) => {
            if (interaction.message && interaction.message.id === message.id) {
                const passesFilter = await filter(interaction);
                if (passesFilter) {
                    collector.collected.push(interaction);
                    collector.listeners.collect.forEach((fn: any) => fn(interaction));
                }
            }
        };

        this.client.on('interactionCreate', interactionHandler);

        // Store endCollector reference for stop method
        const endCollectorFn = (id: string, reason: string) => this.endCollector(id, reason);

        // Store collector with cleanup function
        this.collectors.set(collectorId, {
            collector,
            cleanup: () => {
                clearTimeout(timeoutTimer);
                this.client.removeListener('interactionCreate', interactionHandler);
            },
        });

        return collector;
    }

    private endCollector(collectorId: string, reason: string): void {
        const collectorData = this.collectors.get(collectorId);
        if (!collectorData) return;

        const { collector, cleanup } = collectorData;
        if (collector.ended) return;

        collector.ended = true;
        collector.listeners.end.forEach((fn: any) => fn(collector.collected, reason));
        cleanup();
        this.collectors.delete(collectorId);
    }

    getCustomId(interaction: any): string {
        return interaction.data.custom_id;
    }

    getUserId(source: any): string {
        if (source.author) {
            // Message
            return source.author.id;
        } else if (source.member || source.user) {
            // Interaction
            return source.member?.id || source.user?.id;
        }
        return '';
    }

    getChannelId(source: any): string {
        if (source.channel) {
            return source.channel.id;
        }
        return source.channel_id || '';
    }

    getGuildId(source: any): string | undefined {
        if (source.guildID) {
            return source.guildID;
        }
        if (source.guild_id) {
            return source.guild_id;
        }
        return undefined;
    }

    getSelectMenuValues(interaction: any): string[] {
        return interaction.data.values || [];
    }

    async deferUpdate(interaction: any): Promise<void> {
        await interaction.deferUpdate();
    }

    createActionRow(components: any[]): any {
        return {
            type: 1, // Action row type
            components,
        };
    }

    private mapButtonStyle(style: ButtonStyle): number {
        switch (style) {
            case ButtonStyle.PRIMARY:
                return 1;
            case ButtonStyle.SECONDARY:
                return 2;
            case ButtonStyle.SUCCESS:
                return 3;
            case ButtonStyle.DANGER:
                return 4;
            case ButtonStyle.LINK:
                return 5;
            default:
                return 2;
        }
    }
}
