# Contributing to Discord Dynamic Pagination

Thank you for your interest in contributing to discord-dynamic-pagination! We welcome contributions from the community.

## 🤝 How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:
- Clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Your environment (Node version, discord.js/Eris version, etc.)
- Code samples if applicable

### Suggesting Features

Feature suggestions are welcome! Please:
- Check if the feature has already been suggested
- Clearly describe the feature and its benefits
- Provide examples of how it would be used
- Consider backward compatibility

### Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/jersuxsss/discord-dynamic-pagination.git
   cd discord-dynamic-pagination
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Make your changes**
   - Write clean, readable code
   - Follow the existing code style
   - Add tests for new features
   - Update documentation as needed

5. **Run tests and linting**
   ```bash
   npm run lint
   npm test
   npm run build
   ```

6. **Commit your changes**
   ```bash
   git commit -m "feat: add amazing feature"
   ```
   
   Follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting, etc.)
   - `refactor:` - Code refactoring
   - `test:` - Test changes
   - `chore:` - Build/tooling changes

7. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   Then open a Pull Request on GitHub.

## 📝 Code Style

- Use TypeScript
- Follow ESLint rules (run `npm run lint`)
- Use Prettier for formatting (run `npm run format`)
- Write clear comments for complex logic
- Use meaningful variable and function names
- Keep functions focused and concise

## 🧪 Testing

- Write tests for all new features
- Ensure existing tests pass
- Aim for high code coverage
- Use descriptive test names

```typescript
describe('Paginator', () => {
    it('should navigate to next page when next button clicked', async () => {
        // Test implementation
    });
});
```

## 📚 Documentation

When adding features:
- Update README.md with examples
- Add JSDoc comments to code
- Update CHANGELOG.md
- Add examples if applicable
- Update TypeScript type definitions

## 🎯 Development Workflow

1. **Local Development**
   ```bash
   npm run build:watch  # Auto-rebuild on changes
   npm run test:watch   # Auto-test on changes
   ```

2. **Before Committing**
   ```bash
   npm run lint         # Check code style
   npm run format       # Format code
   npm test             # Run all tests
   npm run build        # Ensure it builds
   ```

3. **Testing with a Bot**
   - Create a test bot in a private server
   - Use `npm link` to test locally
   ```bash
   npm run build
   npm link
   cd /path/to/test-bot
   npm link discord-dynamic-pagination
   ```

## 🐛 Debugging

- Use TypeScript's type checking
- Add console.logs in development
- Use debugger statements
- Check Discord API errors
- Test with both discord.js and Eris if possible

## 🔍 Code Review

Pull requests will be reviewed for:
- Code quality and style
- Test coverage
- Documentation completeness
- Backward compatibility
- Performance implications
- Security considerations

## ⚡ Performance Guidelines

- Avoid unnecessary re-renders
- Use lazy loading for large datasets
- Minimize API calls
- Cache when appropriate
- Consider memory usage

## 🛡️ Security

- Never commit credentials or tokens
- Validate all user inputs
- Use environment variables for secrets
- Follow Discord API best practices
- Report security issues privately

## 📋 Checklist

Before submitting a PR:
- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] New tests added for features
- [ ] Documentation updated
- [ ] CHANGELOG updated
- [ ] No breaking changes (or clearly documented)
- [ ] TypeScript types updated
- [ ] Examples added/updated if needed

## 💬 Getting Help

- Check existing issues and PRs
- Read the documentation
- Ask questions in pull request comments
- Be respectful and patient

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to discord-dynamic-pagination! 🎉
