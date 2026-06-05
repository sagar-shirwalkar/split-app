/**
 * Stat card — used on the dashboard to surface totals.
 * The trend badge uses the same accent for "you're owed" and
 * warning for "you owe" — visually consistent with balance rows.
 */
import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { icon } from "./icons.js";
import { formatMoney } from "../lib/format.js";

export type StatTone = "neutral" | "positive" | "negative";

@customElement("stat-card")
export class StatCard extends LitElement {
  @property({ type: String }) label = "";
  @property({ type: String }) amount = "";
  @property({ type: String }) tone: StatTone = "neutral";
  @property({ type: String }) currency = "USD";
  @property({ type: String }) hint = "";
  @property({ type: Boolean }) loading = false;

  render() {
    const toneAccent: Record<StatTone, string> = {
      neutral: "bg-ink-100 text-ink-700",
      positive: "bg-accent-50 text-accent-600",
      negative: "bg-warning-50 text-warning-500",
    };
    const toneIcon: Record<StatTone, ReturnType<typeof icon.trendingUp>> = {
      neutral: icon.wallet({ size: 14 }),
      positive: icon.trendingUp({ size: 14 }),
      negative: icon.trendingDown({ size: 14 }),
    };
    return html`
      <div class="card card-pad">
        <div class="flex items-center justify-between mb-3">
          <p class="label-eyebrow">${this.label}</p>
          <span
            class="inline-flex h-6 w-6 items-center justify-center
                   rounded-full ${toneAccent[this.tone]}"
          >
            ${toneIcon[this.tone]}
          </span>
        </div>
        ${this.loading
          ? html`<div
              class="h-8 w-32 rounded bg-ink-100 animate-pulse"
            ></div>`
          : html`<p
              class="text-2xl font-semibold tracking-tight
                     text-ink-900 font-tabular num"
            >
              ${formatMoney(this.amount, this.currency)}
            </p>`}
        ${this.hint
          ? html`<p class="mt-1 text-xs text-ink-500">${this.hint}</p>`
          : ""}
      </div>
    `;
  }
}
