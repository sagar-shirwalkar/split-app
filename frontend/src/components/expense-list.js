var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
let ExpenseList = class ExpenseList extends LitElement {
    constructor() {
        super(...arguments);
        this.expenses = [];
    }
    render() {
        return html `
      <div class="bg-white shadow p-4 rounded">
        <h3 class="font-semibold mb-2">Expenses</h3>
        ${this.expenses.length === 0
            ? html `<p class="text-gray-500">No expenses recorded.</p>`
            : ""}
        ${this.expenses.map((exp) => html `
            <div class="border-b py-2 flex justify-between">
              <div>
                <span class="font-bold">${exp.description}</span>
                <span class="text-sm text-gray-500 ml-2">${exp.category}</span>
                <div class="text-xs text-gray-400">
                  Paid by ${exp.payer.name} on ${exp.date}
                  ${exp.notes ? html `&mdash; <em>${exp.notes}</em>` : ""}
                </div>
                ${exp.receipt_image
            ? html `
                      <a
                        href=${exp.receipt_image}
                        target="_blank"
                        class="text-xs text-indigo-600 underline"
                        >View Receipt</a
                      >
                    `
            : ""}
              </div>
              <span class="font-mono">${exp.amount}</span>
            </div>
          `)}
      </div>
    `;
    }
};
__decorate([
    property({ type: Array })
], ExpenseList.prototype, "expenses", void 0);
ExpenseList = __decorate([
    customElement("expense-list")
], ExpenseList);
export { ExpenseList };
