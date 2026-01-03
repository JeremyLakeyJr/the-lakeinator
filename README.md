# The Lakeinator

An all-in-one OSINT (Open Source Intelligence) platform designed for deep reconnaissance, link analysis, and intelligence automation.

![Status](https://img.shields.io/badge/status-production-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## Features

### 🎯 Core Capabilities
- **Nexus Directory**: Curated collection of OSINT tools and resources organized by category
- **Passive Reconnaissance**: Multi-source intelligence gathering from public APIs
- **2D/3D Visualization**: Interactive graph-based entity relationship mapping
- **Intelligence Export**: Generate downloadable JSON reports

### 🔍 Data Sources
- **DNS Intelligence**: Certificate transparency logs via crt.sh for subdomain discovery
- **WHOIS Data**: Registration and ownership metadata via RDAP protocol
- **IoT Discovery**: Internet-connected device scanning via Shodan API (optional)

### 🎨 User Interface
- Cyberpunk-themed terminal aesthetic
- Real-time intelligence streaming logs
- CRT monitor effects with scanlines and flicker
- Fully responsive design

## Architecture

### Frontend (`/client`)
- **Framework**: Next.js 16 with React 19
- **Styling**: Tailwind CSS 4
- **Visualizations**: 
  - `react-force-graph-2d` for 2D relationship mapping
  - `react-force-graph-3d` for 3D spatial visualization
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend (`/server`)
- **Framework**: FastAPI (Python)
- **Architecture**: Modular plugin-based system
- **Async I/O**: httpx for concurrent API requests
- **CORS**: Configured for local development

## Getting Started

### Prerequisites
- **Python 3.8+** for backend
- **Node.js 18+** for frontend
- **npm** or **yarn** package manager

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/JeremyLakeyJr/the-lakeinator.git
cd the-lakeinator
```

#### 2. Backend Setup
```bash
cd server

# Install Python dependencies
pip install -r requirements.txt

# (Optional) Configure environment variables
cp .env.example .env
# Edit .env and add your SHODAN_API_KEY if desired

# Start the FastAPI server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

#### 3. Frontend Setup
Open a new terminal window:

```bash
cd client

# Install Node dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Build

#### Backend
```bash
cd server
uvicorn main:app --host 0.0.0.0 --port 8000
```

#### Frontend
```bash
cd client
npm run build
npm start
```

## Usage Guide

### 1. Nexus Directory
Navigate to the "Nexus Directory" to browse curated OSINT tools organized by category:
- Username Search
- Email Addresses
- Domain Names
- IoT/Devices

### 2. Passive Reconnaissance
1. Navigate to "Passive Recon Hub"
2. Enter a target domain (e.g., `example.com`)
3. Click "INITIATE_SCAN"
4. View discovered entities (subdomains, registration data, etc.)
5. Export results using "GENERATE_REPORT"

### 3. Relationship Mapping
**2D Graph:**
1. Navigate to "2D Relationship Mapper"
2. Enter a target domain
3. Click "GENERATE_GRAPH"
4. Interact with the force-directed graph
5. Nodes are color-coded by entity type

**3D Visualization:**
1. Navigate to "3D Nexus Visualization"
2. Enter a target domain
3. Click "PROJECT_3D_MAP"
4. Use mouse to rotate and zoom the 3D space

## API Endpoints

### `GET /`
Health check endpoint
```json
{
  "message": "Welcome to The Lakeinator Intelligence Core",
  "status": "online"
}
```

### `GET /api/directory`
Retrieve the OSINT tools directory
```json
{
  "categories": [...]
}
```

### `GET /api/recon?target={domain}`
Execute reconnaissance modules against a target
```json
{
  "target": "example.com",
  "results_count": 42,
  "entities": [
    {
      "module": "DNS_PASSIVE",
      "type": "subdomain",
      "value": "www.example.com",
      "metadata": {}
    }
  ]
}
```

## Module System

The backend uses a plugin-based architecture. Each module extends `BaseModule`:

```python
from modules.base import BaseModule
from typing import List, Dict, Any

class CustomModule(BaseModule):
    @property
    def name(self) -> str:
        return "MODULE_NAME"
    
    @property
    def description(self) -> str:
        return "Module description"
    
    async def execute(self, target: str) -> List[Dict[str, Any]]:
        # Implementation
        return [self.create_entity("type", "value", {"key": "metadata"})]
```

### Available Modules
- **DNSReconModule**: Certificate transparency subdomain discovery
- **WHOISReconModule**: Domain registration information via RDAP
- **ShodanReconModule**: Internet-connected device discovery (requires API key)

### Adding New Modules
1. Create a new file in `/server/modules/`
2. Extend `BaseModule`
3. Implement required properties and `execute()` method
4. Register the module in `/server/main.py`

## Configuration

### Environment Variables (Backend)
Create a `.env` file in the `/server` directory:

```bash
# Optional: Shodan API Key
SHODAN_API_KEY=your_api_key_here

# Server settings (optional)
API_HOST=0.0.0.0
API_PORT=8000
```

### CORS Configuration
By default, the backend allows requests from `http://localhost:3000`. To modify CORS settings, edit `/server/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://yourdomain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Project Structure

```
the-lakeinator/
├── client/                 # Next.js frontend
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   │   ├── graph/      # 2D visualization page
│   │   │   ├── graph-3d/   # 3D visualization page
│   │   │   ├── nexus/      # Directory page
│   │   │   ├── recon/      # Reconnaissance page
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx    # Home page
│   │   └── components/
│   │       └── TerminalStream.tsx
│   ├── package.json
│   └── tsconfig.json
├── server/                 # FastAPI backend
│   ├── data/
│   │   └── directory.json  # OSINT tools directory
│   ├── modules/
│   │   ├── base.py         # Base module class
│   │   ├── dns_recon.py
│   │   ├── whois_recon.py
│   │   └── shodan_recon.py
│   ├── main.py             # FastAPI application
│   ├── requirements.txt
│   └── .env.example
├── LICENSE
└── README.md
```

## Security Considerations

⚠️ **Important Security Notes:**

1. **API Keys**: Never commit API keys to version control. Use environment variables.
2. **Rate Limiting**: The platform does not implement rate limiting. Consider adding this for production.
3. **Input Validation**: Basic validation is included, but additional sanitization may be needed for production use.
4. **CORS**: Restrict allowed origins in production environments.
5. **HTTPS**: Always use HTTPS in production deployments.
6. **Legal Compliance**: Ensure your reconnaissance activities comply with applicable laws and terms of service.

## Development Status

✅ **Completed Features:**
- [x] Scaffold Next.js frontend with modern UI
- [x] Scaffold FastAPI backend with modular architecture
- [x] Implement "Cyber" terminal aesthetic with animations
- [x] Intelligence Core Plugin system (DNS, WHOIS, Shodan modules)
- [x] 2D and 3D graph visualizations
- [x] OSINT directory/nexus system
- [x] Report generation and export
- [x] Production build optimization

🚧 **Future Enhancements:**
- [ ] Data persistence (PostgreSQL/Neo4j integration)
- [ ] User authentication and session management
- [ ] Rate limiting and caching
- [ ] Additional reconnaissance modules
- [ ] Real-time collaborative investigations
- [ ] Dark web monitoring integration
- [ ] Automated threat intelligence feeds

## Performance

- **Backend**: Async I/O with concurrent module execution
- **Frontend**: Static generation with client-side hydration
- **Build**: Optimized production builds with Turbopack
- **Bundle Size**: Optimized with tree-shaking and code splitting

## Troubleshooting

### Backend Issues

**Port already in use:**
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9
# Or use a different port
uvicorn main:app --reload --port 8001
```

**Module import errors:**
```bash
# Ensure you're in the server directory
cd server
python -m pip install -r requirements.txt
```

### Frontend Issues

**Build failures:**
```bash
# Clear cache and rebuild
cd client
rm -rf .next node_modules
npm install
npm run build
```

**API connection errors:**
- Ensure backend is running on `http://localhost:8000`
- Check CORS configuration
- Verify no firewall blocking

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- **Python**: Follow PEP 8 style guide
- **TypeScript/React**: Follow Airbnb style guide
- **Commits**: Use conventional commit messages

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This tool is intended for legitimate security research and educational purposes only. Users are responsible for ensuring their use complies with applicable laws and regulations. The authors assume no liability for misuse or damage caused by this software.

## Acknowledgments

- Certificate Transparency Logs (crt.sh)
- RDAP Protocol
- Shodan API
- The OSINT community

## Contact

**Author**: Jeremy Lakey Jr  
**Repository**: [github.com/JeremyLakeyJr/the-lakeinator](https://github.com/JeremyLakeyJr/the-lakeinator)

---

**Built with ❤️ for the OSINT community**
