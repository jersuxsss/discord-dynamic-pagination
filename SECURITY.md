# Security Policy

## Supported Versions

We release patches for security vulnerabilities for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please send an email to the maintainer. Please do not create a public GitHub issue.

We will respond as quickly as possible and work with you to address the issue.

## Security Best Practices

When using discord-dynamic-pagination:

1. **Input Validation**: Ensure all data passed to pagination pages is sanitized.
2. **Button Handling**: The library handles interaction security, but ensure your custom button handlers are secure.
3. **Ephemeral Messages**: Use ephemeral messages for sensitive data.

Thank you for helping keep discord-dynamic-pagination and its users safe!
