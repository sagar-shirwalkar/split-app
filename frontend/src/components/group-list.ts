import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { StoreController } from "../store/store.js";
import { toast } from "./toast.js";
import { icon } from "./icons.js";
import "./avatar.js";
import "./empty-state.js";
import "./section-header.js";

@customElement("group-list")
export class GroupList extends LitElement {
  private store = new StoreController(this);
  @state() private newGroupName = "";
  @state() private newGroupDesc = "";
  @state() private newGroupCurrency = "USD";
  @state() private creating = false;

  private async _create() {
    if (!this.newGroupName.trim()) return;
    this.creating = true;
    try {
      await this.store.createGroup(
        this.newGroupName.trim(),
        this.newGroupDesc.trim(),
        this.newGroupCurrency,
      );
      this.newGroupName = "";
      this.newGroupDesc = "";
      toast("Group created", "success");
    } catch (e: any) {
      const msg =
        e.message?.includes("409") || e.message?.includes("already exists")
          ? "A group with this name already exists."
          : "Failed to create group.";
      toast(msg, "error");
    } finally {
      this.creating = false;
    }
  }

  render() {
    const groups = this.store.state.groups;
    return html`
      <div class="space-y-6">
        <section>
          <p class="label-eyebrow">All groups</p>
          <h1
            class="mt-1 text-2xl font-semibold tracking-tight text-ink-900"
          >
            My groups
          </h1>
          <p class="mt-1 text-sm text-ink-500">
            ${groups.length === 0
              ? "Track shared expenses with friends, trips, or roommates."
              : `${groups.length} active group${groups.length === 1 ? "" : "s"}.`}
          </p>
        </section>

        <section>
          <section-header eyebrow="New" title="Create a group">
            <span slot="action"></span>
          </section-header>

          <div class="card card-pad space-y-3">
            <div>
              <label
                for="grp-name"
                class="block text-xs font-medium text-ink-700 mb-1"
                >Name</label
              >
              <input
                id="grp-name"
                class="input"
                .value=${this.newGroupName}
                @input=${(e: any) => (this.newGroupName = e.target.value)}
                placeholder="e.g. Apartment 4B"
                ?disabled=${this.creating}
              />
            </div>
            <div>
              <label
                for="grp-desc"
                class="block text-xs font-medium text-ink-700 mb-1"
                >Description <span class="text-ink-400">(optional)</span></label
              >
              <input
                id="grp-desc"
                class="input"
                .value=${this.newGroupDesc}
                @input=${(e: any) => (this.newGroupDesc = e.target.value)}
                placeholder="What is this group for?"
                ?disabled=${this.creating}
              />
            </div>
            <div class="flex items-end gap-3">
              <div class="flex-1">
                <label
                  for="grp-currency"
                  class="block text-xs font-medium text-ink-700 mb-1"
                  >Currency</label
                >
                <select
                  id="grp-currency"
                  class="select"
                  .value=${this.newGroupCurrency}
                  @change=${(e: any) => (this.newGroupCurrency = e.target.value)}
                  ?disabled=${this.creating}
                >
                  <option value="USD">USD — US Dollar</option>
                  <option value="EUR">EUR — Euro</option>
                  <option value="INR">INR — Indian Rupee</option>
                  <option value="GBP">GBP — British Pound</option>
                </select>
              </div>
              <button
                class="btn btn-primary"
                @click=${this._create}
                ?disabled=${this.creating || !this.newGroupName.trim()}
              >
                ${icon.plus({ size: 14 })}
                <span>Create group</span>
              </button>
            </div>
          </div>
        </section>

        <section>
          <section-header
            eyebrow="Groups"
            title="Your groups"
            subtitle=${groups.length === 0
              ? ""
              : "Tap a group to view members, balances, and expenses."}
          >
            <span slot="action"></span>
          </section-header>

          ${groups.length === 0
            ? html`
                <empty-state
                  title="No groups yet"
                  body="Use the form above to create your first group. You can add members once it's set up."
                ></empty-state>
              `
            : html`
                <ul class="card divide-y divide-ink-200">
                  ${groups.map(
                    (g) => html`
                      <li>
                        <button
                          class="w-full flex items-center gap-3 px-4 py-3
                                 text-left transition-colors
                                 hover:bg-ink-50 focus-visible:outline-none
                                 focus-visible:bg-ink-50
                                 focus-visible:ring-2
                                 focus-visible:ring-brand-500
                                 focus-visible:ring-inset"
                          @click=${() =>
                            this.store.navigate("group-detail", g.sys_id)}
                        >
                          <sn-avatar
                            .name=${g.name}
                            size="md"
                          ></sn-avatar>
                          <div class="min-w-0 flex-1">
                            <p
                              class="text-sm font-medium text-ink-900 truncate"
                            >
                              ${g.name}
                            </p>
                            <p
                              class="text-xs text-ink-500 truncate flex items-center gap-1"
                            >
                              ${g.description
                                ? html`<span>${g.description}</span>
                                    <span class="text-ink-300">·</span>`
                                : ""}
                              <span>${g.base_currency}</span>
                            </p>
                          </div>
                          <span class="text-ink-400">
                            ${icon.chevronRight({ size: 16 })}
                          </span>
                        </button>
                      </li>
                    `,
                  )}
                </ul>
              `}
        </section>
      </div>
    `;
  }
}
