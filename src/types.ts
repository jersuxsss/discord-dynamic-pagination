/**
 * Pagination type defines how users navigate through pages
 */
export enum PaginationType {
    /** Traditional button-based navigation (First, Previous, Next, Last) */
    BUTTONS = 'buttons',
    /** Select menu dropdown for direct page jumping */
    SELECT_MENU = 'select_menu',
    /** Both buttons and select menu for maximum flexibility */
    HYBRID = 'hybrid',
}

/**
 * Discord button styles
 */
export enum ButtonStyle {
    PRIMARY = 1,
    SECONDARY = 2,
    SUCCESS = 3,
    DANGER = 4,
    LINK = 5,
}

/**
 * Function to dynamically generate page content
 * Useful for lazy loading or database queries
 */
export type PageBuilder = (pageIndex: number, context: PaginatorContext) => Promise<MessageContent> | MessageContent;

/**
 * Custom button configuration
 */
export interface CustomButton {
    /** Button label text */
    label?: string;
    /** Button emoji (can be Unicode or custom emoji ID) */
    emoji?: string;
    /** Button style */
    style?: ButtonStyle;
}

/**
 * Custom buttons for pagination controls
 */
export interface CustomButtons {
    first?: CustomButton;
    previous?: CustomButton;
    next?: CustomButton;
    last?: CustomButton;
    /** Button to show current page / total pages */
    pageIndicator?: CustomButton;
}

/**
 * Page display format configuration
 */
export interface PageDisplayOptions {
    /** Format string for page display. Use {current} and {total} placeholders */
    format?: string;
    /** Show page indicator as a disabled button */
    showAsButton?: boolean;
    /** Show page indicator in footer of embed */
    showInFooter?: boolean;
}

/**
 * Filter function to restrict who can interact with pagination
 */
export type PaginatorFilter = (userId: string, context: PaginatorContext) => boolean | Promise<boolean>;

/**
 * Callback when pagination times out
 */
export type OnTimeoutCallback = (context: PaginatorContext) => void | Promise<void>;

/**
 * Callback when page changes
 */
export type OnPageChangeCallback = (
    oldPage: number,
    newPage: number,
    context: PaginatorContext
) => void | Promise<void>;

/**
 * Callback when pagination is destroyed
 */
export type OnDestroyCallback = (context: PaginatorContext) => void | Promise<void>;

/**
 * Main paginator configuration options
 */
export interface PaginatorOptions {
    /** Array of pages (embeds, strings, or page builders) */
    pages: MessageContent[] | PageBuilder;
    /** Pagination type (buttons, select_menu, or hybrid) */
    type?: PaginationType;
    /** Timeout in milliseconds (default: 300000 - 5 minutes) */
    timeout?: number;
    /** Send as ephemeral reply (only works with interactions) */
    ephemeral?: boolean;
    /** Custom button configurations */
    customButtons?: CustomButtons;
    /** Page display options */
    pageDisplay?: PageDisplayOptions;
    /** Filter function to restrict interactions */
    filter?: PaginatorFilter;
    /** Callback when pagination times out */
    onTimeout?: OnTimeoutCallback;
    /** Callback when page changes */
    onPageChange?: OnPageChangeCallback;
    /** Callback when pagination is destroyed */
    onDestroy?: OnDestroyCallback;
    /** Starting page index (default: 0) */
    startPage?: number;
    /** Show "First" and "Last" buttons (default: true) */
    showFirstLast?: boolean;
    /** Delete message when pagination ends (default: false) */
    deleteOnEnd?: boolean;
    /** Allow only the original user to interact (default: false - allows anyone) */
    singleUserMode?: boolean;
    /** User ID for single user mode (auto-detected from interaction/message) */
    userId?: string;
}

/**
 * Paginator runtime context
 */
export interface PaginatorContext {
    /** Current page index (0-based) */
    currentPage: number;
    /** Total number of pages */
    totalPages: number;
    /** User ID who initiated the pagination */
    userId?: string;
    /** Channel ID where pagination is active */
    channelId?: string;
    /** Guild ID (if in a guild) */
    guildId?: string;
    /** Whether pagination is still active */
    isActive: boolean;
    /** Custom metadata */
    metadata?: Record<string, unknown>;
}

/**
 * Collector filter function type
 */
export type CollectorFilter = (interaction: unknown) => boolean | Promise<boolean>;

/**
 * Message content type (can be string or message options object)
 */
export type MessageContent = string | {
    content?: string;
    embeds?: unknown[];
    components?: unknown[];
    files?: unknown[];
    [key: string]: unknown;
};

/**
 * Component types for Discord
 */
export enum ComponentType {
    ACTION_ROW = 1,
    BUTTON = 2,
    STRING_SELECT = 3,
}

/**
 * Select menu option
 */
export interface SelectMenuOption {
    label: string;
    value: string;
    description?: string;
    emoji?: string;
    default?: boolean;
}

