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
| **Deployment (Background Script)** | `setup-bg-script.js` (GlideRecord) + `deploy.js` (Node.js) |
| **Deployment (SDK)** | `@servicenow/sdk` v4.6.1 — fluent TypeScript (`sn-sdk/`) → `now-sdk build && now-sdk install` |

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
├── setup-bg-script.js            # One-time bootstrap (run in ServiceNow Background Scripts)
├── deploy.js                     # Deploy/update script includes and API
├── sn/                           # ServiceNow backend artifacts (JSON)
│   ├── app.json
│   ├── sys_db_object/           # Custom table definitions
│   ├── sys_script_include/      # Business logic
│   ├── sys_ws_definition/       # REST API definition
│   └── sys_ws_operation/        # Per-endpoint scripts
├── sn-sdk/                       # @servicenow/sdk fluent project (alternative deployment)
│   ├── now.config.json
│   ├── package.json
│   ├── src/
│   │   ├── fluent/
│   │   │   ├── index.now.ts     # Entry point
│   │   │   ├── tables/          # Fluent table definitions
│   │   │   ├── script-includes/ # Fluent ScriptInclude wrappers
│   │   │   └── rest-apis/       # Fluent REST API definition
│   │   └── server/
│   │       └── script-includes/ # Server-side JS (copied from sn/)
│   └── tsconfig.json
└── package.json                 # Monorepo scripts
```

### REST API Endpoints

All under the discovered `base_uri` (e.g., `/api/2053373/x_split/`):

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

# Set your ServiceNow instance URL and instance ID (used by Vite proxy in dev mode)
# The instance ID is the numeric prefix in the API path — find it by querying:
#   GET /api/now/table/sys_ws_definition?sysparm_query=name=split_api&sysparm_fields=base_uri
export VITE_SN_INSTANCE=https://your-instance.service-now.com
export VITE_SN_INSTANCE_ID=123456  # from base_uri, e.g. /api/123456/x_split
```

### Start the dev server

```bash
npm run dev
```

This starts the Vite dev server (default: `http://localhost:5173`). API requests to `/api/x_split/*` are proxied to the ServiceNow instance and rewritten to use the instance-specific path (`/api/{VITE_SN_INSTANCE_ID}/x_split/*`). The browser authenticates using your ServiceNow session.

### Testing with curl examples

You can test the REST API directly against your ServiceNow instance. The API path includes the instance ID — find it by checking the `base_uri` of the `split_api` web service definition:

```bash
# First, discover the correct API base path
API_BASE=$(curl -s --user admin:yourpass \
  "https://your-instance.service-now.com/api/now/table/sys_ws_definition?sysparm_query=name=split_api&sysparm_fields=base_uri" \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['result'][0]['base_uri'])")
echo "API base: $API_BASE"

# Now test with the discovered path
SN=https://your-instance.service-now.com
AUTH="--user admin:yourpassword"

# 1. Create a group
GROUP=$(curl -s $AUTH -X POST "$SN$API_BASE/groups" \
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
curl -s $AUTH -X POST "$SN$API_BASE/groups/$GROUP_ID/members" \
  -H "Content-Type: application/json" \
  -d '{"user_sys_id":"user1_sys_id"}'
curl -s $AUTH -X POST "$SN$API_BASE/groups/$GROUP_ID/members" \
  -H "Content-Type: application/json" \
  -d '{"user_sys_id":"user2_sys_id"}'

# 4. Add an equal-split expense of $90
EXPENSE=$(curl -s $AUTH -X POST "$SN$API_BASE/groups/$GROUP_ID/expenses" \
  -H "Content-Type: application/json" \
  -d '{"description":"Dinner","amount":90.00,"date":"2025-06-01","category":"Food & Drink","split_type":"equal"}')
echo "$EXPENSE"

# 5. View balances
curl -s $AUTH "$SN$API_BASE/groups/$GROUP_ID/balances"
# → All three users see a balance of $30 each

# 6. Record a settlement (user B → payer A, $30)
curl -s $AUTH -X POST "$SN$API_BASE/groups/$GROUP_ID/settlements" \
  -H "Content-Type: application/json" \
  -d '{"to_user":"payer_sys_id","amount":30.00,"date":"2025-06-02","payment_method":"cash"}'

# 7. Verify updated balances
curl -s $AUTH "$SN$API_BASE/groups/$GROUP_ID/balances"
# → User B's balance drops to $0, payer's balance reduces by $30

# 8. Security check: non-member gets 403
curl -s $AUTH "$SN$API_BASE/groups/$GROUP_ID/balances"
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

### Deployment Method 1 : Deploy using the ServiceNow Background Scripts UI 

Deployment is a two-step process:

1. **One-time bootstrap** — run `setup-bg-script.js` in the ServiceNow Background Scripts UI to create tables, fields, choices, API definition, and all REST operations via server-side `GlideRecord` (bypasses PDI business rules that block REST API creation of `sys_db_object` and `sys_ws_operation`).
2. **Deploy updates** — run `deploy.js` to update script includes and patch operation scripts with the latest code (idempotent, safe to re-run).

#### Step 1: Install Node dependencies

```bash
npm install
cd frontend && npm install && cd ..
```

#### Step 2: One-time bootstrap (Background Script)

PDIs restrict REST API operations on `sys_db_object`, `sys_dictionary`, and some `sys_ws_operation` records. The bootstrap runs as a server-side script via ServiceNow's Background Scripts UI, using `GlideRecord` directly to bypass these restrictions.

1. Open your instance: `https://dev123456.service-now.com`
2. Navigate to **System Definition → Scripts – Background** (or visit `/sys.scripts_background.do`)
3. Open `setup-bg-script.js` from the project root (this often proves to be too big for the GUI so you may use `setup-bg-script.min.js`)
4. Copy the entire file contents
5. Paste into the Script field
6. Click **Run script**
7. Check the **System Log** (`/syslog.do`) for output lines prefixed with `=== Split App Bootstrap ===`

