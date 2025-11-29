# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-29

### Added

#### Core Features
- Initial release of Discord Dynamic Pagination
- Complete TypeScript implementation with full type safety
- Library-agnostic architecture supporting multiple Discord libraries
- Event-driven paginator system with comprehensive event hooks

#### Adapters
- **DiscordJSAdapter** - Full support for discord.js v14+
- **ErisAdapter** - Full support for Eris v0.17+ with custom collector implementation
- Extensible adapter interface for adding new library support

#### Pagination Types
- `BUTTONS` - Traditional button-based navigation (First, Previous, Next, Last)
- `SELECT_MENU` - Select menu dropdown for direct page jumping
- `HYBRID` - Combined buttons and select menu for maximum flexibility

#### Advanced Features
- **Multi-User Support** - Multiple users can interact with same pagination, or restrict to single user
- **Custom Styling** - Full customization of button labels, emojis, and styles
- **Page Display** - Configurable page indicators (button, footer, or both)
- **Lazy Loading** - PageBuilder function support for dynamic page generation
- **Auto-Cleanup** - Automatic timeout handling and component disabling
- **User Filtering** - Custom filter functions to restrict interactions
- **Ephemeral Support** - Send pagination visible only to command user
- **Event System** - Full event hooks: ready, pageChange, timeout, destroy, error
- **Smart Navigation** - Auto-disable first/previous buttons on page 1, last/next on final page
- **Timeout Management** - Configurable timeouts with automatic cleanup
- **Delete on End** - Option to automatically delete message on timeout

#### Developer Experience
- Full TypeScript type definitions
- Comprehensive JSDoc documentation
- Rich error messages with context
- Event system for monitoring pagination state
- Detailed API reference

#### Documentation
- Comprehensive README with examples
- Quick start guides for discord.js and Eris
- Advanced usage patterns (lazy loading, custom styling, filters)
- Complete API reference documentation
- 5 example implementations:
  - Basic pagination
  - Select menu navigation
  - Hybrid mode
  - Dynamic page loading
  - Custom styling
- Contributing guidelines
- MIT License

#### Testing
- Jest configuration
- Test structure setup
- Example test files

#### Infrastructure
- ESLint configuration for code quality
- Prettier configuration for code formatting
- TypeScript compilation setup
- NPM package configuration
- GitHub repository setup

---

## Upcoming Features

### Planned for v1.1.0
- Persistent pagination (save state and resume later)
- Page caching for performance optimization
- Search/filter functionality within pages
- Custom footer text for each page
- Page jump validation callbacks
- Keyboard shortcuts (Discord mobile support)

### Planned for v1.2.0
- Template system for common pagination patterns
- Built-in page generation helpers
- Analytics and metrics tracking
- Rate limiting per user
- Pagination groups (multiple paginators linked)
- Auto-refresh for dynamic content

### Planned for v2.0.0
- Support for Discord modals integration
- Custom component builders
- Advanced filtering with autocomplete
- Visual page preview
- Export pagination to PDF/image
- Pagination history (back/forward through page history)

---

## Version History

### [1.0.0] - 2025-11-29
- 🎉 Initial release

[1.0.0]: https://github.com/jersuxsss/discord-dynamic-pagination/releases/tag/v1.0.0
