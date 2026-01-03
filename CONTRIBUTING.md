# Contributing to The Lakeinator

First off, thank you for considering contributing to The Lakeinator! It's people like you that make this OSINT platform better for everyone.

## Code of Conduct

By participating in this project, you are expected to uphold our community standards. Please be respectful, professional, and constructive in all interactions.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** - include code snippets, screenshots, or links
- **Describe the behavior you observed and expected**
- **Include your environment details** (OS, Python/Node version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description of the enhancement**
- **Explain why this enhancement would be useful**
- **List examples of how the enhancement would be used**

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following our coding standards
3. **Test your changes** thoroughly
4. **Update documentation** as needed
5. **Submit a pull request** with a clear description

#### Pull Request Guidelines

- Follow the existing code style
- Write clear, descriptive commit messages
- Update README.md if needed
- Add/update tests for new features
- Ensure all tests pass
- Keep pull requests focused on a single concern

## Development Setup

### Backend Setup

```bash
cd server
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Frontend Setup

```bash
cd client
npm install
```

### Running Tests

**Backend:**
```bash
cd server
python3 health_check.py
```

**Frontend:**
```bash
cd client
npm run lint
npm run build
```

## Coding Standards

### Python (Backend)

- Follow **PEP 8** style guide
- Use **type hints** for function parameters and return values
- Write **docstrings** for all classes and functions
- Use **async/await** for I/O operations
- Handle exceptions appropriately
- Keep functions focused and single-purpose

Example:
```python
async def fetch_data(target: str) -> List[Dict[str, Any]]:
    """
    Fetch reconnaissance data for the given target.
    
    Args:
        target: Domain or IP address to investigate
        
    Returns:
        List of entity dictionaries
    """
    # Implementation
    pass
```

### TypeScript/React (Frontend)

- Use **TypeScript** with proper types (no `any` unless absolutely necessary)
- Follow **React best practices** and hooks patterns
- Use **functional components** with hooks
- Keep components focused and reusable
- Extract complex logic into custom hooks
- Use meaningful variable and function names

Example:
```typescript
interface DataResult {
  target: string;
  entities: Entity[];
}

const useReconData = (target: string): DataResult | null => {
  const [data, setData] = useState<DataResult | null>(null);
  // Implementation
  return data;
};
```

### Commit Messages

Follow the **Conventional Commits** specification:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation only
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Examples:
```
feat: add support for IPv6 addresses
fix: resolve CORS issue in production
docs: update API endpoint documentation
refactor: simplify DNS module error handling
```

## Adding New Recon Modules

To add a new reconnaissance module:

1. **Create a new file** in `server/modules/` (e.g., `new_module.py`)

2. **Extend BaseModule**:
```python
from modules.base import BaseModule
from typing import List, Dict, Any

class NewModule(BaseModule):
    @property
    def name(self) -> str:
        return "MODULE_NAME"
    
    @property
    def description(self) -> str:
        return "Description of what this module does"
    
    async def execute(self, target: str) -> List[Dict[str, Any]]:
        results = []
        # Your implementation
        return results
```

3. **Register the module** in `server/main.py`:
```python
from modules.new_module import NewModule

RECON_MODULES = [
    DNSReconModule(),
    WHOISReconModule(),
    ShodanReconModule(),
    NewModule(),  # Add here
]
```

4. **Test your module** thoroughly with various inputs

5. **Update documentation** to describe the new module

## Security

### Reporting Security Issues

**Do not** open public issues for security vulnerabilities. Instead:

1. Email details to the repository maintainer
2. Include steps to reproduce
3. Describe the potential impact
4. Suggest a fix if possible

### Security Best Practices

When contributing, ensure:

- No hardcoded credentials or API keys
- Input validation for all user inputs
- Proper error handling that doesn't leak sensitive info
- Safe handling of external API responses
- No execution of untrusted code
- HTTPS for all external requests

## Documentation

Good documentation is crucial. When contributing:

- Update README.md for user-facing changes
- Add docstrings/comments for complex logic
- Include examples where helpful
- Keep documentation concise and clear
- Update API documentation for endpoint changes

## Questions?

Feel free to:

- Open a discussion on GitHub
- Comment on relevant issues
- Reach out to maintainers

## Recognition

Contributors will be recognized in:

- The repository's contributors list
- Release notes for significant contributions
- The README acknowledgments section

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

Thank you for contributing to The Lakeinator! 🎯
