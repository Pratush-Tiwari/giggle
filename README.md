# Giggle Chrome Extension

A Chrome extension built with React 19, TypeScript, and Vite.

## Setup

1. Install dependencies:

```bash
yarn install
```

2. Start development server:

```bash
yarn dev
```

3. Build for production:

```bash
yarn build
```

## Loading the Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select the `dist` directory from this project

## Project Structure

- `src/` - Source code
  - `App.tsx` - Main application component
  - `main.tsx` - Application entry point
  - `index.css` - Global styles
- `manifest.json` - Chrome extension configuration
- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript configuration

## Development

The extension uses:

- React 19
- TypeScript (strict mode)
- Vite
- Tailwind CSS
