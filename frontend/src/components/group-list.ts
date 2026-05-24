import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { StoreController } from "../store/store.js";

@customElement("group-list")
export class GroupList extends LitElement {
  private store = new StoreController(this);
  @state() private newGroupName = "";
  @state() private newGroupDesc = "";
  @state() private newGroupCurrency = "USD";
  @state() private toastMessage = "";
  @state() private toastType: "error" | "success" = "error";

  private _showToast(msg: string, type: "error" | "success" = "error") {
    this.toastMessage = msg;
    this.toastType = type;
    setTimeout(() => {
      this.toastMessage = "";
    }, 3000);
  }

  render() {
    return html`
      <div class="relative">
        ${this.toastMessage
          ? html`
              <div
                class="fixed top-4 right-4 z-50 px-4 py-3 rounded shadow-lg text-white text-sm font-semibold transition-opacity"
                style="${this.toastType === "error"
                  ? "background-color: #dc2626"
                  : "background-color: #16a34a"}"
              >
                ${this.toastMessage}
              </div>
            `
          : ""}
        <h2 class="text-xl font-bold mb-4 text-[#000000]">My Groups</h2>
        <button
          @click=${() => this.store.navigate("dashboard")}
          class="text-[#4f4f4f] underline mb-2 block text-sm"
        >
          &larr; Dashboard
        </button>
        <div class="bg-white shadow p-4 rounded border mb-4">
          <h3 class="font-semibold text-[#000000] mb-2">Create Group</h3>
          <div class="flex gap-2 mb-2">
            <input
              class="border p-2 flex-1 rounded text-[#4f4f4f]"
              .value=${this.newGroupName}
              @input=${(e: any) => (this.newGroupName = e.target.value)}
              placeholder="Group name"
            />
            <select
              class="border p-2 rounded text-[#4f4f4f] bg-white w-24"
              .value=${this.newGroupCurrency}
              @change=${(e: any) => (this.newGroupCurrency = e.target.value)}
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="INR">INR</option>
              <option value="GBP">GBP</option>
            </select>
            <button
              @click=${this.createGroup}
              class="px-4 py-2 rounded text-white font-semibold whitespace-nowrap"
              style="background-color: #62d84e"
            >
              Create
            </button>
          </div>
          <input
            class="border p-2 w-full rounded text-[#4f4f4f] text-sm"
            .value=${this.newGroupDesc}
            @input=${(e: any) => (this.newGroupDesc = e.target.value)}
            placeholder="Description (optional)"
          />
        </div>
        <div class="space-y-2">
          ${this.store.state.groups.map(
            (g) => html`
              <div class="bg-white shadow p-4 rounded border flex justify-between items-center">
                <div>
                  <h3 class="font-bold text-[#000000]">${g.name}</h3>
                  <p class="text-sm text-[#4f4f4f]">${g.description ?? ""}${g.base_currency ? html` <span class="text-xs">(${g.base_currency})</span>` : ""}</p>
                </div>
                <button
                  @click=${() => this.store.navigate("group-detail", g.sys_id)}
                  class="px-3 py-1 rounded text-white text-sm font-semibold"
                  style="background-color: #62d84e"
                >
                  Open
                </button>
              </div>
            `,
          )}
        </div>
      </div>
    `;
  }

  private async createGroup() {
    if (!this.newGroupName.trim()) return;
    try {
      await this.store.createGroup(this.newGroupName.trim(), this.newGroupDesc.trim(), this.newGroupCurrency);
      this.newGroupName = "";
      this.newGroupDesc = "";
    } catch (e: any) {
      const msg = e.message?.includes("409") || e.message?.includes("already exists")
        ? "A group with this name already exists."
        : "Failed to create group.";
      this._showToast(msg, "error");
    }
  }
}
