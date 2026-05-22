import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Expense } from "../store/store.js";

@customElement("expense-list")
export class ExpenseList extends LitElement {
  @property({ type: Array }) expenses: Expense[] = [];

  private _fmt(n: string) {
    return `$${parseFloat(n).toFixed(2)}`;
  }

  private _catColor(cat: string) {
    const colors: Record<string, string> = {
      "Food & Drink": "bg-yellow-100 text-yellow-800",
      Travel: "bg-blue-100 text-blue-800",
      Utilities: "bg-gray-100 text-gray-800",
      Entertainment: "bg-purple-100 text-purple-800",
    };
    return colors[cat] || "bg-gray-100 text-gray-800";
  }

  render() {
    return html`
      <div class="bg-white shadow p-4 rounded border">
        <h3 class="font-semibold text-[#000000] mb-2">Expenses</h3>
        ${this.expenses.length === 0
          ? html`<p class="text-[#4f4f4f]">No expenses recorded.</p>`
          : ""}
        ${this.expenses.map(
          (exp) => html`
            <div class="border-b py-2">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-[#000000]">${exp.description}</span>
                    <span class="text-xs px-2 py-0.5 rounded ${this._catColor(exp.category)}">${exp.category}</span>
                  </div>
                  <div class="text-xs text-[#4f4f4f] mt-1">
                    Paid by ${exp.payer.name} on ${exp.date}
                    ${exp.notes ? html`&mdash; <em>${exp.notes}</em>` : ""}
                  </div>
                  ${(exp as any).receipt_image
                    ? html`
                        <a
                          href=${(exp as any).receipt_image}
                          target="_blank"
                          class="text-xs underline inline-flex items-center gap-1 mt-1"
                          style="color: #032d42"
                        >
                          View Receipt
                        </a>
                      `
                    : ""}
                </div>
                <span class="font-mono font-semibold text-[#000000]">${this._fmt(exp.amount)}</span>
              </div>
            </div>
          `,
        )}
      </div>
    `;
  }
}
