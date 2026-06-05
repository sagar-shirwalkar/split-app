/**
 * Badge — small inline label, used for category tags and role tags.
 * Renders to light DOM.
 */
import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("sn-badge")
export class SnBadge extends LitElement {
  @property({ type: String }) tone:
    | "neutral"
    | "brand"
    | "accent"
    | "warning"
    | "danger" = "neutral";

  render() {
    const tones: Record<string, string> = {
      neutral: "bg-ink-100 text-ink-700",
      brand: "bg-brand-50 text-brand-700",
      accent: "bg-accent-50 text-accent-600",
      warning: "bg-warning-50 text-warning-500",
      danger: "bg-danger-50 text-danger-600",
    };
    return html`
      <span
        class="inline-flex items-center gap-1 rounded-full
               px-2 py-0.5 text-[11px] font-medium
               ${tones[this.tone]}"
      >
        <slot></slot>
      </span>
    `;
  }
}
