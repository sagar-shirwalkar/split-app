import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { StoreController } from "../store/store.js";

@customElement("group-list")
export class GroupList extends LitElement {
  private store = new StoreController(this);
  @state() private newGroupName = "";

  render() {
    return html`
      <div>
        <h2 class="text-xl font-bold mb-4 text-[#000000]">My Groups</h2>
        <button
          @click=${() => this.store.navigate("dashboard")}
          class="text-[#4f4f4f] underline mb-2 block text-sm"
        >
          &larr; Dashboard
        </button>
        <div class="flex gap-2 mb-4">
          <input
            class="border p-2 flex-1 rounded text-[#4f4f4f]"
            .value=${this.newGroupName}
            @input=${(e: any) => (this.newGroupName = e.target.value)}
            placeholder="Group name"
          />
          <button
            @click=${this.createGroup}
            class="px-4 py-2 rounded text-white font-semibold"
            style="background-color: #62d84e"
          >
            Create
          </button>
        </div>
        <div class="space-y-2">
          ${this.store.state.groups.map(
            (g) => html`
              <div class="bg-white shadow p-4 rounded border flex justify-between items-center">
                <div>
                  <h3 class="font-bold text-[#000000]">${g.name}</h3>
                  <p class="text-sm text-[#4f4f4f]">${g.description ?? ""}</p>
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
    if (this.newGroupName.trim()) {
      await this.store.createGroup(this.newGroupName.trim());
      this.newGroupName = "";
    }
  }
}
