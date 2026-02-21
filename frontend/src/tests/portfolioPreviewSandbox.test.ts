import * as fs from "fs";
import * as path from "path";

it("allows opening external links from portfolio preview iframe", () => {
  const appPath = path.resolve(process.cwd(), "src", "App.tsx");
  const source = fs.readFileSync(appPath, "utf8");

  // The portfolio preview is rendered in a sandboxed iframe via srcDoc.
  // To allow `target="_blank"` links inside that iframe to open a new tab,
  // the iframe sandbox must include these permissions.
  expect(source).toContain("allow-popups");
  expect(source).toContain("allow-popups-to-escape-sandbox");

  // Assert the intended sandbox string is present (at least once).
  expect(source).toContain(
    'sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"'
  );
});
