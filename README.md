# notes.md

A lightweight desktop markdown notes app built with Tauri, React, and Tailwind CSS.

> **Status:** Early development / WIP

## Features

- Live markdown editor with split preview
- Multi-window support (main window + detached note editor)
- Custom title bar with native window controls
- GitHub-flavored markdown rendering

## Tech Stack

- **Frontend:** React 19 + TypeScript + Vite
- **Desktop:** Tauri v2
- **Styling:** Tailwind CSS v4
- **Markdown:** react-markdown + remark-gfm

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/)
- [Rust](https://www.rust-lang.org/) (required by Tauri)

### Development

```bash
bun tauri dev
```

### Build

```bash
bun tauri build
```

## License

MIT
