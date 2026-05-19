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
        <h2 class="text-xl font-semibold mb-4">My Groups</h2>
        <button
          @click=${() => this.store.navigate("dashboard")}
          class="text-indigo-600 underline mb-2 block"
        >
          ← Dashboard
        </button>
        <div class="flex gap-2 mb-4">
          <input
            class="border p-2 flex-1"
            .value=${this.newGroupName}
            @input=${(e: any) => (this.newGroupName = e.target.value)}
            placeholder="Group name"
          />
          <button
            @click=${this.createGroup}
            class="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Create
          </button>
        </div>
        <div class="space-y-2">
          ${this.store.state.groups.map(
            (g) => html`
              <div
                class="bg-white shadow p-4 rounded flex justify-between items-center"
              >
                <div>
                  <h3 class="font-bold">${g.name}</h3>
                  <p class="text-sm text-gray-500">${g.description ?? ""}</p>
                </div>
                <button
                  @click=${() => this.store.navigate("group-detail", g.sys_id)}
                  class="text-indigo-600 underline"
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