The bootstrap creates:
- Application (`x_split` scope)
- 5 custom tables: `x_split_group`, `x_split_membership`, `x_split_expense`, `x_split_share`, `x_split_settlement`
- All dictionary fields and choice records
- Web service definition (`split_api`)
- All 13 REST API operations

#### Step 3: Deploy script includes and API updates

After the bootstrap completes, run `deploy.js` to upload the latest business logic and operation scripts:

```bash
node deploy.js https://dev123456.service-now.com admin your-password
```

Or via npm:

```bash
npm run deploy -- https://dev123456.service-now.com admin your-password
```

What gets updated:
- **Script includes**: `SplitUtils`, `BalanceCalculator`, `ExpenseManager`, `SettlementProcessor`, `SetupApp`
- **Web service definition**: `split_api` (path, active flag)
- **REST operations**: Scripts for all 13 endpoints

This step is **idempotent** — re-running it patches existing records without duplication.

#### Step 4: Verify the REST API

`deploy.js` automatically discovers the `base_uri` from the web service definition. It prints the API base path at the end. Use it to test:

```bash
curl -s --user admin:your-password \
  "https://dev123456.service-now.com/api/{instance_id}/x_split/user/dashboard"
```

Or discover it dynamically:

```bash
API_BASE=$(curl -s --user admin:your-password \
  "https://dev123456.service-now.com/api/now/table/sys_ws_definition?sysparm_query=name=split_api&sysparm_fields=base_uri" \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['result'][0]['base_uri'])")

curl -s --user admin:your-password \
  "https://dev123456.service-now.com$API_BASE/user/dashboard"
```

Expected response (with your session user):

```json
{"user_id":"...","groups":[],"totals":{"you_are_owed":"0.00","you_owe":"0.00"}}
```

#### Step 5: Deploy the frontend

**Option A: Serve from Vite dev server (development)**

```bash
cd frontend
VITE_SN_INSTANCE=https://dev123456.service-now.com npm run dev
```

Open `http://localhost:5173` in your browser. Log in to your PDI in another tab first so the session cookie is available.

**Option B: Deploy as a UI Page (single-file build)**

The Vite build is configured with `vite-plugin-singlefile` to produce a single self-contained `index.html` with all CSS and JS inlined. A wrapper script then packages it in a Jelly CDATA block so ServiceNow's UI Page editor accepts it.

```bash
# Build the single-file HTML and wrap in Jelly/CDATA
cd frontend && npm run build:ui-page
```

The output is `frontend/dist/ui-page.xml`. Create a **UI Page** on your instance:

1. Navigate to **System UI → UI Pages**
2. Click **New**
3. Set **Name** to `split_app`
4. Check **Direct** (to bypass Jelly processing)
5. Set **Role** to `user` (accessible to all authenticated users)
6. Set **HTML** to the full contents of `frontend/dist/ui-page.xml`
7. Click **Submit**
8. Access at: `https://dev123456.service-now.com/split_app.do`

**Option C: Serve via Service Portal**

1. Go to **Service Portal → Widgets**
2. Create a new widget and embed the Lit app as a single-page widget

#### Step 6: Verify the full app

1. Open the app (dev server, UI Page, or Service Portal)
2. Create a group
3. Add other users (find their sys_ids in **User Administration → Users**)
4. Add an expense with an equal split
5. Check the balances
6. Record a settlement
7. Verify the dashboard shows correct totals

#### Re-deploying after code changes

When you modify script includes or operation scripts, just run step 3 again:

```bash
npm run deploy -- https://dev123456.service-now.com admin your-password
```

The bootstrap (step 2) only needs to be run once per instance.

### Deployment method 2 : Deploy using @servicenow/sdk (now-sdk)

Instead of the Background Script + `deploy.js` workflow above, you can deploy the entire app using the ServiceNow SDK v4.6.1. The SDK compiles fluent TypeScript definitions (`.now.ts` files) into an installable package and deploys it via the Instance API — bypassing the REST API restrictions that caused earlier 403s.

**Prerequisites:** Same as above (Node.js >= 20, admin creds, PDI accessible).

