var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { StoreController } from "../store/store.js";
import "./balance-summary.js";
import "./expense-list.js";
import "./add-expense-form.js";
import "./record-settlement-form.js";
let GroupDetail = class GroupDetail extends LitElement {
    constructor() {
        super(...arguments);
        this.store = new StoreController(this);
        this.newMemberId = "";
    }
    render() {
        const group = this.store.state.currentGroup;
        if (!group)
            return html `<p>Loading...</p>`;
        const currentUserId = this.store.state.currentUser;
        const isAdmin = group.members?.some((m) => m.sys_id === currentUserId && m.role === "admin");
        return html `
      <div>
        <button
          @click=${() => this.store.navigate("groups")}
          class="text-indigo-600 underline mb-2 block"
        >
          ← Back to groups
        </button>
        <h2 class="text-2xl font-bold">${group.name}</h2>
        <p class="text-gray-600 mb-4">
          ${group.description ?? ""} (${group.base_currency})
        </p>

        <div class="bg-white shadow p-4 rounded mb-4">
          <h3 class="font-semibold mb-2">Members</h3>
          <ul class="space-y-1">
            ${group.members.map((m) => html `
                <li class="flex justify-between items-center">
                  <span>${m.name} (${m.role})</span>
                  ${isAdmin && m.role !== "admin"
            ? html `
                        <button
                          @click=${() => this.removeMember(m.sys_id)}
                          class="text-red-600 text-sm underline"
                        >
                          Remove
                        </button>
                      `
            : ""}
                </li>
              `)}
          </ul>
          ${isAdmin
            ? html `
                <div class="flex gap-2 mt-2">
                  <input
                    class="border p-1 flex-1 text-sm"
                    placeholder="User sys_id"
                    .value=${this.newMemberId}
                    @input=${(e) => (this.newMemberId = e.target.value)}
                  />
                  <button
                    @click=${this.addMember}
                    class="bg-indigo-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Add
                  </button>
                </div>
              `
            : ""}
        </div>

        <balance-summary
          .balances=${this.store.state.balances}
          .members=${group.members}
        ></balance-summary>

        <div class="mt-6">
          <add-expense-form
            .groupId=${group.sys_id}
            .members=${group.members}
          ></add-expense-form>
        </div>

        <div class="mt-6">
          <record-settlement-form
            .groupId=${group.sys_id}
            .members=${group.members}
          ></record-settlement-form>
        </div>

        <div class="mt-6">
          <expense-list .expenses=${this.store.state.expenses}></expense-list>
        </div>
      </div>
    `;
    }
    async addMember() {
        if (this.newMemberId.trim()) {
            await this.store.addMember(this.newMemberId.trim());
            this.newMemberId = "";
        }
    }
    async removeMember(userSysId) {
        await this.store.removeMember(userSysId);
    }
};
__decorate([
    state()
], GroupDetail.prototype, "newMemberId", void 0);
GroupDetail = __decorate([
    customElement("group-detail")
], GroupDetail);
export { GroupDetail };
