import { ServiceNowClient } from "@servicenow/sdk";

const client = new ServiceNowClient({
  instance: "your-instance.service-now.com",
  auth: {
    username: "your-username",
    password: "your-password",
  },
});

const BASE = "/api/x_split";

export async function apiGet(path: string): Promise<any> {
  const res = await client.api.get(`${BASE}${path}`, {
    headers: { Accept: "application/json" },
  });
  return res.data;
}

export async function apiPost(path: string, data: any): Promise<any> {
  const res = await client.api.post(`${BASE}${path}`, data, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
}

export async function apiDelete(path: string): Promise<any> {
  const res = await client.api.delete(`${BASE}${path}`);
  return res.data;
}
