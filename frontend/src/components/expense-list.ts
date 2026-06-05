import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Expense } from "../store/store.js";
import { formatMoney, formatDate } from "../lib/format.js";
import { icon } from "./icons.js";
import "./empty-state.js";

const CATEGORIES: Array<{
  key: string;
  label: string;
  bg: string;
  text: string;
  icon: (o?: { size?: number }) => any;
}> = [
  { key: "Food & Drink",   label: "Food",  bg: "bg-amber-100",   text: "text-amber-700",   icon: icon.utensils },
  { key: "Travel",         label: "Travel", bg: "bg-sky-100",    text: "text-sky-700",     icon: icon.plane },
  { key: "Utilities",      label: "Utilities", bg: "bg-emerald-100", text: "text-emerald-700", icon: icon.zap },
  { key: "Entertainment",  label: "Fun",   bg: "bg-violet-100",  text: "text-violet-700",  icon: icon.film },
  { key: "Other",          label: "Other", bg: "bg-ink-100",     text: "text-ink-700",     icon: icon.package },
];

function categoryFor(key: string) {
  return CATEGORIES.find((c) => c.key === key) ?? CATEGORIES[CATEGORIES.length - 1];
}

@customElement("expense-list")
export class ExpenseList extends LitElement {
  @property({ type: Array }) expenses: Expense[] = [];
  @property({ type: String }) currency = "USD";

  render() {
    const expenses = Array.isArray(this.expenses) ? this.expenses : [];
    if (expenses.length === 0) {
      return html`
        <empty-state
          title="No expenses yet"
          body="Add your first expense to start tracking who paid for what."
        ></empty-state>
      `;
    }

    return html`
      <ul class="card divide-y divide-ink-200">
        ${expenses.map((exp) => {
          const cat = categoryFor(exp.category);
          return html`
            <li class="px-4 py-3">
              <div class="flex items-start gap-3">
                <div
                  class="shrink-0 inline-flex h-9 w-9 items-center
                         justify-center rounded-lg ${cat.bg} ${cat.text}"
                  aria-hidden="true"
                >
                  ${cat.icon({ size: 16 })}
                </div>
                <div class="min-w-0 flex-1">
                  <div class="flex items-center justify-between gap-2">
                    <p
                      class="text-sm font-medium text-ink-900 truncate"
                    >
                      ${exp.description}
                    </p>
                    <p
                      class="text-sm font-semibold num font-tabular
                             text-ink-900 shrink-0"
                    >
                      ${formatMoney(exp.amount, this.currency)}
                    </p>
                  </div>
                  <div
                    class="mt-0.5 flex items-center gap-2 text-xs text-ink-500"
                  >
                    <span>${exp.payer?.name ?? "Unknown"}</span>
                    <span class="text-ink-300">·</span>
                    <span>${formatDate(exp.date)}</span>
                    <span
                      class="inline-flex items-center gap-1 rounded-full
                             px-1.5 py-0.5 text-[10px] font-medium
                             ${cat.bg} ${cat.text}"
                    >
                      ${cat.label}
                    </span>
                  </div>
                  ${exp.notes
                    ? html`<p
                        class="mt-1 text-xs text-ink-500 italic truncate"
                      >
                        ${exp.notes}
                      </p>`
                    : ""}
                  ${(exp as any).receipt_image
                    ? html`
                        <a
                          href=${(exp as any).receipt_image}
                          target="_blank"
                          rel="noopener"
                          class="mt-1 inline-flex items-center gap-1
                                 text-xs text-brand-600 hover:underline"
                        >
                          ${icon.receipt({ size: 12 })}
                          <span>View receipt</span>
                        </a>
                      `
                    : ""}
                </div>
              </div>
            </li>
          `;
        })}
      </ul>
    `;
  }
}
