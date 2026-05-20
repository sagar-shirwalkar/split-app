import { apiGet, apiPost, apiPut, apiDelete } from "../services/api.js";
export class StoreController {
    constructor(host) {
        this.state = {
            groups: [],
            currentGroupId: null,
            balances: [],
            expenses: [],
            userDashboard: null,
            currentUser: null,
            currentView: "dashboard",
            loading: false,
        };
        this.host = host;
        host.addController(this);
    }
    hostConnected() {
        this.loadDashboard();
    }
    navigate(view, groupId) {
        this.state.currentView = view;
        if (view === "group-detail" && groupId) {
            this.state.currentGroupId = groupId;
            this.loadGroupDetail(groupId);
        }
        else if (view === "groups") {
            this.loadGroups();
        }
        else if (view === "dashboard") {
            this.loadDashboard();
        }
        this.host.requestUpdate();
    }
    async loadDashboard() {
        try {
            const dash = await apiGet("/user/dashboard");
            this.state.userDashboard = dash;
            if (dash.current_user) {
                this.state.currentUser = dash.current_user;
            }
        }
        catch (e) { }
        this.host.requestUpdate();
    }
    async loadGroups() {
        try {
            this.state.groups = await apiGet("/groups");
        }
        catch (e) { }
        this.host.requestUpdate();
    }
    async loadGroupDetail(groupId) {
        try {
            const group = await apiGet(`/groups/${groupId}`);
            this.state.currentGroup = group;
            this.state.balances = await apiGet(`/groups/${groupId}/balances`);
            this.state.expenses = await apiGet(`/groups/${groupId}/expenses`);
        }
        catch (e) { }
        this.host.requestUpdate();
    }
    async createGroup(name) {
        await apiPost("/groups", { name });
        await this.loadGroups();
    }
    async addMember(userSysId, role = "member") {
        if (!this.state.currentGroupId)
            return;
        await apiPost(`/groups/${this.state.currentGroupId}/members`, {
            user_sys_id: userSysId,
            role,
        });
        await this.loadGroupDetail(this.state.currentGroupId);
    }
    async removeMember(userSysId) {
        if (!this.state.currentGroupId)
            return;
        await apiDelete(`/groups/${this.state.currentGroupId}/members/${userSysId}`);
        await this.loadGroupDetail(this.state.currentGroupId);
    }
    async createExpense(data) {
        if (!this.state.currentGroupId)
            return;
        await apiPost(`/groups/${this.state.currentGroupId}/expenses`, data);
        await this.loadGroupDetail(this.state.currentGroupId);
    }
    async updateExpense(expenseId, data) {
        if (!this.state.currentGroupId)
            return;
        await apiPut(`/groups/${this.state.currentGroupId}/expenses/${expenseId}`, data);
        await this.loadGroupDetail(this.state.currentGroupId);
    }
    async deleteExpense(expenseId) {
        if (!this.state.currentGroupId)
            return;
        await apiDelete(`/groups/${this.state.currentGroupId}/expenses/${expenseId}`);
        await this.loadGroupDetail(this.state.currentGroupId);
    }
    async recordSettlement(data) {
        if (!this.state.currentGroupId)
            return;
        await apiPost(`/groups/${this.state.currentGroupId}/settlements`, data);
        await this.loadGroupDetail(this.state.currentGroupId);
    }
}
