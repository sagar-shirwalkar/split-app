import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Expense } from "../store/store.js";

@customElement("expense-list")
export class ExpenseList extends LitElement {
  @property({ type: Array }) expenses: Expense[] = [];

  render() {
    return html`
      <div class="bg-white shadow p-4 rounded">
        <h3 class="font-semibold mb-2">Expenses</h3>
        ${this.expenses.length === 0
          ? html`<p class="text-gray-500">No expenses recorded.</p>`
          : ""}
        ${this.expenses.map(
          (exp) => html`
            <div class="border-b py-2 flex justify-between">
              <div>
                <span class="font-bold">${exp.description}</span>
                <span class="text-sm text-gray-500 ml-2">${exp.category}</span>
                <div class="text-xs text-gray-400">
                  Paid by ${exp.payer.name} on ${exp.date}
                  ${exp.notes ? html`&mdash; <em>${exp.notes}</em>` : ""}
                </div>
                ${(exp as any).receipt_image
                  ? html`
                      <a
                        href=${(exp as any).receipt_image}
                        target="_blank"
                        class="text-xs text-indigo-600 underline"
                        >View Receipt</a
                      >
                    `
                  : ""}
              </div>
              <span class="font-mono">${exp.amount}</span>
            </div>
          `,
        )}
      </div>
    `;
  }
}