#### Step 1: Set up the SDK project

The `sn-sdk/` directory contains all the fluent definitions. Install dependencies:

```bash
cd sn-sdk && npm install
```

#### Step 2: Authenticate to your instance

```bash
# Add credentials (stored in .now-sdk/, gitignored)
npx now-sdk auth --add https://dev123456.service-now.com --type basic
```

Alternatively, set environment variables (for CI/CD):

```bash
export SN_SDK_INSTANCE_URL=https://dev123456.service-now.com
export SN_SDK_USER=admin
export SN_SDK_USER_PWD='your-password-with-percent%sign'
```

#### Step 3: Configure scope ID

The `now.config.json` uses a placeholder `scopeId` (32-char hex). On first install, the SDK creates a new scope on the instance and auto-generates the sys_id. After the first successful install, update `scopeId` in `now.config.json` with the sys_id from `sys_scope` on your instance.

#### Step 4: Build and install

```bash
npm run deploy
```

Or step by step:

```bash
npx now-sdk build     # Compile fluent .now.ts → dist/app/ (XML metadata)
npx now-sdk install   # Push built package to the instance
```

#### What gets created

The SDK build generates XML update-set records under `sn-sdk/dist/app/`:

- **`sys_app`** — The scoped application
- **`sys_db_object`** — 5 custom tables
- **`sys_dictionary`** — All fields
- **`sys_choice`** — Choice records for dropdowns
- **`sys_script_include`** — Business logic (SplitUtils, BalanceCalculator, ExpenseManager, SettlementProcessor)
- **`sys_ws_definition`** — `split_api` REST API
- **`sys_ws_operation`** — All 13 REST endpoints

#### Step 5: Deploy the frontend (same as Method 1)

After the backend is installed, deploy the Lit frontend as a UI Page. This step is identical for both deployment methods.

**Option A: Serve from Vite dev server (development)**

```bash
cd frontend
VITE_SN_INSTANCE=https://dev123456.service-now.com npm run dev
```

Open `http://localhost:5173` in your browser. Log in to your PDI in another tab first so the session cookie is available.

**Option B: Deploy as a UI Page (single-file build)**

The Vite build uses `vite-plugin-singlefile` to produce a single self-contained `index.html` with all CSS and JS inlined. A wrapper script packages it in a Jelly CDATA block for ServiceNow's UI Page editor.

```bash
cd frontend && npm run build:ui-page
```

The output is `frontend/dist/ui-page.xml`. Create a **UI Page** on your instance:

1. Navigate to **System UI → UI Pages**
2. Click **New**
3. Set **Name** to `split_app`
4. Check **Direct** (to bypass Jelly processing)
5. Set **Role** to `user` (accessible to all authenticated users)
6. Set **HTML** to the full contents of `frontend/dist/ui-page.xml`
7. Click **Submit**
8. Access at: `https://dev123456.service-now.com/split_app.do`

#### Step 6: Verify the full app

1. Open the app (dev server or UI Page at `/split_app.do`)
2. Create a group
3. Add other users (find their sys_ids in **User Administration → Users**)
4. Add an expense with an equal split
5. Check the balances
6. Record a settlement
7. Verify the dashboard shows correct totals

#### Re-deploying after code changes

Modify the fluent `.now.ts` files or the server-side `.server.js` files, then re-run:

```bash
cd sn-sdk && npx now-sdk build && npx now-sdk install
```

#### Known SDK limitations

- The `scopeId` in `now.config.json` must match the instance's scope sys_id after first install
- Table definitions use `referenceTable: "table_name" as const` for type safety — the `as const` assertion is required
- Each REST API route requires a unique `$id` key defined in `src/keys.now.ts`
- Script includes reference external `.server.js` files via `Now.include()`

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
| Vite proxy not forwarding | Check `VITE_SN_INSTANCE` and `VITE_SN_INSTANCE_ID` are set and the instance is accessible |
| Tables not appearing after bootstrap | Check the System Log (`/syslog.do`) for bootstrap errors. Re-run the Background Script if needed |
| `deploy.js` fails with 403 on operations | The bootstrap (step 2) must be run first. Re-run it, then re-run deploy.js |
| API returns `Requested URI does not represent any resource` | The bootstrap hasn't created the REST API yet, or the app scope wasn't created. Re-run the Background Script |
| REST API field `script` set but not applied | The REST API field name for `sys_ws_operation.script` is **`operation_script`**, not `script`. `deploy.js` now uses the correct field name |
| `sys_scope` pointing to wrong record | On metadata tables (`sys_db_object`, `sys_dictionary`, etc.), `sys_scope` must reference the **`sys_scope`** record, not the `sys_app` record. The background script now resolves `SCOPE_SYS_ID` correctly |
| Settlement fails with "exceeds outstanding balance" | The settlement amount is larger than the net balance; check `GET /groups/{groupId}/balances` first |
| `sys_app` API returns empty results | Some PDIs block `sys_app` table reads via REST API. The background script avoids this by using server-side `GlideRecord` |

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
