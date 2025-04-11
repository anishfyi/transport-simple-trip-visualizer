# Trip Visualizer

A modern Angular application for visualizing transport trips with support for continued and repeated trip detection. Built with Angular 17+ and Vite.

## Features

- 🚀 Modern Angular 17+ with Vite
- 📊 Interactive SVG-based trip visualization
- 🔄 Automatic detection of continued trips
- 🔁 Identification of repeated trips
- 🎨 Responsive and modern UI
- 📱 Mobile-friendly design
- 🎯 Real-time updates

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or later)
- npm (v9 or later) or yarn
- Git

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/transport-simple-trip-visualizer.git
cd transport-simple-trip-visualizer
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

## Development

To start the development server:

```bash
npm run dev
# or
yarn dev
```

Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── trip-input/      # Trip input form component
│   │   └── trip-visualizer/ # SVG visualization component
│   ├── models/              # Data models
│   ├── services/            # Services
│   └── shared/              # Shared utilities
├── assets/                  # Static assets
└── styles/                  # Global styles
```

## Building

To build the project for production:

```bash
npm run build
# or
yarn build
```

## Features in Detail

### Trip Visualization
- SVG-based interactive visualization
- Automatic layout of trip nodes
- Different path styles for continued and repeated trips
- Responsive design that adapts to screen size

### Trip Input
- Simple form for adding new trips
- Validation for required fields
- Clear form functionality
- Real-time updates to visualization

### Trip Analysis
- Automatic detection of continued trips
- Identification of repeated trips
- Visual differentiation between trip types
- Efficient trip relationship algorithms