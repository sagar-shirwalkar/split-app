/**
 * Toast — a fixed-position snackbar that auto-dismisses.
 *
 * Two render modes: a top-right floating alert (when slotted into
 * <app-toast-host>) and a context-free element. The host app renders
 * one <app-toast-host> at the root and any descendant component can
 * dispatch an `app-toast` event to pop a message.
 */
import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { icon } from "./icons.js";

type ToastVariant = "info" | "success" | "error";

interface ToastDetail {
  message: string;
  variant?: ToastVariant;
  durationMs?: number;
}

@customElement("app-toast-host")
export class AppToastHost extends LitElement {
  @state() private toasts: Array<{
    id: number;
    message: string;
    variant: ToastVariant;
  }> = [];
  private _nextId = 1;

  connectedCallback() {
    super.connectedCallback();
    // Capture all toast events bubbling up from anywhere in the app.
    document.addEventListener("app-toast", this._onToast as EventListener);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("app-toast", this._onToast as EventListener);
  }

  private _onToast = (e: Event) => {
    const ce = e as CustomEvent<ToastDetail>;
    const { message, variant = "info", durationMs = 3000 } = ce.detail;
    const id = this._nextId++;
    this.toasts = [...this.toasts, { id, message, variant }];
    setTimeout(() => {
      this.toasts = this.toasts.filter((t) => t.id !== id);
    }, durationMs);
  };

  render() {
    return html`
      <div
        class="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none"
        aria-live="polite"
      >
        ${this.toasts.map(
          (t) => html`
            <div
              class="pointer-events-auto flex items-start gap-3
                     rounded-lg border bg-white px-4 py-3 shadow-md
                     min-w-[280px] max-w-md
                     ${t.variant === "error"
                       ? "border-danger-500/30"
                       : t.variant === "success"
                         ? "border-accent-500/30"
                         : "border-ink-200"}"
              role=${t.variant === "error" ? "alert" : "status"}
            >
              <span
                class="mt-0.5 flex h-5 w-5 items-center justify-center
                       rounded-full
                       ${t.variant === "error"
                         ? "bg-danger-50 text-danger-600"
                         : t.variant === "success"
                           ? "bg-accent-50 text-accent-600"
                           : "bg-ink-100 text-ink-500"}"
              >
                ${t.variant === "success"
                  ? icon.check({ size: 12 })
                  : t.variant === "error"
                    ? icon.alertCircle({ size: 12 })
                    : icon.info({ size: 12 })}
              </span>
              <p class="text-sm text-ink-900 leading-snug">${t.message}</p>
            </div>
          `,
        )}
      </div>
    `;
  }
}

/**
 * Convenience function: components call this instead of maintaining
 * their own toast state. The event bubbles to the singleton host.
 */
export function toast(
  message: string,
  variant: ToastVariant = "info",
  durationMs = 3000,
) {
  document.dispatchEvent(
    new CustomEvent("app-toast", {
      detail: { message, variant, durationMs },
      bubbles: true,
      composed: true,
    }),
  );
}
