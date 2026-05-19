import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import { customElement } from "lit/decorators.js";

@customElement("balance-summary")
export class BalanceSummary extends LitElement {
  @property({ type: Array }) balances: any[] = [];
  @property({ type: Array }) members: any[] = [];

  render() {
    return html`
      <div class="bg-white shadow p-4 rounded">
        <h3 class="font-semibold mb-2">Balances</h3>
        ${this.balances.length === 0
          ? html`<p class="text-gray-500">No balances yet.</p>`
          : ""}
        ${this.balances.map(
          (b) => html`
            <div class="flex justify-between border-b py-1">
              <span
                >${this.getUserName(b.from_user)} owes
                ${this.getUserName(b.to_user)}</span
              >
              <span class="font-mono">${b.amount.toFixed(2)}</span>
            </div>
          `,
        )}
      </div>
    `;
  }

  private getUserName(sysId: string): string {
    const member = this.members.find((m: any) => m.sys_id === sysId);
    return member ? member.name : sysId;
  }
}
