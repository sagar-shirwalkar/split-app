import { LitElement, html } from "lit";
import { property, customElement } from "lit/decorators.js";
import { formatMoney } from "../lib/format.js";
import { icon } from "./icons.js";
import "./avatar.js";
import "./empty-state.js";

@customElement("balance-summary")
export class BalanceSummary extends LitElement {
  @property({ type: Array }) balances: any[] = [];
  @property({ type: Array }) members: any[] = [];
  @property({ type: String }) currency = "USD";
  @property({ type: String }) currentUserId = "";

  private _name(sysId: string) {
    const m = this.members.find((m: any) => m.sys_id === sysId);
    return m ? m.name : sysId;
  }

  render() {
    if (!this.balances || this.balances.length === 0) {
      return html`
        <empty-state
          title="All settled up"
          body="Nobody owes anybody in this group right now."
        ></empty-state>
      `;
    }

    return html`
      <ul class="card divide-y divide-ink-200">
        ${this.balances.map(
          (b) => html`
            <li
              class="flex items-center gap-3 px-4 py-3"
            >
              <div class="flex items-center -space-x-2 shrink-0">
                <sn-avatar .name=${this._name(b.from_user)} size="sm"></sn-avatar>
                <sn-avatar .name=${this._name(b.to_user)} size="sm"></sn-avatar>
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-sm text-ink-900 truncate">
                  <span class="font-medium">${this._name(b.from_user)}</span>
                  <span class="text-ink-500"> owes </span>
                  <span class="font-medium">${this._name(b.to_user)}</span>
                </p>
              </div>
              <p
                class="font-semibold text-sm num font-tabular
                       text-ink-900"
              >
                ${formatMoney(b.amount, this.currency)}
              </p>
            </li>
          `,
        )}
      </ul>
    `;
  }
}
