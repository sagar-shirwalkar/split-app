/**
 * Empty state — a small card used when a list has no content.
 * Pass a title, an optional body, and an optional CTA.
 */
import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("empty-state")
export class EmptyState extends LitElement {
  @property({ type: String }) title = "Nothing here yet";
  @property({ type: String }) body = "";
  @property({ type: String }) cta = "";

  render() {
    return html`
      <div class="card card-pad">
        <div class="empty">
          <p class="empty-title">${this.title}</p>
          ${this.body ? html`<p class="empty-body">${this.body}</p>` : ""}
          ${this.cta
            ? html`<slot name="cta"></slot>`
            : ""}
        </div>
      </div>
    `;
  }
}
