import { ReactiveController, ReactiveControllerHost } from "lit";
import { apiGet, apiPost } from "../services/api.js";

export interface Group {
  sys_id: string;
  name: string;
  description?: string;
  base_currency: string;
  role: "admin" | "member";
}

export interface Balance {
  from_user: string;
  to_user: string;
  amount: number;
}

export interface Expense {
  sys_id: string;
  description: string;
  amount: string;
  date: string;
  category: string;
  payer: { sys_id: string; name: string };
  split_type: string;
  notes: string;
}

export interface UserDashboard {
  total_owed: number;
  total_owing: number;
}

interface AppState {
  groups: Group[];
  currentGroupId: string | null;
  currentGroup?: Group & { members: any[] };
  balances: Balance[];
  expenses: Expense[];
  userDashboard: UserDashboard | null;
  currentView: "dashboard" | "groups" | "group-detail";
  loading: boolean;
}

export class StoreController implements ReactiveController {
  host: ReactiveControllerHost;
  state: AppState = {
    groups: [],
    currentGroupId: null,
    balances: [],
    expenses: [],
    userDashboard: null,
    currentView: "dashboard",
    loading: false,
  };

  constructor(host: ReactiveControllerHost) {
    this.host = host;
    host.addController(this);
  }

  hostConnected() {
    this.loadDashboard();
  }

  navigate(view: "dashboard" | "groups" | "group-detail", groupId?: string) {
    this.state.currentView = view;
    if (view === "group-detail" && groupId) {
      this.state.currentGroupId = groupId;
      this.loadGroupDetail(groupId);
    } else if (view === "groups") {
      this.loadGroups();
    } else if (view === "dashboard") {
      this.loadDashboard();
    }
    this.host.requestUpdate();
  }

  async loadDashboard() {
    try {
      this.state.userDashboard = await apiGet("/user/dashboard");
    } catch (e) {}
    this.host.requestUpdate();
  }

  async loadGroups() {
    try {
      this.state.groups = await apiGet("/groups");
    } catch (e) {}
    this.host.requestUpdate();
  }

  async loadGroupDetail(groupId: string) {
    try {
      const group = await apiGet(`/groups/${groupId}`);
      this.state.currentGroup = group;
      this.state.balances = await apiGet(`/groups/${groupId}/balances`);
      this.state.expenses = await apiGet(`/groups/${groupId}/expenses`);
    } catch (e) {}
    this.host.requestUpdate();
  }

  async createGroup(name: string) {
    await apiPost("/groups", { name });
    await this.loadGroups();
  }

  async addMember(userSysId: string, role: string = "member") {
    if (!this.state.currentGroupId) return;
    await apiPost(`/groups/${this.state.currentGroupId}/members`, {
      user_sys_id: userSysId,
      role,
    });
    await this.loadGroupDetail(this.state.currentGroupId);
  }

  async removeMember(userSysId: string) {
    if (!this.state.currentGroupId) return;
    await apiDelete(
      `/groups/${this.state.currentGroupId}/members/${userSysId}`,
    );
    await this.loadGroupDetail(this.state.currentGroupId);
  }

  async createExpense(data: any) {
    if (!this.state.currentGroupId) return;
    await apiPost(`/groups/${this.state.currentGroupId}/expenses`, data);
    await this.loadGroupDetail(this.state.currentGroupId);
  }

  async recordSettlement(data: any) {
    if (!this.state.currentGroupId) return;
    await apiPost(`/groups/${this.state.currentGroupId}/settlements`, data);
    await this.loadGroupDetail(this.state.currentGroupId);
  }
}

function apiDelete(path: string) {
  return apiPost(path, {}); // simplified – proper DELETE via SDK may need api.http
  // Note: The above apiDelete is a placeholder; I'll provide a correct api.http method in the API service.
}
