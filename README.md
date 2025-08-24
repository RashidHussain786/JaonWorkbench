# JSON Workbench

A modern, privacy-first JSON editor web application built with React, Vite, and Monaco Editor. This application allows you to edit, validate, and format JSON data directly in your browser. All data is processed locally, ensuring your data remains private.


## Features

*   **Multiple Editor Modes**: Switch between a code editor, a tree view, and a table view to visualize and edit your JSON data.

    *   **Code Editor**: A powerful editor with syntax highlighting, autocompletion, and validation.
    *   **Tree View**: A hierarchical view of your JSON data, with the ability to expand and collapse nodes.
    *   **Table View**: A tabular view of your JSON data, making it easy to view and edit arrays of objects.

*   **JSON Validation**: Real-time JSON validation with detailed error messages.
*   **Format and Minify**: Beautify your JSON data with a single click or minify it to save space.
*   **File Handling**: Import JSON from files, clipboard, or by dragging and dropping. Export your work to a file or copy it to the clipboard.
*   **Large File Support**: Handles large JSON files efficiently.
*   **Privacy-First**: All processing is done in the browser. No data is ever sent to a server.
*   **Dark/Light Theme**: Switch between dark and light themes for your comfort.
*   **Compare JSON, Files, and Folders**: Compare JSON text, two JSON files, or the entire content of two folders to identify differences.
*   **Base64 Support**: Decode Base64 strings and view them as JSON.

## Tech Stack

*   **Frontend Framework**: React + Vite
*   **Editor**: Monaco Editor
*   **State Management**: Zustand
*   **Styling**: Tailwind CSS
*   **Validation**: AJV

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js and npm installed on your machine.

### Installation

1.  Clone the repo
    ```sh
    git clone https://github.com/RashidHussain786/JaonWorkbench.git
    ```
2.  Install NPM packages
    ```sh
    npm install
    ```

### Running the Application

1.  Run the development server
    ```sh
    npm run dev
    ```
2.  Open your browser and navigate to `http://localhost:5173`

## Usage

The JSON Workbench is designed to be intuitive. Here's a quick overview of how to use it:

*   **Editing JSON**: You can directly type or paste your JSON data into the editor.
*   **Switching Views**: Use the mode selector to switch between the code editor, tree view, and table view.
*   **Formatting**: Click the "Format" button to beautify your JSON.
*   **Validating**: The editor will automatically validate your JSON as you type. Errors will be displayed at the bottom of the editor.
*   **Importing/Exporting**: Use the action buttons to import from a file, copy to the clipboard, or download your JSON.
*   **Comparing JSON**: Click the "Compare" button and select "JSON" to compare raw JSON text pasted into the editors.
*   **Comparing Files**: Click the "Compare" button and select "File" to open a side-by-side view to compare two JSON files.
*   **Comparing Folders**: Click the "Compare" button and select "Folder" to select two folders and compare their contents.

## Folder Structure

```
.
├── src
│   ├── common
│   ├── components
│   ├── features
│   │   ├── file-operations
│   │   ├── folder-compare
│   │   ├── json-data
│   │   ├── layout
│   │   ├── search
│   │   └── theme
│   ├── store
│   ├── types
│   └── utils
├── vite.config.ts
├── tailwind.config.js
└── package.json
```

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Rashid Hussain - [LinkedIn](https://www.linkedin.com/in/rashid-hussain-9b737b1b0/)

Project Link: [https://github.com/RashidHussain786/JaonWorkbench](https://github.com/RashidHussain786/JaonWorkbench)