/**
 * Avatar — circular initials chip with a deterministic color derived
 * from the name. Sized via the `size` attribute (default `md`).
 */
import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { avatarPaletteFor, initials } from "../lib/format.js";

export type AvatarSize = "xs" | "sm" | "md" | "lg";

@customElement("sn-avatar")
export class SnAvatar extends LitElement {
  @property({ type: String }) name = "";
  @property({ type: String }) size: AvatarSize = "md";

  render() {
    const { bg, text } = avatarPaletteFor(this.name || "?");
    const sizeCls: Record<AvatarSize, string> = {
      xs: "w-6 h-6 text-[10px]",
      sm: "w-7 h-7 text-xs",
      md: "w-9 h-9 text-sm",
      lg: "w-12 h-12 text-base",
    };
    return html`
      <span
        class="inline-flex items-center justify-center rounded-full
               font-semibold select-none ${bg} ${text} ${sizeCls[this.size]}"
        aria-hidden="true"
      >
        ${initials(this.name || "?")}
      </span>
    `;
  }
}
