# The Lakeinator - Frontend

Modern Next.js frontend for The Lakeinator OSINT platform.

## Quick Start

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Tech Stack

- **Next.js 16** - React framework with Turbopack
- **React 19** - UI library
- **Tailwind CSS 4** - Utility-first CSS
- **TypeScript 5** - Type safety
- **Framer Motion** - Animations
- **react-force-graph-2d/3d** - Graph visualizations
- **Lucide React** - Icon library

## Project Structure

```
src/
├── app/
│   ├── graph/          # 2D visualization page
│   ├── graph-3d/       # 3D visualization page
│   ├── nexus/          # OSINT directory page
│   ├── recon/          # Reconnaissance page
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
└── components/
    └── TerminalStream.tsx  # Live log stream component
```

## Pages

### Home (`/`)
Landing page with navigation to all features

### Nexus Directory (`/nexus`)
Browse OSINT tools organized by category

### Passive Recon Hub (`/recon`)
Run reconnaissance scans and view results

### 2D Graph (`/graph`)
Visualize entity relationships in 2D

### 3D Visualization (`/graph-3d`)
Explore data in 3D space

## Configuration

The frontend connects to the backend API at `http://localhost:8000` by default.

To change this, update the API calls in the respective page components.

## Building for Production

```bash
npm run build
npm start
```

The optimized build will be available in the `.next` directory.

## Development

- Hot reload enabled by default
- TypeScript strict mode enabled
- ESLint configured with Next.js rules

## Styling

- Cyberpunk/terminal aesthetic
- Green monochrome color scheme
- CRT monitor effects
- Responsive design
- Dark mode only
