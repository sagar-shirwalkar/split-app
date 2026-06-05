import { LitElement, html } from "lit";
import { customElement, state, property } from "lit/decorators.js";
import { StoreController } from "../store/store.js";
import { todayIso } from "../lib/format.js";
import { toast } from "./toast.js";
import { icon } from "./icons.js";
import "./date-picker.js";

@customElement("add-expense-form")
export class AddExpenseForm extends LitElement {
  private store = new StoreController(this);
  @property({ type: String }) groupId = "";
  @property({ type: Array }) members: any[] = [];
  @property({ type: String }) currency = "USD";

  @state() description = "";
  @state() amount = "";
  @state() date = "";
  @state() category = "Other";
  @state() payer = "";
  @state() splitType = "equal";
  @state() notes = "";
  @state() shares: {
    user: string;
    amount?: number;
    percentage?: number;
    shares?: number;
  }[] = [];
  @state() receiptImage = "";
  @state() receiptFileName = "";
  @state() open = false;
  @state() saving = false;

  private _open() {
    this.date = this.date || todayIso();
    this.open = true;
  }

  private _close() {
    this.open = false;
    this.description = "";
    this.amount = "";
    this.date = "";
    this.notes = "";
    this.shares = [];
    this.receiptImage = "";
    this.receiptFileName = "";
    this.category = "Other";
    this.splitType = "equal";
    this.payer = "";
  }

