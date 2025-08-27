/**
 * Creates and configures an HTML input element for directory selection.
 * The returned input element must be appended to the DOM and its .click() method
 * must be called directly from a user gesture (e.g., a button's onClick handler).
 *
 * @returns A Promise that resolves with the selected FileList or null if cancelled,
 *          and the input element itself.
 */
export function createDirectoryPicker(): {
  input: HTMLInputElement;
  promise: Promise<FileList | null>;
} {
  const input = document.createElement('input');
  input.type = 'file';
  input.webkitdirectory = true;
  input.multiple = true;

  let resolved = false;

  const promise = new Promise<FileList | null>((resolve) => {
    const cleanup = () => {
      if (input.parentNode) {
        document.body.removeChild(input);
      }
      window.removeEventListener('focus', onFocus);
    };

    input.onchange = (event: Event) => {
      if (resolved) return;
      resolved = true;

      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        resolve(target.files);
      } else {
        resolve(null);
      }
      cleanup();
    };

    // Fallback for when the user switches tabs/apps without making a selection
    const onFocus = () => {
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          resolve(null);
          cleanup();
        }
      }, 500);
    };

    // Attach focus listener to detect if user navigates away
    window.addEventListener('focus', onFocus);
  });

  return { input, promise };
}
