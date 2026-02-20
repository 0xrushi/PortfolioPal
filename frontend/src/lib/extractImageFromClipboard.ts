export function extractImageFileFromClipboardData(
  clipboardData: DataTransfer | null
): File | null {
  if (!clipboardData) return null;

  // Try files first (works in most browsers)
  const files = clipboardData.files;
  if (files && files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.startsWith("image/")) {
        return files[i];
      }
    }
  }

  // Fallback to items
  const items = clipboardData.items;
  if (items) {
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith("image/")) {
        const file = items[i].getAsFile();
        if (file) return file;
      }
    }
  }

  return null;
}
