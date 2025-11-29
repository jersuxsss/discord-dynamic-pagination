# Examples

This directory contains example implementations of discord-dynamic-pagination.

## Available Examples

### 1. basic-pagination.ts
Simple button-based pagination with Discord.js. Perfect for getting started.

**Features:**
- Button navigation (First, Previous, Next, Last)
- Static page array
- Default styling

### 2. select-menu-pagination.ts
Select menu pagination for quick navigation through help categories.

**Features:**
- Select menu for direct page jumping
- Perfect for categorized content
- Clean navigation

### 3. hybrid-pagination.ts
Combined buttons and select menu for maximum flexibility.

**Features:**
- Both button and select menu navigation
- Custom button styling
- Page indicator as button
- Single-user mode
- Event listeners

### 4. dynamic-pages.ts
Lazy loading with PageBuilder function for database queries.

**Features:**
- Dynamic page generation
- Simulated database queries
- Pagination on-demand
- Performance optimized for large datasets
- Event tracking

### 5. custom-styling.ts
Fully customized pagination appearance.

**Features:**
- Custom button labels and emojis
- Custom button colors/styles
- Custom page display format
- Both button and footer indicators

## Running Examples

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# .env file
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here
```

3. Compile TypeScript:
```bash
npm run build
```

4. Run an example:
```bash
node dist/examples/basic-pagination.js
```

## Tips

- Always handle errors in production
- Use appropriate timeout values for your use case
- Consider using ephemeral messages for private pagination
- Use single-user mode for user-specific content
- Implement custom filters for permission-based pagination
- Use PageBuilder for large datasets to optimize performance
