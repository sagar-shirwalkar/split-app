# SplitApp

A split-expense tracking application (inspired by Splitwise) built for ServiceNow. Groups of users can track shared expenses, split costs across members using multiple strategies, and record settlements to clear balances.

## Features

### Group Management
- Create groups with a name, optional description, and configurable base currency (default: USD)
- Group creator is automatically assigned the Admin role
- Admins can add or remove members (removal blocked if the member has outstanding balances)
- Users see only the groups they belong to

### Expense Management
- Four split strategies:
  - **Equal** — auto-calculated per member
  - **Exact** — user specifies each member's amount
  - **Percentage** — user specifies each member's percentage; amounts auto-calculated
  - **Shares** — user assigns integer units; amounts auto-calculated
- Categories: Food & Drink, Travel, Utilities, Entertainment, Other
- Optional notes (up to 500 characters)
- Optional receipt image URL
- The payer or a group Admin can edit or delete an expense, provided no shares have been settled

### Balance & Settlement
- Simplified net balance view: bidirectional debts are netted (if A owes B $30 and B owes A $10, only A owes B $20 is shown)
- Record settlements specifying recipient, amount, date, and payment method
- Settlements are applied to the oldest unsettled shares first (FIFO)
- Partial settlements supported — a share is tracked via `settled_amount`
- Warning if a settlement exceeds the outstanding balance
- Personal dashboard across all groups showing total owed and total owing

