# Markdown Editor

A markdown editor built with Svelte 5 and SvelteKit, featuring a split-pane interface with live preview and dark mode support.

## Features

- **Split-pane editor** - Write markdown on the left, see live preview on the right
- **File system integration** - Open and save files directly using the native File System Access API
- **Document management** - Browse and switch between multiple markdown files
- **Dark mode** - Toggle between light and dark themes with persistent preference
- **Mobile responsive** - Optimized for desktop and mobile devices

## Tech Stack

- Svelte 5 (with runes)
- SvelteKit 2
- Tailwind CSS v4
- TypeScript
- Playwright (E2E testing)
- Storybook (component documentation)

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Open in browser
pnpm run dev -- --open
```

## Development

```bash
# Run Storybook
pnpm run storybook

# Run tests
pnpm test

# Build for production
pnpm run build

# Preview production build
pnpm run preview
```

## Browser Requirements

This app uses the [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API), which requires a modern browser:
- Chrome/Edge 86+
- Safari 15.2+
- Opera 72+

Firefox does not currently support this API.

## License

MIT
