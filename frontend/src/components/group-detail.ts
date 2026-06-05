import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { StoreController } from "../store/store.js";
import { toast } from "./toast.js";
import { icon } from "./icons.js";
import { formatDate } from "../lib/format.js";
import "./avatar.js";
import "./badge.js";
import "./balance-summary.js";
import "./expense-list.js";
import "./add-expense-form.js";
import "./record-settlement-form.js";
import "./section-header.js";

@customElement("group-detail")
export class GroupDetail extends LitElement {
  private store = new StoreController(this);
  @state() private newMemberName = "";
  @state() private addingMember = false;

  private _confirmDelete() {
    const group = this.store.state.currentGroup;
    if (!group) return;
    if (
      confirm(
        `Delete "${group.name}" and all associated data? This cannot be undone.`,
      )
    ) {
      this._deleteGroup();
    }
  }

  private async _deleteGroup() {
    try {
      await this.store.deleteGroup(this.store.state.currentGroupId!);
      toast("Group deleted", "success");
    } catch {
      toast("Failed to delete group.", "error");
    }
  }

  private async _addMember() {
    if (!this.newMemberName.trim()) return;
    this.addingMember = true;
    try {
      await this.store.addMemberByName(this.newMemberName.trim());
      this.newMemberName = "";
      toast("Member added", "success");
    } catch (e: any) {
      const msg = e.message?.includes("already a member")
        ? "User is already a member."
        : e.message?.includes("403")
          ? "Only admins can add members."
          : "User not found or could not be added.";
      toast(msg, "error");
    } finally {
      this.addingMember = false;
    }
  }

  private async _removeMember(userSysId: string) {
    try {
      await this.store.removeMember(userSysId);
    } catch {
      toast("Failed to remove member.", "error");
    }
  }

  render() {
    const group = this.store.state.currentGroup;
    if (!group) {
      return html`
        <div class="space-y-6">
          <p class="text-sm text-ink-500">Loading group…</p>
        </div>
      `;
    }

    const currentUserId = this.store.state.currentUser;
    const isAdmin = group.members?.some(
      (m: any) => m.sys_id === currentUserId && m.role === "admin",
    );

    return html`
      <div class="space-y-6">
        <button
          class="btn btn-ghost btn-sm -ml-2"
          @click=${() => this.store.navigate("groups")}
        >
          ${icon.arrowLeft({ size: 14 })}
          <span>Back to groups</span>
        </button>

        <header>
          <p class="label-eyebrow">Group</p>
          <h1
            class="mt-1 text-2xl font-semibold tracking-tight text-ink-900"
          >
            ${group.name}
          </h1>
          <p class="mt-1 text-sm text-ink-500">
            ${group.description
              ? html`<span>${group.description}</span>
                  <span class="text-ink-300 mx-1">·</span>`
              : ""}
            <span>${group.base_currency}</span>
            <span class="text-ink-300 mx-1">·</span>
            <span
              >${group.members?.length ?? 0}
              member${group.members?.length === 1 ? "" : "s"}</span
            >
          </p>
        </header>

        <section>
          <section-header
            eyebrow="Roster"
            title="Members"
            subtitle="People sharing expenses in this group."
          >
            <span slot="action"></span>
          </section-header>

          <div class="card divide-y divide-ink-200">
            ${(group.members ?? []).map(
              (m: any) => html`
                <div class="flex items-center gap-3 px-4 py-3">
                  <sn-avatar .name=${m.name} size="md"></sn-avatar>
                  <div class="min-w-0 flex-1">
                    <p
                      class="text-sm font-medium text-ink-900 truncate"
                    >
                      ${m.name}
                    </p>
                    ${m.role === "admin"
                      ? html`<div class="mt-0.5">
                          <sn-badge tone="brand">
                            ${icon.crown({ size: 10 })}
                            <span>Admin</span>
                          </sn-badge>
                        </div>`
                      : ""}
                  </div>
                  ${isAdmin && m.role !== "admin"
                    ? html`
                        <button
                          class="btn btn-ghost btn-sm text-ink-500"
                          @click=${() => this._removeMember(m.sys_id)}
                          aria-label="Remove ${m.name}"
                        >
                          ${icon.x({ size: 14 })}
                        </button>
                      `
                    : ""}
                </div>
              `,
            )}
          </div>

          ${isAdmin
            ? html`
                <div class="card card-pad-sm mt-3 flex gap-2">
                  <input
                    class="input flex-1"
                    placeholder="Add member by name"
                    .value=${this.newMemberName}
                    @input=${(e: any) => (this.newMemberName = e.target.value)}
                    @keydown=${(e: KeyboardEvent) => {
                      if (e.key === "Enter") this._addMember();
                    }}
                    ?disabled=${this.addingMember}
                  />
                  <button
                    class="btn btn-secondary"
                    @click=${this._addMember}
                    ?disabled=${this.addingMember ||
                    !this.newMemberName.trim()}
                  >
                    ${icon.plus({ size: 14 })}
                    <span>Add</span>
                  </button>
                </div>
              `
            : ""}
        </section>

        <section>
          <section-header
            eyebrow="Snapshot"
            title="Balances"
            subtitle="Who owes whom, in ${group.base_currency}."
          >
            <span slot="action"></span>
          </section-header>

          <balance-summary
            .balances=${this.store.state.balances}
            .members=${group.members}
            .currency=${group.base_currency}
          ></balance-summary>
        </section>

        <section class="space-y-3">
          <add-expense-form
            .groupId=${group.sys_id}
            .members=${group.members}
            .currency=${group.base_currency}
          ></add-expense-form>

          <record-settlement-form
            .groupId=${group.sys_id}
            .members=${group.members}
            .currency=${group.base_currency}
          ></record-settlement-form>
        </section>

        <section>
          <section-header
            eyebrow="History"
            title="Expenses"
            subtitle="Most recent at the top."
          >
            <span slot="action"></span>
          </section-header>

          <expense-list
            .expenses=${this.store.state.expenses}
            .currency=${group.base_currency}
          ></expense-list>
        </section>

        ${isAdmin
          ? html`
              <section class="pt-4 border-t border-ink-200">
                <section-header
                  eyebrow="Danger zone"
                  title="Delete this group"
                  subtitle="This will remove all members, expenses, and balances."
                >
                  <span slot="action"></span>
                </section-header>
                <div class="card card-pad-sm flex items-center justify-between">
                  <p class="text-sm text-ink-500">
                    Once deleted, this group can't be recovered.
                  </p>
                  <button
                    class="btn btn-danger"
                    @click=${this._confirmDelete}
                  >
                    ${icon.trash({ size: 14 })}
                    <span>Delete group</span>
                  </button>
                </div>
              </section>
            `
          : ""}
      </div>
    `;
  }
}