### Security
- Membership-gated: all REST endpoints validate the caller belongs to the group
- Only the expense payer or a group Admin can mutate an expense
- Only Admins can add or remove members

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | [Lit](https://lit.dev) 3.x — reactive web components |
| **Styling** | [Tailwind CSS](https://tailwindcss.com) v4 — utility-first CSS |
| **Bundler** | [Vite](https://vitejs.dev) 8.x — dev server & production builds |
| **Backend** | ServiceNow scoped application (scope `x_split`) |
| **Data** | Custom ServiceNow tables — `x_split_group`, `x_split_membership`, `x_split_expense`, `x_split_share`, `x_split_settlement` |
| **API** | ServiceNow REST API with Script Includes for business logic |
| **Deployment** | [ServiceNow SDK](https://www.servicenow.com/docs/csh?topicname=servicenow-sdk-landing&version=latest) (`@servicenow/sdk`) |

## Project Structure

```
split-app/
├── frontend/                    # Lit + Vite SPA
│   ├── src/
│   │   ├── main.ts              # Entry point
│   │   ├── split-app.ts         # Root component (view router)
│   │   ├── store/store.ts       # Reactive state (StoreController)
│   │   ├── services/api.ts      # Fetch-based API client
│   │   └── components/
│   │       ├── user-dashboard.ts
│   │       ├── group-list.ts
│   │       ├── group-detail.ts   # Includes member management
│   │       ├── balance-summary.ts
│   │       ├── add-expense-form.ts
│   │       ├── expense-list.ts
│   │       └── record-settlement-form.ts
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
├── sn/                          # ServiceNow backend artifacts
│   ├── app.json
│   ├── sys_db_object/           # Custom table definitions
│   ├── sys_script_include/      # Business logic
│   ├── sys_ws_definition/       # REST API definition
│   └── sys_ws_operation/        # Per-endpoint scripts
└── package.json                 # Monorepo scripts
```

### REST API Endpoints

All under `/api/x_split/`:

| Method | Path | Description |
|---|---|---|
| `GET` | `/groups` | List groups for the current user |
| `POST` | `/groups` | Create a new group |
| `GET` | `/groups/{groupId}` | Get group detail with members |
| `POST` | `/groups/{groupId}/members` | Add a member (admin only) |
| `DELETE` | `/groups/{groupId}/members/{userId}` | Remove a member (admin only) |
| `GET` | `/groups/{groupId}/expenses` | List all expenses for a group |
| `POST` | `/groups/{groupId}/expenses` | Create an expense |
| `GET` | `/groups/{groupId}/expenses/{expenseId}` | Get expense detail with shares |
| `PUT` | `/groups/{groupId}/expenses/{expenseId}` | Update an expense |
| `DELETE` | `/groups/{groupId}/expenses/{expenseId}` | Delete an expense |
| `GET` | `/groups/{groupId}/balances` | Get net balances between members |
| `POST` | `/groups/{groupId}/settlements` | Record a settlement |
| `GET` | `/user/dashboard` | Get personal dashboard summary |

## Running Locally (Development)

### Prerequisites

- Node.js >= 20
- npm

### Setup

```bash
# Install dependencies
cd frontend && npm install
cd ..

# Set your ServiceNow instance URL (used by Vite proxy in dev mode)
export VITE_SN_INSTANCE=https://your-instance.service-now.com
```

### Start the dev server

```bash
npm run dev
```

This starts the Vite dev server (default: `http://localhost:5173`). API requests to `/api/x_split/*` are proxied to the ServiceNow instance configured in `VITE_SN_INSTANCE`. The browser authenticates using your ServiceNow session.

### Testing with curl examples

You can test the REST API directly against your ServiceNow instance. Use Basic Auth or a session cookie:

```bash
SN=https://your-instance.service-now.com
AUTH="--user admin:yourpassword"

# 1. Create a group
GROUP=$(curl -s $AUTH -X POST "$SN/api/x_split/groups" \
  -H "Content-Type: application/json" \
  -d '{"name":"Goa Trip 2025","description":"Beach vacation"}')
echo "$GROUP"
# → {"sys_id":"abc123","name":"Goa Trip 2025"}
GROUP_ID=$(echo "$GROUP" | rg '"sys_id":"([^"]+)"' -r '$1')

# 2. Find user sys_ids
USERS=$(curl -s $AUTH "$SN/api/now/table/sys_user?sysparm_query=active=true&sysparm_fields=sys_id,name&sysparm_limit=5")
echo "$USERS"
# Pick two other users and use their sys_ids

# 3. Add members
curl -s $AUTH -X POST "$SN/api/x_split/groups/$GROUP_ID/members" \
  -H "Content-Type: application/json" \
  -d '{"user_sys_id":"user1_sys_id"}'
curl -s $AUTH -X POST "$SN/api/x_split/groups/$GROUP_ID/members" \
  -H "Content-Type: application/json" \
  -d '{"user_sys_id":"user2_sys_id"}'

# 4. Add an equal-split expense of $90
EXPENSE=$(curl -s $AUTH -X POST "$SN/api/x_split/groups/$GROUP_ID/expenses" \
  -H "Content-Type: application/json" \
  -d '{"description":"Dinner","amount":90.00,"date":"2025-06-01","category":"Food & Drink","split_type":"equal"}')
echo "$EXPENSE"

# 5. View balances
curl -s $AUTH "$SN/api/x_split/groups/$GROUP_ID/balances"
# → All three users see a balance of $30 each

# 6. Record a settlement (user B → payer A, $30)
curl -s $AUTH -X POST "$SN/api/x_split/groups/$GROUP_ID/settlements" \
  -H "Content-Type: application/json" \
  -d '{"to_user":"payer_sys_id","amount":30.00,"date":"2025-06-02","payment_method":"cash"}'

# 7. Verify updated balances
curl -s $AUTH "$SN/api/x_split/groups/$GROUP_ID/balances"
# → User B's balance drops to $0, payer's balance reduces by $30

# 8. Security check: non-member gets 403
curl -s $AUTH "$SN/api/x_split/groups/$GROUP_ID/balances"
# (if called by someone not in the group)
# → 403 Forbidden
```

### Running frontend tests (if added)

```bash
cd frontend && npm test
```

## Deploying to a ServiceNow PDI

### What is a PDI?

A Personal Developer Instance (PDI) is a free ServiceNow sandbox for development. You can request one at [developer.servicenow.com](https://developer.servicenow.com).

### Prerequisites

- A ServiceNow PDI (e.g., `https://dev123456.service-now.com`)
- Admin credentials for the instance
- Node.js >= 20
- The ServiceNow CLI (`@servicenow/sdk`)
- The ServiceNow **REST API Explorer** plugin installed on your instance (optional, for testing)

### Step 1: Install the ServiceNow CLI

```bash
# Already in the project dependencies; install from root
npm install
```

### Step 2: Configure instance credentials

Set your PDI credentials as environment variables or pass them directly:

```bash
export SN_INSTANCE=https://dev123456.service-now.com
export SN_USERNAME=admin
export SN_PASSWORD=your-admin-password
```

### Step 3: Deploy the backend artifacts

```bash
npm run deploy
# This runs: snc deploy sn/
```

This deploys all artifacts from `sn/`:
- **Custom tables**: `x_split_group`, `x_split_membership`, `x_split_expense`, `x_split_share`, `x_split_settlement`
- **Business logic**: `SplitUtils`, `BalanceCalculator`, `ExpenseManager`, `SettlementProcessor`
- **REST API**: All endpoints under `/api/x_split`

### Step 4: Set up application scope access

After deploying, the application scope `x_split` is installed. For the REST API to be accessible:

1. Navigate to your instance: `https://dev123456.service-now.com`
2. Go to **System Web Services → REST API Explorer**
3. Verify the `x_split` API appears under **Custom APIs**
4. Or go to **Application Files → All** and search for `split_api` to confirm it's active

### Step 5: Deploy the frontend

**Option A: Serve from Vite dev server (development)**

```bash
cd frontend
VITE_SN_INSTANCE=https://dev123456.service-now.com npm run dev
```

Open `http://localhost:5173` in your browser. Login to your PDI in another tab first so the session cookie is available.

**Option B: Deploy static files to ServiceNow**

Build the frontend and upload to your instance:

```bash
cd frontend
npm run build
# Creates dist/ with index.html + assets
```

Then create a **UI Page** on your instance:

1. Navigate to **System UI → UI Pages**
2. Click **New**
3. Set **Name** to `split_app`
4. Set **Direct** to `true` (no processing)
5. Set **HTML** to the contents of `frontend/dist/index.html`
   - Update asset paths: replace `./assets/` with `split_app/assets/`
6. Upload the contents of `frontend/dist/` as related assets using the **Assets** related list
7. Access at: `https://dev123456.service-now.com/split_app.do`

**Option C: Serve via Service Portal**

1. Go to **Service Portal → Widgets**
2. Create a new widget and embed the Lit app as a single-page widget

### Step 6: Verify the deployment

1. Open your browser and navigate to the app
2. Go to **Groups** and create a new group
3. Add other users (you can find their sys_ids in **User Administration → Users**)
4. Add an expense with an equal split
5. Check the balances
6. Record a settlement
7. Verify the dashboard shows correct totals

### Step 7: Configure the frontend for production

For production use on your PDI, update `frontend/src/services/api.ts`:

```typescript
const BASE = "/api/x_split";
// No changes needed — the browser uses the ServiceNow session
// when served from the same origin as the instance
```

## Acceptance Criteria Walkthrough

### Scenario: Three users, $90 equal split, $30 settlement

1. Create a group called "Test Trip"
2. Add two other users (total three members including yourself)
3. Log an expense of $90 with split type "equal" (defaults to payer = you)
4. Open the balances: each user sees a balance of $30 owed to you
5. As one of the other users, record a settlement of $30 to you (the payer) with payment method "cash"
6. Refresh balances: the settling user's balance drops to $0, your balance reduces by $30

### Security verification

1. Have a user who is NOT a member of the group call:
   ```
   GET /api/x_split/groups/{groupId}/balances
   ```
   Response: `403 Forbidden`

### Scope isolation

All custom tables are scoped to `x_split` (no global table modifications). The `app.json` defines the scope `x_split`.

## Troubleshooting

| Issue | Solution |
|---|---|
| `403 Forbidden` on API calls | Ensure the user session is valid and the user is a member of the group |
| `Cannot find module @servicenow/sdk` | Run `npm install` from the root directory |
| Vite proxy not forwarding | Check `VITE_SN_INSTANCE` is set and the instance is accessible |
| Tables not appearing after deploy | Check the instance is running the expected app scope version under **System Applications → My Company Applications** |
| Settlement fails with "exceeds outstanding balance" | The settlement amount is larger than the net balance; check `GET /groups/{groupId}/balances` first |

## Data Model

```
x_split_group
├── name (string, mandatory)
├── description (string)
├── base_currency (choice: USD/EUR/INR/GBP, default: USD)
└── created_by (reference to sys_user, read-only)

x_split_membership (unique on group + user)
├── group (reference to x_split_group)
├── user (reference to sys_user)
└── role (choice: admin/member)

x_split_expense
├── group (reference to x_split_group)
├── description (string)
├── amount (decimal)
├── date (date)
├── category (choice: Food & Drink/Travel/Utilities/Entertainment/Other)
├── payer (reference to sys_user)
├── split_type (choice: equal/exact/percentage/shares)
├── notes (string, max 500)
└── receipt_image (string, max 500)

x_split_share
├── expense (reference to x_split_expense)
├── user (reference to sys_user)
├── amount (decimal)
├── percentage (decimal, nullable — for percentage splits)
├── shares (integer, nullable — for shares splits)
├── settled_amount (decimal, default: 0)
└── settled (boolean, computed)

x_split_settlement
├── group (reference to x_split_group)
├── from_user (reference to sys_user)
├── to_user (reference to sys_user)
├── amount (decimal)
├── date (date)
├── payment_method (string, max 100)
└── notes (string, max 500)
```
