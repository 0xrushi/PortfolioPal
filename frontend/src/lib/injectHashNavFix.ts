const HASH_NAV_SCRIPT = `<script>document.addEventListener('click',function(e){var a=e.target.closest('a');if(!a)return;var h=a.getAttribute('href');if(h&&h.charAt(0)==='#'){e.preventDefault();var t=document.querySelector(h);if(t)t.scrollIntoView({behavior:'smooth'});}});</script>`;

export function injectHashNavFix(html: string): string {
  if (html.includes("</body>")) {
    return html.replace("</body>", HASH_NAV_SCRIPT + "</body>");
  }
  return html + HASH_NAV_SCRIPT;
}
