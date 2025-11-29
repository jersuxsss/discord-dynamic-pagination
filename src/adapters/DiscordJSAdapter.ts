import {
    ActionRowBuilder,
    ButtonBuilder,
    StringSelectMenuBuilder,
    ComponentType as DJSComponentType,
    ButtonStyle as DJSButtonStyle,
} from 'discord.js';
import { AdapterInterface } from './AdapterInterface';
import { MessageContent, CollectorFilter, ButtonStyle, SelectMenuOption, ComponentType } from '../types';

/**
 * Discord.js v14+ adapter implementation
 */
export class DiscordJSAdapter extends AdapterInterface {
    private client: any;

    constructor(client: any) {
        super();
        this.client = client;
    }

    async sendMessage(
        target: any,
        content: MessageContent,
        components: any[],
        ephemeral = false
    ): Promise<any> {
        const messageOptions: any = typeof content === 'string' ? { content } : content;
        messageOptions.components = components;

        // Check if it's an interaction
        if (target.reply && typeof target.reply === 'function') {
            messageOptions.ephemeral = ephemeral;
            messageOptions.fetchReply = true;
            return await target.reply(messageOptions);
        } else if (target.channel && target.channel.send) {
            // It's a message
            return await target.channel.send(messageOptions);
        } else {
            throw new Error('Invalid target for sending message');
        }
    }

    async updateMessage(message: any, content: MessageContent, components: any[]): Promise<any> {
        const messageOptions: any = typeof content === 'string' ? { content } : content;
        messageOptions.components = components;
        return await message.edit(messageOptions);
    }

    async deleteMessage(message: any): Promise<void> {
        if (message.deletable) {
            await message.delete();
        }
    }

    createButton(customId: string, label: string, style: ButtonStyle, emoji?: string, disabled = false): ButtonBuilder {
        const button = new ButtonBuilder().setCustomId(customId).setLabel(label).setDisabled(disabled);

        // Map our ButtonStyle enum to discord.js ButtonStyle
        const djsStyle = this.mapButtonStyle(style);
        button.setStyle(djsStyle);

        if (emoji) {
            button.setEmoji(emoji);
        }

        return button;
    }

    createSelectMenu(
        customId: string,
        options: SelectMenuOption[],
        placeholder = 'Select a page',
        disabled = false
    ): StringSelectMenuBuilder {
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId(customId)
            .setPlaceholder(placeholder)
            .setDisabled(disabled)
            .addOptions(
                options.map((opt) => ({
                    label: opt.label,
                    value: opt.value,
                    description: opt.description,
                    emoji: opt.emoji,
                    default: opt.default,
                }))
            );

        return selectMenu;
    }

    createCollector(
        message: any,
        filter: CollectorFilter,
        timeout: number,
        componentType?: ComponentType
    ): any {
        const djsComponentType =
            componentType === ComponentType.BUTTON
                ? DJSComponentType.Button
                : componentType === ComponentType.STRING_SELECT
                    ? DJSComponentType.StringSelect
                    : undefined;

        return message.createMessageComponentCollector({
            filter: filter as any,
            time: timeout,
            componentType: djsComponentType,
        });
    }

    getCustomId(interaction: any): string {
        return interaction.customId;
    }

    getUserId(source: any): string {
        if (source.author) {
            return source.author.id;
        }
        return source.user?.id || '';
    }

    getChannelId(source: any): string {
        return source.channelId || source.channel?.id || '';
    }

    getGuildId(source: any): string | undefined {
        return source.guildId ?? undefined;
    }

    getSelectMenuValues(interaction: any): string[] {
        return interaction.values || [];
    }

    async deferUpdate(interaction: any): Promise<void> {
        await interaction.deferUpdate();
    }

    createActionRow(components: any[]): ActionRowBuilder<any> {
        return new ActionRowBuilder().addComponents(...components);
    }

    private mapButtonStyle(style: ButtonStyle): DJSButtonStyle {
        switch (style) {
            case ButtonStyle.PRIMARY:
                return DJSButtonStyle.Primary;
            case ButtonStyle.SECONDARY:
                return DJSButtonStyle.Secondary;
            case ButtonStyle.SUCCESS:
                return DJSButtonStyle.Success;
            case ButtonStyle.DANGER:
                return DJSButtonStyle.Danger;
            case ButtonStyle.LINK:
                return DJSButtonStyle.Link;
            default:
                return DJSButtonStyle.Secondary;
        }
    }
}
