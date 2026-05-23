import { ReactiveController, ReactiveControllerHost } from "lit";
import { apiGet, apiPost, apiPut, apiDelete, discoverApiBase } from "../services/api.js";

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
  receipt_image?: string;
}

export interface UserDashboard {
  total_owed: number;
  total_owing: number;
  current_user?: string;
}

interface AppState {
  groups: Group[];
  currentGroupId: string | null;
  currentGroup?: Group & { members: any[] };
  balances: Balance[];
  expenses: Expense[];
  userDashboard: UserDashboard | null;
  currentUser: string | null;
  currentView: "dashboard" | "groups" | "group-detail";
  loading: boolean;
}

let _instance: StoreController | null = null;

export class StoreController implements ReactiveController {
  private _hosts = new Set<ReactiveControllerHost>();
  private _booted = false;
  state: AppState = {
    groups: [],
    currentGroupId: null,
    balances: [],
    expenses: [],
    userDashboard: null,
    currentUser: null,
    currentView: "dashboard",
    loading: false,
  };

  constructor(host: ReactiveControllerHost) {
    if (_instance) {
      _instance._hosts.add(host);
      host.addController(_instance);
      return _instance as any;
    }
    this._hosts = new Set([host]);
    host.addController(this);
    _instance = this;
  }

  hostConnected() {
    if (this._booted) return;
    this._booted = true;
    discoverApiBase().then(() => this.loadDashboard());
  }

  private _notify() {
    for (const h of this._hosts) h.requestUpdate();
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
    this._notify();
  }

  async loadDashboard() {
    try {
      const r = await apiGet("/user/dashboard");
      const dash = r.result || r;
      this.state.userDashboard = dash;
      if (dash.current_user) {
        this.state.currentUser = dash.current_user;
      }
    } catch (e) {}
    this._notify();
  }

  async loadGroups() {
    try {
      const r = await apiGet("/groups");
      this.state.groups = Array.isArray(r) ? r : r.result || [];
    } catch (e) {
      this.state.groups = [];
    }
    this._notify();
  }

  async loadGroupDetail(groupId: string) {
    try {
      const r = await apiGet(`/groups/${groupId}`);
      this.state.currentGroup = r.result || r;
      const b = await apiGet(`/groups/${groupId}/balances`);
      this.state.balances = Array.isArray(b) ? b : b.result || [];
      const ex = await apiGet(`/groups/${groupId}/expenses`);
      this.state.expenses = Array.isArray(ex) ? ex : ex.result || [];
    } catch (e) {}
    this._notify();
  }

  async createGroup(name: string, description?: string, baseCurrency?: string) {
    const r = await apiPost("/groups", {
      name,
      description: description || "",
      base_currency: baseCurrency || "USD",
    });
    await this.loadGroups();
    return r;
  }

  async deleteGroup(groupId: string) {
    await apiDelete(`/groups/${groupId}`);
    this.state.currentView = "groups";
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

  async addMemberByName(userName: string, role: string = "member") {
    if (!this.state.currentGroupId) return;
    await apiPost(`/groups/${this.state.currentGroupId}/members`, {
      user_name: userName,
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

  async updateExpense(expenseId: string, data: any) {
    if (!this.state.currentGroupId) return;
    await apiPut(
      `/groups/${this.state.currentGroupId}/expenses/${expenseId}`,
      data,
    );
    await this.loadGroupDetail(this.state.currentGroupId);
  }

  async deleteExpense(expenseId: string) {
    if (!this.state.currentGroupId) return;
    await apiDelete(
      `/groups/${this.state.currentGroupId}/expenses/${expenseId}`,
    );
    await this.loadGroupDetail(this.state.currentGroupId);
  }

  async recordSettlement(data: any) {
    if (!this.state.currentGroupId) return;
    await apiPost(`/groups/${this.state.currentGroupId}/settlements`, data);
    await this.loadGroupDetail(this.state.currentGroupId);
  }
}
