import { THEME_STORAGE_KEY } from "@/constants";

/**
 * Inline script that sets `data-theme` before first paint to avoid a flash
 * of the wrong theme. See Next.js guide: "Preventing flash before hydration".
 */
const script = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");var d=t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.dataset.theme=d?"dark":"light"}catch(e){}})()`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
