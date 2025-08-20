# 📌 JSON Editor Clone (Privacy-First)

## 🎯 Goal
Build a modern **JSON editor web application** (like [jsoneditoronline.org](https://jsoneditoronline.org)) where **all JSON data is processed locally in the user’s browser**, ensuring privacy, fast performance, and offline availability.  
The app should have a **clean, modern UI**.

---

## 🛠️ Features

### Core Features
- **Multiple Editing Modes**
  - Tree view (expand/collapse objects).
  - Code/text editor (with syntax highlighting, auto-format).
  - Form/Table view (editable tabular representation).

- **JSON Validation & Formatting**
  - Validate JSON syntax.
  - Format/pretty print.
  - Minify/compact JSON.
  - Error highlighting with helpful messages.

- **File & Input Handling**
  - Import JSON from: file, clipboard, URL, drag-and-drop.
  - Export JSON to: file download, clipboard.

- **Performance**
  - Handle **large JSON files (100MB+)** using virtualization.
  - Smooth UI even with deep/nested structures.

- **Privacy-First**
  - No backend processing — all operations in **browser memory**.
  - JSON never leaves the user’s device.
  - Offline support with **Service Workers**.

- **User Experience**
  - Dark/Light themes.
  - Keyboard shortcuts.
  - Mobile & tablet responsive.
  - Undo/Redo support.

---

### Advanced Features (Phase 2)
- Shareable links (by encoding JSON in URL hash, no backend).
- PWA support for offline usage.

---

## 🎨 UI & UX
- Minimal, **developer-friendly design**.
- Clear **toolbar with actions** (import, export, format, validate, diff).
- Responsive grid-based layout.
- Smooth transitions & animations for tree expansion/collapsing.

---

## ⚡ Tech Stack

### Current Stack
- **Frontend Framework:** React + Vite
- **Editor Libraries:** Monaco Editor
- **Validation:** AJV
- **State Management:** Zustand
- **Styling:** Tailwind CSS

### Suggested/Future Stack
- **Editor Libraries:**
  - [`jsoneditor`](https://github.com/josdejong/jsoneditor) for tree/code views.
- **Storage:** localStorage / IndexedDB for autosave.
- **Deployment:** Vercel/Netlify (static hosting).

---

## 🚀 Building and Running

To get started with the project, follow these steps:

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
    This will start the development server and open the application in your browser at `http://localhost:5173`.

3.  **Build for Production:**
    ```bash
    npm run build
    ```
    This will create a `dist` directory with the production-ready files.

4.  **Lint the Code:**
    ```bash
    npm run lint
    ```
    This will run ESLint to check for any linting errors.

---

## 📝 Development Conventions

*   **State Management:** The project uses Zustand for state management. The store is located in `src/store/jsonStore.ts`.
*   **Styling:** The project uses Tailwind CSS for styling. The configuration is in `tailwind.config.js`.
*   **Components:** The UI is built with React components, located in `src/components`.
*   **Types:** TypeScript types are defined in `src/types`.
*   **Utils:** Utility functions are located in `src/utils`.