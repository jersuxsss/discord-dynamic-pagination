import {
    MessageContent,
    CollectorFilter,
    ButtonStyle,
    SelectMenuOption,
    ComponentType,
} from '../types';

/**
 * Abstract adapter interface for library-agnostic pagination
 * Implementations exist for discord.js and Eris
 */
export abstract class AdapterInterface {
    /**
     * Send the initial paginated message
     * @param target - Message or interaction to reply to
     * @param content - Message content (string or embed)
     * @param components - Array of component rows
     * @param ephemeral - Whether to send as ephemeral (interactions only)
     */
    abstract sendMessage(
        target: any,
        content: MessageContent,
        components: any[],
        ephemeral?: boolean
    ): Promise<any>;

    /**
     * Update an existing message with new content
     * @param message - Message to update
     * @param content - New content
     * @param components - New components
     */
    abstract updateMessage(message: any, content: MessageContent, components: any[]): Promise<any>;

    /**
     * Delete a message
     * @param message - Message to delete
     */
    abstract deleteMessage(message: any): Promise<void>;

    /**
     * Create a button component
     * @param customId - Custom ID for the button
     * @param label - Button label text
     * @param style - Button style
     * @param emoji - Optional emoji
     * @param disabled - Whether button is disabled
     */
    abstract createButton(
        customId: string,
        label: string,
        style: ButtonStyle,
        emoji?: string,
        disabled?: boolean
    ): any;

    /**
     * Create a select menu component
     * @param customId - Custom ID for the select menu
     * @param options - Select menu options
     * @param placeholder - Placeholder text
     * @param disabled - Whether select menu is disabled
     */
    abstract createSelectMenu(
        customId: string,
        options: SelectMenuOption[],
        placeholder?: string,
        disabled?: boolean
    ): any;

    /**
     * Create a component collector
     * @param message - Message to collect components from
     * @param filter - Filter function
     * @param timeout - Timeout in milliseconds
     * @param componentType - Type of component to collect
     */
    abstract createCollector(
        message: any,
        filter: CollectorFilter,
        timeout: number,
        componentType?: ComponentType
    ): any;

    /**
     * Get the custom ID from a component interaction
     * @param interaction - Component interaction
     */
    abstract getCustomId(interaction: any): string;

    /**
     * Get the user ID from an interaction or message
     * @param source - Interaction or message
     */
    abstract getUserId(source: any): string;

    /**
     * Get the channel ID from an interaction or message
     * @param source - Interaction or message
     */
    abstract getChannelId(source: any): string;

    /**
     * Get the guild ID from an interaction or message
     * @param source - Interaction or message
     */
    abstract getGuildId(source: any): string | undefined;

    /**
     * Get the value(s) from a select menu interaction
     * @param interaction - Select menu interaction
     */
    abstract getSelectMenuValues(interaction: any): string[];

    /**
     * Defer a component interaction update
     * @param interaction - Component interaction
     */
    abstract deferUpdate(interaction: any): Promise<void>;

    /**
     * Create an action row component
     * @param components - Components to include in the row
     */
    abstract createActionRow(components: any[]): any;
}
