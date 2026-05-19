import { LitElement, html } from "lit";
import { customElement, state, property } from "lit/decorators.js";
import { StoreController } from "../store/store.js";

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
  @state() shares: { user: string; amount?: number; percentage?: number; shares?: number }[] = [];
  @state() receiptImage = "";

  render() {
    return html`
      <div class="bg-white shadow p-4 rounded">
        <h3 class="font-semibold mb-2">Add Expense</h3>
        <form @submit=${this.handleSubmit}>
          <input
            class="border p-2 mb-2 w-full"
            placeholder="Description"
            .value=${this.description}
            @input=${(e: any) => (this.description = e.target.value)}
            required
          />
          <input
            class="border p-2 mb-2 w-full"
            type="number"
            step="0.01"
            placeholder="Amount"
            .value=${this.amount}
            @input=${(e: any) => (this.amount = e.target.value)}
            required
          />
          <input
            class="border p-2 mb-2 w-full"
            type="date"
            .value=${this.date}
            @input=${(e: any) => (this.date = e.target.value)}
            required
          />
          <select
            class="border p-2 mb-2 w-full"
            .value=${this.category}
            @change=${(e: any) => (this.category = e.target.value)}
          >
            <option value="Food & Drink">Food & Drink</option>
            <option value="Travel">Travel</option>
            <option value="Utilities">Utilities</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Other">Other</option>
          </select>
          <select
            class="border p-2 mb-2 w-full"
            .value=${this.payer}
            @change=${(e: any) => (this.payer = e.target.value)}
          >
            <option value="">You (current user)</option>
            ${this.members.map(
              (m) => html`<option value=${m.sys_id}>${m.name}</option>`,
            )}
          </select>
          <select
            class="border p-2 mb-2 w-full"
            .value=${this.split_type}
            @change=${(e: any) => (this.split_type = e.target.value)}
          >
            <option value="equal">Equal</option>
            <option value="exact">Exact amounts</option>
            <option value="percentage">Percentage</option>
            <option value="shares">Shares</option>
          </select>
          ${this.split_type !== "equal"
            ? html`
                <div class="mb-2">
                  <label class="block text-sm">
                    ${this.split_type === "exact"
                      ? "Amounts"
                      : this.split_type === "percentage"
                        ? "Percentages"
                        : "Shares"}
                  </label>
                  ${this.members.map(
                    (m) => html`
                      <div class="flex items-center gap-2">
                        <span>${m.name}</span>
                        <input
                          type="number"
                          class="border p-1 w-20"
                          @input=${(e: any) =>
                            this.updateShare(m.sys_id, e.target.value)}
                        />
                      </div>
                    `,
                  )}
                </div>
              `
            : ""}
          <input
            class="border p-2 mb-2 w-full"
            placeholder="Receipt image URL (optional)"
            .value=${this.receiptImage}
            @input=${(e: any) => (this.receiptImage = e.target.value)}
          />
          <textarea
            class="border p-2 mb-2 w-full"
            placeholder="Notes"
            .value=${this.notes}
            @input=${(e: any) => (this.notes = e.target.value)}
            maxlength="500"
          ></textarea>
          <button
            type="submit"
            class="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </form>
      </div>
    `;
  }

  private updateShare(userId: string, value: string) {
    const parsed = parseFloat(value) || 0;
    const idx = this.shares.findIndex((s) => s.user === userId);
    if (this.split_type === "percentage") {
      const entry = { user: userId, percentage: parsed };
      if (idx >= 0) {
        this.shares[idx] = entry;
      } else {
        this.shares = [...this.shares, entry];
      }
    } else if (this.split_type === "shares") {
      const entry = { user: userId, shares: parsed };
      if (idx >= 0) {
        this.shares[idx] = entry;
      } else {
        this.shares = [...this.shares, entry];
      }
    } else {
      if (idx >= 0) {
        this.shares[idx].amount = parsed;
      } else {
        this.shares = [
          ...this.shares,
          { user: userId, amount: parsed },
        ];
      }
    }
  }

  private async handleSubmit(e: Event) {
    e.preventDefault();
    const payload: any = {
      description: this.description,
      amount: parseFloat(this.amount),
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
    // reset form
    this.description = "";
    this.amount = "";
    this.date = "";
    this.notes = "";
    this.shares = [];
    this.receiptImage = "";
  }
}
