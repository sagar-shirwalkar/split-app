import { LitElement, html } from "lit";
import { property, customElement } from "lit/decorators.js";

@customElement("balance-summary")
export class BalanceSummary extends LitElement {
  @property({ type: Array }) balances: any[] = [];
  @property({ type: Array }) members: any[] = [];

  private _fmt(n: number | null | undefined) {
    return `$${(n ?? 0).toFixed(2)}`;
  }

  render() {
    return html`
      <div class="bg-white shadow p-4 rounded border">
        <h3 class="font-semibold text-[#000000] mb-2">Balances</h3>
        ${this.balances.length === 0
          ? html`<p class="text-[#4f4f4f]">No balances yet.</p>`
          : ""}
        ${this.balances.map(
          (b) => html`
            <div class="flex justify-between border-b py-1 text-[#4f4f4f]">
              <span
                >${this.getUserName(b.from_user)} owes
                ${this.getUserName(b.to_user)}</span
              >
              <span class="font-mono">${this._fmt(b.amount)}</span>
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
