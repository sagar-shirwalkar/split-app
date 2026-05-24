import { LitElement, html } from "lit";
import { customElement, state, property } from "lit/decorators.js";
import { StoreController } from "../store/store.js";
import "./date-picker.js";

@customElement("add-expense-form")
export class AddExpenseForm extends LitElement {
  private store = new StoreController(this);
  @property({ type: String }) groupId = "";
  @property({ type: Array }) members: any[] = [];

  @state() description = "";
  @state() amount = "";
  @state() date = "";
  @state() category = "Other";
  @state() payer = "";
  @state() split_type = "equal";
  @state() notes = "";
  @state() shares: {
    user: string;
    amount?: number;
    percentage?: number;
    shares?: number;
  }[] = [];
  @state() receiptImage = "";
  @state() receiptFileName = "";
  @state() showForm = false;

  render() {
    if (!this.showForm) {
      return html`
        <button
          @click=${() => (this.showForm = true)}
          class="px-4 py-2 rounded text-white font-semibold"
          style="background-color: #62d84e"
        >
          + Add Expense
        </button>
      `;
    }

    return html`
      <div class="bg-white shadow p-4 rounded border">
        <div class="flex justify-between items-center mb-3">
          <h3 class="font-semibold text-[#000000]">New Expense</h3>
          <button
            @click=${() => (this.showForm = false)}
            class="text-[#4f4f4f] text-sm underline"
          >
            Cancel
          </button>
        </div>
        <form @submit=${this.handleSubmit}>
          <input
            class="border p-2 mb-2 w-full rounded text-[#4f4f4f]"
            placeholder="Description"
            .value=${this.description}
            @input=${(e: any) => (this.description = e.target.value)}
            required
          />

          <div class="mb-2">
            <input
              class="border p-2 w-full rounded text-[#4f4f4f]"
              type="text"
              inputmode="decimal"
              placeholder="0.00"
              .value=${this.amount}
              @input=${(e: any) => {
                let val = e.target.value;
                val = val.replace(/[^0-9.]/g, "");
                const parts = val.split(".");
                if (parts.length > 2) val = parts[0] + "." + parts.slice(1).join("");
                if (parts.length === 2 && parts[1].length > 2) val = parts[0] + "." + parts[1].slice(0, 2);
                this.amount = val;
              }}
              required
            />
          </div>

          <label class="block text-sm text-[#4f4f4f] mb-1">Date</label>
          <date-picker
            .value=${this.date}
            @change=${(e: any) => (this.date = e.detail.value)}
          ></date-picker>

          <div class="mb-2 mt-2" style="margin-top: 0.5rem">
            <select
              class="border p-2 w-full rounded text-[#4f4f4f] bg-white"
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

          <select
            class="border p-2 mb-2 w-full rounded text-[#4f4f4f] bg-white"
            .value=${this.payer}
            @change=${(e: any) => (this.payer = e.target.value)}
          >
            <option value="">You (current user)</option>
            ${this.members.map(
              (m: any) =>
                html`<option value=${m.sys_id}>${m.name}</option>`,
            )}
          </select>

          <select
            class="border p-2 mb-2 w-full rounded text-[#4f4f4f] bg-white"
            .value=${this.split_type}
            @change=${(e: any) => (this.split_type = e.target.value)}
          >
            <option value="equal">Equal Split</option>
            <option value="exact">Exact Amounts</option>
            <option value="percentage">Percentage</option>
            <option value="shares">Shares</option>
          </select>

          ${this.split_type !== "equal"
            ? html`
                <div class="mb-2 p-2 bg-gray-50 rounded">
                  <label class="block text-sm font-semibold text-[#000000] mb-1">
                    ${this.split_type === "exact"
                      ? "Amounts per person ($)"
                      : this.split_type === "percentage"
                        ? "Percentages (%)"
                        : "Shares"}
                  </label>
                  ${this.members.map(
                    (m: any) => html`
                      <div class="flex items-center gap-2 mb-1">
                        <span class="text-sm text-[#4f4f4f] w-24 truncate"
                          >${m.name}</span
                        >
                        <input
                          type="number"
                          min="0"
                          step=${this.split_type === "exact" ? "0.01" : "1"}
                          class="border p-1 w-24 rounded text-sm text-[#4f4f4f]"
                          @input=${(e: any) =>
                            this.updateShare(m.sys_id, e.target.value)}
                        />
                      </div>
                    `,
                  )}
                </div>
              `
            : ""}

          <div class="mb-2">
            <label class="block text-sm text-[#4f4f4f] mb-1">Receipt Image</label>
            <div class="flex gap-2 items-center">
              <input
                type="file"
                accept="image/*"
                class="text-sm text-[#4f4f4f]"
                @change=${this.handleFileUpload}
              />
              ${this.receiptFileName
                ? html`<span class="text-xs text-[#4f4f4f]">${this.receiptFileName}</span>`
                : ""}
            </div>
            ${this.receiptImage
              ? html`
                  <img
                    src=${this.receiptImage}
                    class="mt-2 max-h-24 rounded border"
                    alt="Receipt preview"
                  />
                `
              : ""}
          </div>

          <textarea
            class="border p-2 mb-2 w-full rounded text-[#4f4f4f]"
            placeholder="Notes (optional)"
            .value=${this.notes}
            @input=${(e: any) => (this.notes = e.target.value)}
            maxlength="100"
            rows="2"
          ></textarea>

          <button
            type="submit"
            class="px-4 py-2 rounded text-white font-semibold"
            style="background-color: #62d84e"
          >
            Save Expense
          </button>
        </form>
      </div>
    `;
  }

  private handleFileUpload(e: any) {
    const file = e.target.files?.[0];
    if (!file) return;
    this.receiptFileName = file.name;
    const reader = new FileReader();
    reader.onload = () => {
      this.receiptImage = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  private updateShare(userId: string, value: string) {
    const parsed = parseFloat(value) || 0;
    const idx = this.shares.findIndex((s) => s.user === userId);
    if (this.split_type === "percentage") {
      const entry = { user: userId, percentage: parsed };
      if (idx >= 0) this.shares[idx] = entry;
      else this.shares = [...this.shares, entry];
    } else if (this.split_type === "shares") {
      const entry = { user: userId, shares: parsed };
      if (idx >= 0) this.shares[idx] = entry;
      else this.shares = [...this.shares, entry];
    } else {
      if (idx >= 0) this.shares[idx].amount = parsed;
      else this.shares = [...this.shares, { user: userId, amount: parsed }];
    }
  }

  private async handleSubmit(e: Event) {
    e.preventDefault();
    const payload: any = {
      description: this.description,
      amount: parseFloat(parseFloat(this.amount).toFixed(2)),
      date: this.date,
      category: this.category,
      payer: this.payer || undefined,
      split_type: this.split_type,
      notes: this.notes,
      receipt_image: this.receiptImage || undefined,
    };
    if (this.split_type !== "equal") {
      payload.shares = this.shares;
    }
    await this.store.createExpense(payload);
    this.description = "";
    this.amount = "";
    this.date = "";
    this.notes = "";
    this.shares = [];
    this.receiptImage = "";
    this.receiptFileName = "";
    this.showForm = false;
  }
}
