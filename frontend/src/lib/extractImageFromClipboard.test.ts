import { extractImageFileFromClipboardData } from "./extractImageFromClipboard";

function makeFile(name: string, type: string): File {
  return new File(["fake"], name, { type });
}

function makeDataTransfer(opts: {
  files?: File[];
  items?: { type: string; file: File | null }[];
}): DataTransfer {
  const files = opts.files ?? [];
  const items = (opts.items ?? []).map((item) => ({
    type: item.type,
    kind: "file" as const,
    getAsFile: () => item.file,
    getAsString: () => {},
    webkitGetAsEntry: () => null,
  }));

  return {
    files: Object.assign(files, { item: (i: number) => files[i] ?? null }),
    items: Object.assign(items, { add: () => null, remove: () => {}, clear: () => {} }),
    types: [],
    dropEffect: "none",
    effectAllowed: "none",
    getData: () => "",
    setData: () => {},
    clearData: () => {},
    setDragImage: () => {},
  } as unknown as DataTransfer;
}

describe("extractImageFileFromClipboardData", () => {
  test("returns null for null clipboardData", () => {
    expect(extractImageFileFromClipboardData(null)).toBeNull();
  });

  test("extracts image file from files list", () => {
    const pngFile = makeFile("screenshot.png", "image/png");
    const dt = makeDataTransfer({ files: [pngFile] });

    expect(extractImageFileFromClipboardData(dt)).toBe(pngFile);
  });

  test("extracts jpeg from files list", () => {
    const jpgFile = makeFile("photo.jpg", "image/jpeg");
    const dt = makeDataTransfer({ files: [jpgFile] });

    expect(extractImageFileFromClipboardData(dt)).toBe(jpgFile);
  });

  test("skips non-image files and returns null", () => {
    const textFile = makeFile("notes.txt", "text/plain");
    const dt = makeDataTransfer({ files: [textFile] });

    expect(extractImageFileFromClipboardData(dt)).toBeNull();
  });

  test("returns first image when multiple files are present", () => {
    const textFile = makeFile("notes.txt", "text/plain");
    const pngFile = makeFile("screenshot.png", "image/png");
    const dt = makeDataTransfer({ files: [textFile, pngFile] });

    expect(extractImageFileFromClipboardData(dt)).toBe(pngFile);
  });

  test("falls back to items when files list is empty", () => {
    const pngFile = makeFile("screenshot.png", "image/png");
    const dt = makeDataTransfer({
      files: [],
      items: [{ type: "image/png", file: pngFile }],
    });

    expect(extractImageFileFromClipboardData(dt)).toBe(pngFile);
  });

  test("skips non-image items and returns null", () => {
    const dt = makeDataTransfer({
      files: [],
      items: [{ type: "text/plain", file: makeFile("a.txt", "text/plain") }],
    });

    expect(extractImageFileFromClipboardData(dt)).toBeNull();
  });

  test("returns null when items getAsFile returns null", () => {
    const dt = makeDataTransfer({
      files: [],
      items: [{ type: "image/png", file: null }],
    });

    expect(extractImageFileFromClipboardData(dt)).toBeNull();
  });

  test("prefers files over items", () => {
    const fileFromFiles = makeFile("from-files.png", "image/png");
    const fileFromItems = makeFile("from-items.png", "image/png");
    const dt = makeDataTransfer({
      files: [fileFromFiles],
      items: [{ type: "image/png", file: fileFromItems }],
    });

    expect(extractImageFileFromClipboardData(dt)).toBe(fileFromFiles);
  });

  test("handles empty DataTransfer (no files, no items)", () => {
    const dt = makeDataTransfer({ files: [], items: [] });

    expect(extractImageFileFromClipboardData(dt)).toBeNull();
  });
});
