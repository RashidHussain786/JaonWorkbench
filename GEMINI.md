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

---

## ✨ Recent Updates & Improvements

This section outlines the significant features and bug fixes implemented to enhance the JSON Editor's functionality and user experience.

### New Features

*   **Base64 Support:**
    *   Introduced a new input mode allowing users to switch between JSON and Base64 content editing.
    *   Implemented conditional validation for both JSON and Base64 input types, ensuring content integrity based on the selected mode.
    *   Added a "Decode Base64" action button that decodes Base64 strings, attempts to parse and format the result as JSON, updates the editor content, and automatically switches the input mode to JSON.
    *   The status bar now dynamically updates to display "Valid Base64" when valid Base64 content is present.

### UI/UX Enhancements

*   **Decode Icon Behavior:** The "Decode Base64" icon is now consistently visible in the toolbar but is disabled when the editor is not in Base64 input mode, providing clearer user feedback.
*   **Cursor Position on Paste:** Implemented a fix to ensure the editor cursor remains at the end of pasted content, particularly for Base64 strings, by trimming leading/trailing whitespace.
*   **Table View Overflow:** Addressed an issue where large JSON data caused the Table View to overflow its container. Table cells now correctly wrap content (`break-words`) to maintain layout integrity.

### Bug Fixes & Stability

*   **Infinite Loop Resolution:** Fixed a critical "Maximum update depth exceeded" error by refining `useEffect` dependencies in the `useJsonData` hook, preventing recursive state updates.
*   **`formatJson` Usage Correction:** Resolved issues related to the `formatJson` utility's import and usage, ensuring correct JSON formatting across the application.
*   **Monaco Editor Diagnostics:** Explicitly configured Monaco Editor to disable JSON diagnostics when the input mode is set to Base64, preventing erroneous "Expected a JSON object" validation messages.
*   **Loading State Restoration:** Re-introduced `isLoading` and `setLoading` properties to the `jsonStore` to correctly manage and reflect application loading states, particularly during file operations.