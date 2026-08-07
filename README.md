<p align="center">
  <img src="app-icon.png" alt="notes.md logo" width="128" />
</p>

<h1 align="center">notes.md</h1>

<p align="center">
  A lightweight desktop application for writing and previewing Markdown notes.
</p>

<p align="center">
  <a href="https://github.com/doucaml/notes.md/releases/latest">Latest release</a>
  ·
  <a href="https://github.com/doucaml/notes.md/issues">Report an issue</a>
</p>

## Features

- Markdown editor with preview
- GitHub-flavored Markdown rendering
- Simple desktop experience

## Screenshots

<p align="center">
  <img src="screenshots/home.png" alt="notes.md home screen" width="31%" />
  <img src="screenshots/note-editor.png" alt="notes.md editor mode" width="31%" />
  <img src="screenshots/note-preview.png" alt="notes.md preview mode" width="31%" />
</p>

## Installation

Download the latest version from the [GitHub Releases page](https://github.com/doucaml/notes.md/releases/latest).

Choose the package matching your operating system:

- **macOS:** `.dmg`
- **Windows:** `.msi` or `.exe`
- **Linux:** `.AppImage`, `.deb` or `.rpm`

Alternatively, you can install notes.md through a package manager:

- **Homebrew** (macOS / Linux): use the custom tap [doucaml/homebrew-notes-md](https://github.com/doucaml/homebrew-notes-md)

  ```bash
  brew tap doucaml/homebrew-notes-md
  brew install --cask notes-md
  ```

- **Snap** (Linux): available on [Snapcraft](https://snapcraft.io/notes-md)

  ```bash
  snap install notes-md
  ```

Keep your installation up to date:

```bash
brew upgrade --cask notes-md
snap refresh notes-md
```

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) (with npm)
- [Rust](https://www.rust-lang.org/)
- The system dependencies required by [Tauri](https://tauri.app/start/prerequisites/)

### Setup

Clone the repository and install the dependencies:

```bash
git clone https://github.com/doucaml/notes.md.git
cd notes.md
npm install
```

### Run in development mode

```bash
npm run tauri dev
```

### Build the application

```bash
npm run tauri build
```

The project is built with React, TypeScript, Vite, Tailwind CSS and Tauri 2.

## License

This project is released under the MIT License. See [LICENSE](LICENSE) for details.
