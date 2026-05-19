import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { StoreController } from "../store/store.js";
import "./balance-summary.js";
import "./expense-list.js";
import "./add-expense-form.js";
import "./record-settlement-form.js";

@customElement("group-detail")
export class GroupDetail extends LitElement {
  private store = new StoreController(this);
  @state() private newMemberId = "";

  render() {
    const group = this.store.state.currentGroup;
    if (!group) return html`<p>Loading...</p>`;

    const currentUserId = this.store.state.currentUser;
    const isAdmin = group.members?.some(
      (m: any) => m.sys_id === currentUserId && m.role === "admin",
    );

    return html`
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
            ${group.members.map(
              (m: any) => html`
                <li class="flex justify-between items-center">
                  <span>${m.name} (${m.role})</span>
                  ${isAdmin && m.role !== "admin"
                    ? html`
                        <button
                          @click=${() => this.removeMember(m.sys_id)}
                          class="text-red-600 text-sm underline"
                        >
                          Remove
                        </button>
                      `
                    : ""}
                </li>
              `,
            )}
          </ul>
          ${isAdmin
            ? html`
                <div class="flex gap-2 mt-2">
                  <input
                    class="border p-1 flex-1 text-sm"
                    placeholder="User sys_id"
                    .value=${this.newMemberId}
                    @input=${(e: any) => (this.newMemberId = e.target.value)}
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

  private async addMember() {
    if (this.newMemberId.trim()) {
      await this.store.addMember(this.newMemberId.trim());
      this.newMemberId = "";
    }
  }

  private async removeMember(userSysId: string) {
    await this.store.removeMember(userSysId);
  }
}
