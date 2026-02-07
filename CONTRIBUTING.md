# Contributing to Summarizer

First off, thank you for considering contributing to Summarizer! It's people like you that make this project better for everyone.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** to demonstrate the steps
- **Describe the behavior you observed** and what you expected
- **Include screenshots or animated GIFs** if applicable
- **Include your environment details** (OS, Node version, browser version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the suggested enhancement
- **Explain why this enhancement would be useful**
- **List any alternative solutions** you've considered

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following our coding standards
3. **Add tests** if you've added code that should be tested
4. **Ensure the test suite passes** (`npm test`)
5. **Update documentation** as needed
6. **Write a clear commit message** following our commit conventions

## Development Setup

### Prerequisites

- Node.js >= 18
- Docker & Docker Compose
- PostgreSQL 16 (if not using Docker)
- Git

### Setup Steps

```bash
# Clone your fork
git clone https://github.com/your-username/summarizer.git
cd summarizer

# Add upstream remote
git remote add upstream https://github.com/original-owner/summarizer.git

# Install dependencies
cd backend
npm install

# Copy environment file
cp .env.example .env

# Generate secure tokens
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('ADMIN_STATS_TOKEN=' + require('crypto').randomBytes(32).toString('hex'))"

# Edit .env and add the generated tokens

# Start services
docker compose up -d

# Check logs
docker logs summarizer-backend-1 -f
```

### Running Tests

```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Code Style

We use ESLint and Prettier to maintain code quality:

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## Coding Standards

### JavaScript/Node.js

- Use **ES6+ features** where appropriate
- Follow **async/await** pattern for asynchronous code
- Use **const** by default, **let** when reassignment is needed
- Avoid **var**
- Use **arrow functions** for callbacks
- Use **template literals** for string interpolation
- Add **JSDoc comments** for functions and classes

### File Organization

```javascript
// 1. External imports
const express = require('express');
const jwt = require('jsonwebtoken');

// 2. Internal imports
const config = require('./lib/config');
const { query } = require('./lib/db');

// 3. Constants
const MAX_RETRIES = 3;

// 4. Helper functions
function helperFunction() {
  // ...
}

// 5. Main logic
module.exports = async (req, res) => {
  // ...
};
```

### Error Handling

Always use proper error handling:

```javascript
try {
  const result = await someAsyncOperation();
  return result;
} catch (error) {
  log('error', 'Operation failed', { error: error.message, stack: error.stack });
  throw error;
}
```

### Logging

Use structured logging:

```javascript
function log(level, message, meta = {}) {
  const timestamp = new Date().toISOString();
  console.log(JSON.stringify({ timestamp, level, component: 'module-name', message, ...meta }));
}

log('info', 'User registered', { userId: user.id, email: user.email });
log('error', 'Database connection failed', { error: err.message });
```

### Database Queries

Always use parameterized queries:

```javascript
// ✅ Good
const result = await query(
  'SELECT * FROM users WHERE email = $1',
  [email]
);

// ❌ Bad - SQL injection risk
const result = await query(
  `SELECT * FROM users WHERE email = '${email}'`
);
```

### Security

- **Never commit secrets** or API keys
- **Validate all user input**
- **Use parameterized queries** for database operations
- **Hash passwords** with bcrypt
- **Use HTTPS** in production
- **Set secure headers** (already configured in CORS module)

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Code style changes (formatting, missing semi-colons, etc.)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Performance improvement
- **test**: Adding or updating tests
- **chore**: Changes to build process or auxiliary tools

### Examples

```
feat(auth): add password reset functionality

Implement password reset flow with email verification.
Includes new endpoints and email templates.

Closes #123
```

```
fix(extension): resolve popup positioning issue

The popup was appearing off-screen on some websites.
Fixed by calculating viewport bounds before positioning.

Fixes #456
```

## Branch Naming

Use descriptive branch names:

- `feature/add-password-reset`
- `fix/popup-positioning`
- `docs/update-readme`
- `refactor/auth-module`

## Pull Request Process

1. **Update documentation** if you've changed APIs or added features
2. **Add tests** for new functionality
3. **Ensure all tests pass** locally
4. **Update CHANGELOG.md** with your changes
5. **Request review** from maintainers
6. **Address feedback** promptly
7. **Squash commits** if requested before merging

### PR Title Format

Use the same format as commit messages:

```
feat(auth): add OAuth2 support
fix(db): resolve connection pool leak
docs: update API documentation
```

### PR Description Template

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## How Has This Been Tested?
Describe the tests you ran and how to reproduce them.

## Checklist
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Related Issues
Closes #(issue number)
```

## Testing Guidelines

### Unit Tests

- Test individual functions and modules
- Mock external dependencies
- Aim for high code coverage (>80%)

### Integration Tests

- Test API endpoints end-to-end
- Use test database
- Clean up test data after each test

### Test Structure

```javascript
describe('Authentication', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user with valid credentials', async () => {
      // Arrange
      const userData = {
        email: 'test@example.com',
        password: 'securepassword123'
      };

      // Act
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body.user.email).toBe(userData.email);
    });

    it('should reject registration with invalid email', async () => {
      // Test implementation
    });
  });
});
```

## Documentation

- Update README.md for user-facing changes
- Add JSDoc comments for new functions
- Update API documentation for endpoint changes
- Include examples in documentation

## Release Process

Maintainers will handle releases:

1. Update version in `package.json`
2. Update CHANGELOG.md
3. Create git tag
4. Push to GitHub
5. Create GitHub release
6. Publish to npm (if applicable)

## Questions?

Feel free to:
- Open an issue for questions
- Join our discussions on GitHub
- Contact maintainers directly

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- GitHub contributors page

Thank you for contributing! 🎉
