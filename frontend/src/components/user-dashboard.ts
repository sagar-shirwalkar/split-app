import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { StoreController } from "../store/store.js";
import "./stat-card.js";
import "./empty-state.js";
import "./section-header.js";

@customElement("user-dashboard")
export class UserDashboard extends LitElement {
  private store = new StoreController(this);

  render() {
    const dash = this.store.state.userDashboard;
    const totalGroups = this.store.state.groups.length;
    const isLoading = !dash;

    return html`
      <div class="space-y-6">
        <section>
          <p class="label-eyebrow">Welcome back</p>
          <h1
            class="mt-1 text-2xl font-semibold tracking-tight text-ink-900"
          >
            Your overview
          </h1>
          <p class="mt-1 text-sm text-ink-500">
            ${totalGroups === 0
              ? "Create a group to start tracking shared expenses."
              : `You're in ${totalGroups} group${totalGroups === 1 ? "" : "s"}.`}
          </p>
        </section>

        <section class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <stat-card
            label="You owe"
            tone="negative"
            .amount=${dash?.total_owed ?? 0}
            .loading=${isLoading}
            hint="Across all groups"
          ></stat-card>
          <stat-card
            label="You are owed"
            tone="positive"
            .amount=${dash?.total_owing ?? 0}
            .loading=${isLoading}
            hint="Friends owe you"
          ></stat-card>
        </section>

        <section>
          <section-header
            eyebrow="Next step"
            title="Open a group"
            subtitle=${totalGroups === 0
              ? "You'll see your groups here once you create one."
              : "Pick a group to view balances, members, and expenses."}
          >
            <button
              slot="action"
              class="btn btn-primary"
              @click=${() => this.store.navigate("groups")}
            >
              ${totalGroups === 0 ? "Create a group" : "View groups"}
            </button>
          </section-header>

          ${totalGroups === 0
            ? html`
                <empty-state
                  title="No groups yet"
                  body="Groups let you track shared expenses with friends, family, or roommates. Add a name and a base currency to get started."
                >
                  <div slot="cta" class="mt-4">
                    <button
                      class="btn btn-primary"
                      @click=${() => this.store.navigate("groups")}
                    >
                      Create your first group
                    </button>
                  </div>
                </empty-state>
              `
            : html`
                <div class="card card-pad">
                  <p class="text-sm text-ink-500">
                    Head to
                    <button
                      class="btn-link"
                      @click=${() => this.store.navigate("groups")}
                    >
                      Groups
                    </button>
                    to see balances and recent activity.
                  </p>
                </div>
              `}
        </section>
      </div>
    `;
  }
}
