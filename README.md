# 📄 Discord Dynamic Pagination

<div align="center">

A powerful, **library-agnostic** pagination system for Discord bots with support for buttons, select menus, and hybrid modes.

[![npm version](https://img.shields.io/npm/v/discord-dynamic-pagination?color=blue&logo=npm)](https://www.npmjs.com/package/discord-dynamic-pagination)
[![npm downloads](https://img.shields.io/npm/dm/discord-dynamic-pagination?color=blue&logo=npm)](https://www.npmjs.com/package/discord-dynamic-pagination)
[![npm bundle size](https://img.shields.io/bundlephobia/min/discord-dynamic-pagination?color=blue)](https://bundlephobia.com/package/discord-dynamic-pagination)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg?logo=typescript)](https://www.typescriptlang.org/)

</div>

## ✨ Features

- 🔄 **Library Agnostic** - Works with discord.js v14+ and Eris v0.17+
- ⚡ **Type-Safe** - Full TypeScript support with comprehensive type definitions
- 🎯 **Multiple Modes** - Buttons, select menu, or hybrid navigation
- 👥 **Multi-User Support** - Handle concurrent users gracefully
- 🎨 **Fully Customizable** - Custom buttons, emojis, styles, and page formats
- 📊 **Page Indicators** - Display current page in multiple ways
- ⏱️ **Auto-Cleanup** - Automatic timeout handling and component disabling
- 💾 **Lazy Loading** - Dynamic page generation for database queries
- 🔒 **User Filtering** - Restrict who can interact with pagination
- 🚀 **Lightweight** - Minimal dependencies, maximum performance
- 📝 **Event System** - Full event hooks for monitoring state
- 👻 **Ephemeral Support** - Send paginated messages as ephemeral replies

## 📦 Installation

```bash
npm install discord-dynamic-pagination
```

### Peer Dependencies

For Discord.js:
```bash
npm install discord.js@^14.0.0
```

For Eris:
```bash
npm install eris@^0.17.0
```

## 🚀 Quick Start

### Discord.js Example

```typescript
import { Client, GatewayIntentBits, EmbedBuilder } from 'discord.js';
import { Paginator, DiscordJSAdapter, PaginationType } from 'discord-dynamic-pagination';

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'leaderboard') {
        // Create pages
        const pages = [
            new EmbedBuilder().setTitle('🏆 Leaderboard - Top 10').setDescription('1. User1 - 1000 pts\n2. User2 - 950 pts'),
            new EmbedBuilder().setTitle('🏆 Leaderboard - 11-20').setDescription('11. User11 - 500 pts\n12. User12 - 450 pts'),
            new EmbedBuilder().setTitle('🏆 Leaderboard - 21-30').setDescription('21. User21 - 250 pts\n22. User22 - 200 pts'),
        ];

        // Create paginator
        const adapter = new DiscordJSAdapter(client);
        const paginator = new Paginator(adapter, {
            pages: pages,
            type: PaginationType.BUTTONS,
            timeout: 300000, // 5 minutes
        });

        await paginator.send(interaction);
    }
});

client.login('YOUR_BOT_TOKEN');
```

### Eris Example

```typescript
import Eris from 'eris';
import { Paginator, ErisAdapter, PaginationType } from 'discord-dynamic-pagination';

const bot = new Eris('YOUR_BOT_TOKEN');

bot.on('interactionCreate', async (interaction) => {
    if (interaction.data.name === 'help') {
        const pages = [
            { embeds: [{ title: 'Help - Page 1', description: 'Commands...' }] },
            { embeds: [{ title: 'Help - Page 2', description: 'More commands...' }] },
        ];

        const adapter = new ErisAdapter(bot);
        const paginator = new Paginator(adapter, {
            pages: pages,
            type: PaginationType.HYBRID, // Both buttons and select menu
        });

        await paginator.send(interaction);
    }
});

bot.connect();
```

## 📖 Advanced Usage

### Select Menu Navigation

Perfect for quick page jumping:

```typescript
const paginator = new Paginator(adapter, {
    pages: pages,
    type: PaginationType.SELECT_MENU,
    timeout: 300000,
});

await paginator.send(interaction);
```

### Hybrid Mode (Buttons + Select Menu)

Maximum flexibility - buttons for sequential navigation, select menu for jumping:

```typescript
const paginator = new Paginator(adapter, {
    pages: pages,
    type: PaginationType.HYBRID,
    showFirstLast: true, // Show "First" and "Last" buttons
});

await paginator.send(interaction);
```

### Custom Button Styling

Personalize your pagination controls:

```typescript
import { ButtonStyle } from 'discord-dynamic-pagination';

const paginator = new Paginator(adapter, {
    pages: pages,
    type: PaginationType.BUTTONS,
    customButtons: {
        first: {
            label: 'Start',
            emoji: '⏮️',
            style: ButtonStyle.SUCCESS,
        },
        previous: {
            label: 'Prev',
            emoji: '⬅️',
            style: ButtonStyle.PRIMARY,
        },
        next: {
            label: 'Next',
            emoji: '➡️',
            style: ButtonStyle.PRIMARY,
        },
        last: {
            label: 'End',
            emoji: '⏭️',
            style: ButtonStyle.SUCCESS,
        },
    },
    pageDisplay: {
        format: 'Page {current} of {total}',
        showAsButton: true, // Show as disabled button
    },
});

await paginator.send(interaction);
```

### Dynamic Page Generation (Lazy Loading)

Perfect for database queries or large datasets:

```typescript
const paginator = new Paginator(adapter, {
    pages: async (pageIndex, context) => {
        // Return null to indicate no more pages
        if (pageIndex >= totalUsers / 10) return null;

        // Fetch data for this page from database
        const users = await db.getUsers(pageIndex * 10, 10);

        // Build embed
        return new EmbedBuilder()
            .setTitle(`Users - Page ${pageIndex + 1}`)
            .setDescription(users.map(u => `${u.name}: ${u.score}`).join('\n'));
    },
    type: PaginationType.HYBRID,
});

await paginator.send(interaction);
```

### Page Display Options

Show page numbers in different ways:

```typescript
const paginator = new Paginator(adapter, {
    pages: pages,
    pageDisplay: {
        format: '{current}/{total} 📄', // Custom format
        showAsButton: true, // Show as disabled button in button row
        showInFooter: true, // Also show in embed footer
    },
});
```

### User Filtering

Restrict who can interact:

```typescript
const paginator = new Paginator(adapter, {
    pages: pages,
    singleUserMode: true, // Only the original user can interact
    // OR custom filter:
    filter: async (userId, context) => {
        // Only admins can interact
        const member = await guild.members.fetch(userId);
        return member.permissions.has('Administrator');
    },
});
```

### Event Handling

Monitor pagination state:

```typescript
const paginator = new Paginator(adapter, {
    pages: pages,
    onPageChange: (oldPage, newPage, context) => {
        console.log(`Changed from page ${oldPage + 1} to ${newPage + 1}`);
    },
    onTimeout: (context) => {
        console.log('Pagination timed out');
    },
    onDestroy: (context) => {
        console.log('Pagination destroyed');
    },
});

// Event emitter events
paginator.on('pageChange', (oldPage, newPage, context) => {
    console.log('Page changed!');
});

paginator.on('timeout', (context) => {
    console.log('Timed out!');
});

paginator.on('error', (error) => {
    console.error('Error:', error);
});

await paginator.send(interaction);
```

### Ephemeral Pagination

Send pagination visible only to the command user:

```typescript
const paginator = new Paginator(adapter, {
    pages: pages,
    ephemeral: true, // Only works with interactions
});

await paginator.send(interaction);
```

### Manual Control

Programmatically control pagination:

```typescript
const paginator = new Paginator(adapter, {
    pages: pages,
    startPage: 2, // Start on page 3 (0-indexed)
});

await paginator.send(interaction);

// Jump to specific page
await paginator.goToPage(5);

// Get current state
const currentPage = paginator.getCurrentPage();
const totalPages = paginator.getTotalPages();
const isActive = paginator.isActive();

// Update pages dynamically
await paginator.update(); // Re-renders current page

// Destroy pagination manually
await paginator.destroy(); // Disables components or deletes message
```

### Auto-Delete on End

Automatically delete the message when pagination ends:

```typescript
const paginator = new Paginator(adapter, {
    pages: pages,
    timeout: 60000, // 1 minute
    deleteOnEnd: true, // Delete message when timeout occurs
});
```

## 📚 API Reference

### `Paginator`

Main pagination class.

#### Constructor

```typescript
new Paginator(adapter: AdapterInterface, options: PaginatorOptions)
```

#### Methods

- `send(target): Promise<void>` - Initialize and send paginated message
- `update(): Promise<void>` - Update pagination (re-render current page)
- `goToPage(index: number): Promise<boolean>` - Jump to specific page
- `destroy(): Promise<void>` - Clean up and destroy pagination
- `getCurrentPage(): number` - Get current page index
- `getTotalPages(): number` - Get total page count
- `isActive(): boolean` - Check if pagination is active
- `getContext(): PaginatorContext` - Get current context

#### Events

- `ready` - Pagination initialized
- `pageChange` - Page changed
- `timeout` - Pagination timed out
- `destroy` - Pagination destroyed
- `error` - Error occurred

### `PaginatorOptions`

Configuration options:

```typescript
interface PaginatorOptions {
    pages: any[] | PageBuilder;
    type?: PaginationType;
    timeout?: number;
    ephemeral?: boolean;
    customButtons?: CustomButtons;
    pageDisplay?: PageDisplayOptions;
    filter?: PaginatorFilter;
    onTimeout?: OnTimeoutCallback;
    onPageChange?: OnPageChangeCallback;
    onDestroy?: OnDestroyCallback;
    startPage?: number;
    showFirstLast?: boolean;
    deleteOnEnd?: boolean;
    singleUserMode?: boolean;
    userId?: string;
}
```

### `PaginationType`

Pagination navigation modes:

- `PaginationType.BUTTONS` - Button-based navigation
- `PaginationType.SELECT_MENU` - Select menu for page jumping
- `PaginationType.HYBRID` - Both buttons and select menu

### `ButtonStyle`

Discord button styles:

- `ButtonStyle.PRIMARY` - Blurple button
- `ButtonStyle.SECONDARY` - Gray button
- `ButtonStyle.SUCCESS` - Green button
- `ButtonStyle.DANGER` - Red button
- `ButtonStyle.LINK` - Link button (not used in pagination)

### `PageBuilder`

Dynamic page generation function:

```typescript
type PageBuilder = (pageIndex: number, context: PaginatorContext) => Promise<any> | any
```

Return `null` or `undefined` to indicate end of pages.

## 🎨 Customization Examples

### Gaming Bot Leaderboard

```typescript
const pages = Array.from({ length: 10 }, (_, i) => 
    new EmbedBuilder()
        .setTitle(`🎮 Gaming Leaderboard`)
        .setColor('#FF6B6B')
        .setDescription(`Rank ${i * 10 + 1}-${(i + 1) * 10}`)
);

const paginator = new Paginator(adapter, {
    pages,
    type: PaginationType.HYBRID,
    customButtons: {
        previous: { emoji: '⬅️', style: ButtonStyle.SUCCESS },
        next: { emoji: '➡️', style: ButtonStyle.SUCCESS },
    },
    pageDisplay: {
        format: '🏆 {current}/{total}',
        showAsButton: true,
    },
    timeout: 600000, // 10 minutes
});
```

### Moderation Logs

```typescript
const paginator = new Paginator(adapter, {
    pages: async (pageIndex) => {
        if (pageIndex >= totalLogs / 25) return null;
        
        const logs = await db.getModerationLogs(pageIndex * 25, 25);
        
        return new EmbedBuilder()
            .setTitle('📋 Moderation Logs')
            .setColor('#E74C3C')
            .setDescription(logs.map(log => `${log.action} - ${log.target}`).join('\n'));
    },
    type: PaginationType.BUTTONS,
    singleUserMode: true,
    filter: async (userId) => {
        const member = await guild.members.fetch(userId);
        return member.permissions.has('ModerateMembers');
    },
});
```

## 🤝 Contributing

Contributions are welcome! Please check out the [Contributing Guide](CONTRIBUTING.md).

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Created with ❤️ by [Jersuxs](https://github.com/jersuxsss)

Inspired by the needs of the Discord bot development community.

## 🔗 Links

- [NPM Package](https://www.npmjs.com/package/discord-dynamic-pagination)
- [GitHub Repository](https://github.com/jersuxsss/discord-dynamic-pagination)
- [Issue Tracker](https://github.com/jersuxsss/discord-dynamic-pagination/issues)
- [Discord.js Documentation](https://discord.js.org/)
- [Eris Documentation](https://abal.moe/Eris/)

---

<div align="center">

**⭐ Star us on GitHub if you find this helpful!**

</div>
