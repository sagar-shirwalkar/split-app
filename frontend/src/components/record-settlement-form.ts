import { LitElement, html } from "lit";
import { customElement, state, property } from "lit/decorators.js";
import { StoreController } from "../store/store.js";
import { todayIso } from "../lib/format.js";
import { toast } from "./toast.js";
import { icon } from "./icons.js";
import "./date-picker.js";
import "./avatar.js";

@customElement("record-settlement-form")
export class RecordSettlementForm extends LitElement {
  private store = new StoreController(this);
  @property({ type: String }) groupId = "";
  @property({ type: Array }) members: any[] = [];
  @property({ type: String }) currency = "USD";

  @state() toUser = "";
  @state() amount = "";
  @state() date = "";
  @state() paymentMethod = "";
  @state() open = false;
  @state() saving = false;

  private _open() {
    this.date = this.date || todayIso();
    this.open = true;
  }

  private _close() {
    this.open = false;
    this.toUser = "";
    this.amount = "";
    this.date = "";
    this.paymentMethod = "";
  }

  private async _submit(e: Event) {
    e.preventDefault();
    this.saving = true;
    try {
      await this.store.recordSettlement({
        to_user: this.toUser,
        from_user: "",
        amount: parseFloat(parseFloat(this.amount).toFixed(2)),
        date: this.date,
        payment_method: this.paymentMethod,
      });
      toast("Settlement recorded", "success");
      this._close();
    } catch {
      toast("Failed to record settlement.", "error");
    } finally {
      this.saving = false;
    }
  }

  render() {
    if (!this.open) {
      return html`
        <button
          class="btn btn-secondary w-full sm:w-auto"
          @click=${this._open}
        >
          ${icon.wallet({ size: 14 })}
          <span>Record settlement</span>
        </button>
      `;
    }

    return html`
      <div class="card card-pad space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="label-eyebrow">Settle up</p>
            <h2 class="text-lg font-semibold tracking-tight text-ink-900">
              Record payment
            </h2>
          </div>
          <button
            class="btn btn-ghost btn-icon"
            aria-label="Close"
            @click=${this._close}
          >
            ${icon.x({ size: 16 })}
          </button>
        </div>

        <form @submit=${this._submit} class="space-y-3">
          <div>
            <label
              for="settle-to"
              class="block text-xs font-medium text-ink-700 mb-1"
              >To</label
            >
            <div class="relative">
              <select
                id="settle-to"
                class="select"
                .value=${this.toUser}
                @change=${(e: any) => (this.toUser = e.target.value)}
                required
              >
                <option value="">Select recipient</option>
                ${(Array.isArray(this.members) ? this.members : []).map(
                  (m: any) =>
                    html`<option value=${m.sys_id}>${m.name}</option>`,
                )}
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label
                for="settle-amount"
                class="block text-xs font-medium text-ink-700 mb-1"
                >Amount (${this.currency})</label
              >
              <input
                id="settle-amount"
                class="input font-tabular num"
                type="text"
                inputmode="decimal"
                placeholder="0.00"
                .value=${this.amount}
                @input=${(e: any) => {
                  let val = e.target.value;
                  val = val.replace(/[^0-9.]/g, "");
                  const parts = val.split(".");
                  if (parts.length > 2)
                    val = parts[0] + "." + parts.slice(1).join("");
                  if (parts.length === 2 && parts[1].length > 2)
                    val = parts[0] + "." + parts[1].slice(0, 2);
                  this.amount = val;
                }}
                required
              />
            </div>
            <div>
              <label
                for="settle-date"
                class="block text-xs font-medium text-ink-700 mb-1"
                >Date</label
              >
              <date-picker
                .value=${this.date}
                @change=${(e: any) => (this.date = e.detail.value)}
              ></date-picker>
            </div>
          </div>

          <div>
            <label
              for="settle-method"
              class="block text-xs font-medium text-ink-700 mb-1"
              >Method <span class="text-ink-400">(optional)</span></label
            >
            <select
              id="settle-method"
              class="select"
              .value=${this.paymentMethod}
              @change=${(e: any) => (this.paymentMethod = e.target.value)}
            >
              <option value="">Select method…</option>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="PayPal">PayPal</option>
              <option value="Venmo">Venmo</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div class="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              class="btn btn-ghost"
              @click=${this._close}
              ?disabled=${this.saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              ?disabled=${this.saving || !this.toUser}
            >
              ${this.saving ? "Saving…" : "Record payment"}
            </button>
          </div>
        </form>
      </div>
    `;
  }
}
