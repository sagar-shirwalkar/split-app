var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html } from "lit";
import { customElement, state, property } from "lit/decorators.js";
import { StoreController } from "../store/store.js";
let AddExpenseForm = class AddExpenseForm extends LitElement {
    constructor() {
        super(...arguments);
        this.store = new StoreController(this);
        this.groupId = "";
        this.members = [];
        this.description = "";
        this.amount = "";
        this.date = "";
        this.category = "Other";
        this.payer = "";
        this.split_type = "equal";
        this.notes = "";
        this.shares = [];
        this.receiptImage = "";
    }
    render() {
        return html `
      <div class="bg-white shadow p-4 rounded">
        <h3 class="font-semibold mb-2">Add Expense</h3>
        <form @submit=${this.handleSubmit}>
          <input
            class="border p-2 mb-2 w-full"
            placeholder="Description"
            .value=${this.description}
            @input=${(e) => (this.description = e.target.value)}
            required
          />
          <input
            class="border p-2 mb-2 w-full"
            type="number"
            step="0.01"
            placeholder="Amount"
            .value=${this.amount}
            @input=${(e) => (this.amount = e.target.value)}
            required
          />
          <input
            class="border p-2 mb-2 w-full"
            type="date"
            .value=${this.date}
            @input=${(e) => (this.date = e.target.value)}
            required
          />
          <select
            class="border p-2 mb-2 w-full"
            .value=${this.category}
            @change=${(e) => (this.category = e.target.value)}
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
            @change=${(e) => (this.payer = e.target.value)}
          >
            <option value="">You (current user)</option>
            ${this.members.map((m) => html `<option value=${m.sys_id}>${m.name}</option>`)}
          </select>
          <select
            class="border p-2 mb-2 w-full"
            .value=${this.split_type}
            @change=${(e) => (this.split_type = e.target.value)}
          >
            <option value="equal">Equal</option>
            <option value="exact">Exact amounts</option>
            <option value="percentage">Percentage</option>
            <option value="shares">Shares</option>
          </select>
          ${this.split_type !== "equal"
            ? html `
                <div class="mb-2">
                  <label class="block text-sm">
                    ${this.split_type === "exact"
                ? "Amounts"
                : this.split_type === "percentage"
                    ? "Percentages"
                    : "Shares"}
                  </label>
                  ${this.members.map((m) => html `
                      <div class="flex items-center gap-2">
                        <span>${m.name}</span>
                        <input
                          type="number"
                          class="border p-1 w-20"
                          @input=${(e) => this.updateShare(m.sys_id, e.target.value)}
                        />
                      </div>
                    `)}
                </div>
              `
            : ""}
          <input
            class="border p-2 mb-2 w-full"
            placeholder="Receipt image URL (optional)"
            .value=${this.receiptImage}
            @input=${(e) => (this.receiptImage = e.target.value)}
          />
          <textarea
            class="border p-2 mb-2 w-full"
            placeholder="Notes"
            .value=${this.notes}
            @input=${(e) => (this.notes = e.target.value)}
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
    updateShare(userId, value) {
        const parsed = parseFloat(value) || 0;
        const idx = this.shares.findIndex((s) => s.user === userId);
        if (this.split_type === "percentage") {
            const entry = { user: userId, percentage: parsed };
            if (idx >= 0) {
                this.shares[idx] = entry;
            }
            else {
                this.shares = [...this.shares, entry];
            }
        }
        else if (this.split_type === "shares") {
            const entry = { user: userId, shares: parsed };
            if (idx >= 0) {
                this.shares[idx] = entry;
            }
            else {
                this.shares = [...this.shares, entry];
            }
        }
        else {
            if (idx >= 0) {
                this.shares[idx].amount = parsed;
            }
            else {
                this.shares = [
                    ...this.shares,
                    { user: userId, amount: parsed },
                ];
            }
        }
    }
    async handleSubmit(e) {
        e.preventDefault();
        const payload = {
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
};
__decorate([
    property({ type: String })
], AddExpenseForm.prototype, "groupId", void 0);
__decorate([
    property({ type: Array })
], AddExpenseForm.prototype, "members", void 0);
__decorate([
    state()
], AddExpenseForm.prototype, "description", void 0);
__decorate([
    state()
], AddExpenseForm.prototype, "amount", void 0);
__decorate([
    state()
], AddExpenseForm.prototype, "date", void 0);
__decorate([
    state()
], AddExpenseForm.prototype, "category", void 0);
__decorate([
    state()
], AddExpenseForm.prototype, "payer", void 0);
__decorate([
    state()
], AddExpenseForm.prototype, "split_type", void 0);
__decorate([
    state()
], AddExpenseForm.prototype, "notes", void 0);
__decorate([
    state()
], AddExpenseForm.prototype, "shares", void 0);
__decorate([
    state()
], AddExpenseForm.prototype, "receiptImage", void 0);
AddExpenseForm = __decorate([
    customElement("add-expense-form")
], AddExpenseForm);
export { AddExpenseForm };
