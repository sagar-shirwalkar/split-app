/**
 * Icon set — Lucide-inspired inline SVGs.
 *
 * One function per icon. Each returns a lit `html` template containing
 * a single 24×24 SVG, stroke 1.5 (Lucide-style), `currentColor` for
 * stroke so the icon inherits the surrounding text color.
 *
 * Keeping these inline (no external icon library) keeps the bundle
 * small and avoids the Vite chunking issues that a sprite or
 * import-per-icon approach can cause in a single-file Vite build.
 */
import { html, TemplateResult } from "lit";

type IconOpts = { size?: number; className?: string };

function svg(path: TemplateResult, opts: IconOpts = {}) {
  const size = opts.size ?? 16;
  return html`
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width=${size}
      height=${size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      class=${opts.className ?? ""}
      aria-hidden="true"
      focusable="false"
    >
      ${path}
    </svg>
  `;
}

export const icon = {
  // Navigation
  chevronLeft: (o?: IconOpts) =>
    svg(html`<path d="m15 18-6-6 6-6"></path>`, o),
  chevronRight: (o?: IconOpts) =>
    svg(html`<path d="m9 18 6-6-6-6"></path>`, o),
  arrowLeft: (o?: IconOpts) =>
    svg(
      html`<path d="M19 12H5"></path><path d="m12 19-7-7 7-7"></path>`,
      o,
    ),
  x: (o?: IconOpts) =>
    svg(
      html`<path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>`,
      o,
    ),

  // Actions
  plus: (o?: IconOpts) =>
    svg(
      html`<path d="M5 12h14"></path><path d="M12 5v14"></path>`,
      o,
    ),
  check: (o?: IconOpts) =>
    svg(html`<path d="M20 6 9 17l-5-5"></path>`, o),
  trash: (o?: IconOpts) =>
    svg(
      html`<path d="M3 6h18"></path>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        <line x1="10" x2="10" y1="11" y2="17"></line>
        <line x1="14" x2="14" y1="11" y2="17"></line>`,
      o,
    ),
  pencil: (o?: IconOpts) =>
    svg(
      html`<path
          d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"
        ></path>`,
      o,
    ),
  search: (o?: IconOpts) =>
    svg(
      html`<circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.3-4.3"></path>`,
      o,
    ),

  // People
  user: (o?: IconOpts) =>
    svg(
      html`<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>`,
      o,
    ),
  users: (o?: IconOpts) =>
    svg(
      html`<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>`,
      o,
    ),
  crown: (o?: IconOpts) =>
    svg(
      html`<path
          d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"
        ></path>
        <path d="M5 21h14"></path>`,
      o,
    ),

  // Money & documents
  dollarSign: (o?: IconOpts) =>
    svg(
      html`<line x1="12" x2="12" y1="2" y2="22"></line>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>`,
      o,
    ),
  receipt: (o?: IconOpts) =>
    svg(
      html`<path
          d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"
        ></path>
        <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path>
        <path d="M12 17.5v-11"></path>`,
      o,
    ),
  wallet: (o?: IconOpts) =>
    svg(
      html`<path
          d="M21 12V7H5a2 2 0 0 1 0-4h14v4"
        ></path>
        <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
        <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>`,
      o,
    ),
  trendingUp: (o?: IconOpts) =>
    svg(
      html`<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
        <polyline points="16 7 22 7 22 13"></polyline>`,
      o,
    ),
  trendingDown: (o?: IconOpts) =>
    svg(
      html`<polyline points="22 17 13.5 8.5 8.5 13.5 2 7"></polyline>
        <polyline points="16 17 22 17 22 11"></polyline>`,
      o,
    ),

  // Calendar
  calendar: (o?: IconOpts) =>
    svg(
      html`<rect width="18" height="18" x="3" y="4" rx="2"></rect>
        <path d="M16 2v4"></path>
        <path d="M8 2v4"></path>
        <path d="M3 10h18"></path>`,
      o,
    ),

  // Categories
  utensils: (o?: IconOpts) =>
    svg(
      html`<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path>
        <path d="M7 2v20"></path>
        <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path>`,
      o,
    ),
  plane: (o?: IconOpts) =>
    svg(
      html`<path
          d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"
        ></path>`,
      o,
    ),
  zap: (o?: IconOpts) =>
    svg(
      html`<path
          d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"
        ></path>`,
      o,
    ),
  film: (o?: IconOpts) =>
    svg(
      html`<rect width="18" height="18" x="3" y="3" rx="2"></rect>
        <path d="M7 3v18"></path>
        <path d="M3 7.5h4"></path>
        <path d="M3 12h18"></path>
        <path d="M3 16.5h4"></path>
        <path d="M17 3v18"></path>
        <path d="M17 7.5h4"></path>
        <path d="M17 16.5h4"></path>`,
      o,
    ),
  package: (o?: IconOpts) =>
    svg(
      html`<path
          d="M16.5 9.4 7.55 4.24"
        ></path>
        <path
          d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
        ></path>
        <path d="m3.3 7 8.7 5 8.7-5"></path>
        <path d="M12 22V12"></path>`,
      o,
    ),
  tag: (o?: IconOpts) =>
    svg(
      html`<path
          d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"
        ></path>
        <circle cx="7.5" cy="7.5" r=".5" fill="currentColor"></circle>`,
      o,
    ),

  // Alerts
  alertCircle: (o?: IconOpts) =>
    svg(
      html`<circle cx="12" cy="12" r="10"></circle>
        <line x1="12" x2="12" y1="8" y2="12"></line>
        <line x1="12" x2="12.01" y1="16" y2="16"></line>`,
      o,
    ),
  info: (o?: IconOpts) =>
    svg(
      html`<circle cx="12" cy="12" r="10"></circle>
        <path d="M12 16v-4"></path>
        <path d="M12 8h.01"></path>`,
      o,
    ),

  // UI
  menu: (o?: IconOpts) =>
    svg(
      html`<line x1="4" x2="20" y1="6" y2="6"></line>
        <line x1="4" x2="20" y1="12" y2="12"></line>
        <line x1="4" x2="20" y1="18" y2="18"></line>`,
      o,
    ),
  settings: (o?: IconOpts) =>
    svg(
      html`<path
          d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
        ></path>
        <circle cx="12" cy="12" r="3"></circle>`,
      o,
    ),
};
