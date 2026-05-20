var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import { customElement } from "lit/decorators.js";
let BalanceSummary = class BalanceSummary extends LitElement {
    constructor() {
        super(...arguments);
        this.balances = [];
        this.members = [];
    }
    render() {
        return html `
      <div class="bg-white shadow p-4 rounded">
        <h3 class="font-semibold mb-2">Balances</h3>
        ${this.balances.length === 0
            ? html `<p class="text-gray-500">No balances yet.</p>`
            : ""}
        ${this.balances.map((b) => html `
            <div class="flex justify-between border-b py-1">
              <span
                >${this.getUserName(b.from_user)} owes
                ${this.getUserName(b.to_user)}</span
              >
              <span class="font-mono">${b.amount.toFixed(2)}</span>
            </div>
          `)}
      </div>
    `;
    }
    getUserName(sysId) {
        const member = this.members.find((m) => m.sys_id === sysId);
        return member ? member.name : sysId;
    }
};
__decorate([
    property({ type: Array })
], BalanceSummary.prototype, "balances", void 0);
__decorate([
    property({ type: Array })
], BalanceSummary.prototype, "members", void 0);
BalanceSummary = __decorate([
    customElement("balance-summary")
], BalanceSummary);
export { BalanceSummary };
