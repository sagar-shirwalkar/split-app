/**
 * Section header — small-caps eyebrow over a section, with an
 * optional action button on the right. Used on every page where
 * we have grouped content.
 */
import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("section-header")
export class SectionHeader extends LitElement {
  @property({ type: String }) eyebrow = "";
  @property({ type: String }) title = "";
  @property({ type: String }) subtitle = "";

  render() {
    return html`
      <div class="flex items-end justify-between gap-4 mb-3">
        <div class="min-w-0">
          ${this.eyebrow
            ? html`<p class="label-eyebrow mb-1">${this.eyebrow}</p>`
            : ""}
          ${this.title
            ? html`<h2
                class="text-lg font-semibold tracking-tight text-ink-900
                       truncate"
              >
                ${this.title}
              </h2>`
            : ""}
          ${this.subtitle
            ? html`<p class="mt-0.5 text-sm text-ink-500">${this.subtitle}</p>`
            : ""}
        </div>
        <div class="shrink-0">
          <slot name="action"></slot>
        </div>
      </div>
    `;
  }
}