  private _handleFile(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.receiptFileName = file.name;
    const reader = new FileReader();
    reader.onload = () => {
      this.receiptImage = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  private _updateShare(userId: string, value: string) {
    const parsed = parseFloat(value) || 0;
    const idx = this.shares.findIndex((s) => s.user === userId);
    if (this.splitType === "percentage") {
      const entry = { user: userId, percentage: parsed };
      if (idx >= 0) this.shares[idx] = entry;
      else this.shares = [...this.shares, entry];
    } else if (this.splitType === "shares") {
      const entry = { user: userId, shares: parsed };
      if (idx >= 0) this.shares[idx] = entry;
      else this.shares = [...this.shares, entry];
    } else {
      if (idx >= 0) this.shares[idx].amount = parsed;
      else this.shares = [...this.shares, { user: userId, amount: parsed }];
    }
  }

  private async _submit(e: Event) {
    e.preventDefault();
    this.saving = true;
    try {
      const payload: any = {
        description: this.description,
        amount: parseFloat(parseFloat(this.amount).toFixed(2)),
        date: this.date,
        category: this.category,
        payer: this.payer || undefined,
        split_type: this.splitType,
        notes: this.notes,
        receipt_image: this.receiptImage || undefined,
      };
      if (this.splitType !== "equal") {
        payload.shares = this.shares;
      }
      await this.store.createExpense(payload);
      toast("Expense saved", "success");
      this._close();
    } catch {
      toast("Failed to save expense.", "error");
    } finally {
      this.saving = false;
    }
  }

  render() {
    if (!this.open) {
      return html`
        <button class="btn btn-primary w-full sm:w-auto" @click=${this._open}>
          ${icon.plus({ size: 14 })}
          <span>Add expense</span>
        </button>
      `;
    }

    return html`
      <div class="card card-pad space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="label-eyebrow">New</p>
            <h2 class="text-lg font-semibold tracking-tight text-ink-900">
              Add expense
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
              for="exp-desc"
              class="block text-xs font-medium text-ink-700 mb-1"
              >Description</label
            >
            <input
              id="exp-desc"
              class="input"
              placeholder="What was it for?"
              .value=${this.description}
              @input=${(e: any) => (this.description = e.target.value)}
              required
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label
                for="exp-amount"
                class="block text-xs font-medium text-ink-700 mb-1"
                >Amount (${this.currency})</label
              >
              <input
                id="exp-amount"
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
                for="exp-date"
                class="block text-xs font-medium text-ink-700 mb-1"
                >Date</label
              >
              <date-picker
                .value=${this.date}
                @change=${(e: any) => (this.date = e.detail.value)}
              ></date-picker>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label
                for="exp-cat"
                class="block text-xs font-medium text-ink-700 mb-1"
                >Category</label
              >
              <select
                id="exp-cat"
                class="select"
                .value=${this.category}
                @change=${(e: any) => (this.category = e.target.value)}
              >
                <option value="Food & Drink">Food & Drink</option>
                <option value="Travel">Travel</option>
                <option value="Utilities">Utilities</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label
                for="exp-payer"
                class="block text-xs font-medium text-ink-700 mb-1"
                >Paid by</label
              >
              <select
                id="exp-payer"
                class="select"
                .value=${this.payer}
                @change=${(e: any) => (this.payer = e.target.value)}
              >
                <option value="">You (default)</option>
                ${(Array.isArray(this.members) ? this.members : []).map(
                  (m: any) =>
                    html`<option value=${m.sys_id}>${m.name}</option>`,
                )}
              </select>
            </div>
          </div>

          <div>
            <label
              for="exp-split"
              class="block text-xs font-medium text-ink-700 mb-1"
              >Split</label
            >
            <select
              id="exp-split"
              class="select"
              .value=${this.splitType}
              @change=${(e: any) => (this.splitType = e.target.value)}
            >
              <option value="equal">Equally</option>
              <option value="exact">By exact amount</option>
              <option value="percentage">By percentage</option>
              <option value="shares">By shares</option>
            </select>
          </div>

          ${this.splitType !== "equal"
            ? html`
                <div class="rounded-lg bg-ink-50 p-3 space-y-2">
                  <p class="text-xs font-medium text-ink-700">
                    ${this.splitType === "exact"
                      ? "Amount per person"
                      : this.splitType === "percentage"
                        ? "Percent per person"
                        : "Shares per person"}
                  </p>
                  ${(Array.isArray(this.members) ? this.members : []).map(
                    (m: any) => html`
                      <div class="flex items-center gap-2">
                        <span
                          class="text-sm text-ink-700 w-28 truncate"
                          >${m.name}</span
                        >
                        <input
                          type="number"
                          min="0"
                          step=${this.splitType === "exact" ? "0.01" : "1"}
                          class="input w-28"
                          @input=${(e: any) =>
                            this._updateShare(m.sys_id, e.target.value)}
                        />
                      </div>
                    `,
                  )}
                </div>
              `
            : ""}

          <div>
            <label
              for="exp-receipt"
              class="block text-xs font-medium text-ink-700 mb-1"
              >Receipt <span class="text-ink-400">(optional)</span></label
            >
            <div class="flex items-center gap-2">
              <label
                class="btn btn-secondary btn-sm cursor-pointer"
                for="exp-receipt"
              >
                ${icon.receipt({ size: 14 })}
                <span>${this.receiptFileName ? "Replace" : "Choose file"}</span>
              </label>
              <input
                id="exp-receipt"
                type="file"
                accept="image/*"
                class="hidden"
                @change=${this._handleFile}
              />
              ${this.receiptFileName
                ? html`<span class="text-xs text-ink-500 truncate"
                    >${this.receiptFileName}</span
                  >`
                : ""}
            </div>
            ${this.receiptImage
              ? html`
                  <img
                    src=${this.receiptImage}
                    class="mt-2 max-h-32 rounded-md border border-ink-200"
                    alt="Receipt preview"
                  />
                `
              : ""}
          </div>

          <div>
            <label
              for="exp-notes"
              class="block text-xs font-medium text-ink-700 mb-1"
              >Notes <span class="text-ink-400">(optional)</span></label
            >
            <textarea
              id="exp-notes"
              class="textarea"
              placeholder="Add a note (max 100 chars)"
              maxlength="100"
              rows="2"
              .value=${this.notes}
              @input=${(e: any) => (this.notes = e.target.value)}
            ></textarea>
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
              ?disabled=${this.saving}
            >
              ${this.saving ? "Saving…" : "Save expense"}
            </button>
          </div>
        </form>
      </div>
    `;
  }
}
