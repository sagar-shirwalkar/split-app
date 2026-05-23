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
  @state() private newMemberName = "";
  @state() private toastMessage = "";
  @state() private toastType: "error" | "success" = "error";

  private _showToast(msg: string, type: "error" | "success" = "error") {
    this.toastMessage = msg;
    this.toastType = type;
    setTimeout(() => {
      this.toastMessage = "";
    }, 3000);
  }

  private _confirmDelete() {
    const group = this.store.state.currentGroup;
    if (!group) return;
    if (confirm(`Delete "${group.name}" and all associated data? This cannot be undone.`)) {
      this._deleteGroup();
    }
  }

  private async _deleteGroup() {
    try {
      await this.store.deleteGroup(this.store.state.currentGroupId!);
    } catch {
      this._showToast("Failed to delete group.", "error");
    }
  }

  render() {
    const group = this.store.state.currentGroup;
    if (!group) return html`<p class="text-[#4f4f4f]">Loading...</p>`;

    const currentUserId = this.store.state.currentUser;
    const isAdmin = group.members?.some(
      (m: any) => m.sys_id === currentUserId && m.role === "admin",
    );

    return html`
      <div class="relative">
        ${this.toastMessage
          ? html`
              <div
                class="fixed top-4 right-4 z-50 px-4 py-3 rounded shadow-lg text-white text-sm font-semibold"
                style="${this.toastType === "error"
                  ? "background-color: #dc2626"
                  : "background-color: #16a34a"}"
              >
                ${this.toastMessage}
              </div>
            `
          : ""}
        <button
          @click=${() => this.store.navigate("groups")}
          class="text-[#4f4f4f] underline mb-2 block text-sm"
        >
          &larr; Back to groups
        </button>
        <div class="flex justify-between items-start mb-4">
          <div>
            <h2 class="text-2xl font-bold text-[#000000]">${group.name}</h2>
            <p class="text-[#4f4f4f]">
              ${group.description ?? ""} (${group.base_currency})
            </p>
          </div>
          ${isAdmin
            ? html`
                <button
                  @click=${this._confirmDelete}
                  class="px-3 py-1 rounded text-white text-sm font-semibold"
                  style="background-color: #dc2626"
                >
                  Delete Group
                </button>
              `
            : ""}
        </div>

        <div class="bg-white shadow p-4 rounded border mb-4">
          <h3 class="font-semibold text-[#000000] mb-2">Members</h3>
          <ul class="space-y-1">
            ${group.members.map(
              (m: any) => html`
                <li class="flex justify-between items-center text-[#4f4f4f]">
                  <span>${m.name} <span class="text-xs">(${m.role})</span></span>
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
                    class="border p-1 flex-1 text-sm rounded text-[#4f4f4f]"
                    placeholder="User name"
                    .value=${this.newMemberName}
                    @input=${(e: any) => (this.newMemberName = e.target.value)}
                  />
                  <button
                    @click=${this.addMember}
                    class="px-3 py-1 rounded text-white text-sm font-semibold whitespace-nowrap"
                    style="background-color: #62d84e"
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
    if (!this.newMemberName.trim()) return;
    try {
      await this.store.addMemberByName(this.newMemberName.trim());
      this.newMemberName = "";
      this._showToast("Member added.", "success");
    } catch (e: any) {
      const msg = e.message?.includes("already a member")
        ? "User is already a member."
        : e.message?.includes("403")
          ? "Only admins can add members."
          : "User not found or could not be added.";
      this._showToast(msg, "error");
    }
  }

  private async removeMember(userSysId: string) {
    try {
      await this.store.removeMember(userSysId);
    } catch {
      this._showToast("Failed to remove member.", "error");
    }
  }
}
