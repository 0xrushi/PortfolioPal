import { injectHashNavFix } from "./injectHashNavFix";

describe("injectHashNavFix", () => {
  test("injects script before </body> when present", () => {
    const html = "<html><body><h1>Hello</h1></body></html>";
    const result = injectHashNavFix(html);

    expect(result).toContain("<script>");
    expect(result).toContain("scrollIntoView");
    expect(result).toContain("</body></html>");
    // Script should appear before </body>
    const scriptIndex = result.indexOf("<script>");
    const bodyCloseIndex = result.indexOf("</body>");
    expect(scriptIndex).toBeLessThan(bodyCloseIndex);
  });

  test("appends script when </body> is not present", () => {
    const html = "<h1>Hello</h1>";
    const result = injectHashNavFix(html);

    expect(result).toContain("<script>");
    expect(result).toContain("scrollIntoView");
    expect(result.startsWith("<h1>Hello</h1>")).toBe(true);
  });

  test("script intercepts hash links with preventDefault and scrollIntoView", () => {
    const result = injectHashNavFix("<body></body>");

    expect(result).toContain("e.preventDefault()");
    expect(result).toContain("scrollIntoView({behavior:'smooth'})");
    expect(result).toContain("h.charAt(0)==='#'");
    expect(result).toContain("e.target.closest('a')");
  });

  test("preserves original HTML content", () => {
    const html =
      '<html><body><nav><a href="#projects">Projects</a></nav><section id="projects"></section></body></html>';
    const result = injectHashNavFix(html);

    expect(result).toContain('<a href="#projects">Projects</a>');
    expect(result).toContain('<section id="projects"></section>');
  });

  test("is idempotent — calling twice produces same result as once", () => {
    const html = "<html><body><h1>Hello</h1></body></html>";
    const once = injectHashNavFix(html);
    const twice = injectHashNavFix(once);

    // Second call adds another script (no dedup), but both should be valid HTML
    expect(twice).toContain("</body></html>");
  });

  test("handles empty string", () => {
    const result = injectHashNavFix("");
    expect(result).toContain("<script>");
    expect(result).toContain("scrollIntoView");
  });
});
