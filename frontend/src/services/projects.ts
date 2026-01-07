import { api } from "./api";
import type { ProjectsListResponse, Project, ProjectStatus } from "../types/projects";

export async function listProjects(params: {
  page: number;
  pageSize: number;
  status?: ProjectStatus | "";
}): Promise<ProjectsListResponse> {
  const q = new URLSearchParams();
  q.set("page", String(params.page));
  q.set("pageSize", String(params.pageSize));
  if (params.status) q.set("status", params.status);

  return api.get<ProjectsListResponse>(`/projects?${q.toString()}`);
}

export async function createProject(params: {
  name: string;
  status: ProjectStatus;
}): Promise<{ project: Project }> {
  return api.post<{ project: Project }>(`/projects`, { name: params.name, status: params.status });
}

export async function getProject(id: number): Promise<{ project: Project }> {
  return api.get<{ project: Project }>(`/projects/${id}`);
}

export async function updateProject(params: {
  id: number;
  name?: string;
  status?: ProjectStatus;
}): Promise<{ project: Project }> {
  const body: Record<string, unknown> = {};
  if (params.name !== undefined) body.name = params.name;
  if (params.status !== undefined) body.status = params.status;

  return api.put<{ project: Project }>(`/projects/${params.id}`, body);
}

export async function deleteProject(id: number): Promise<void> {
  await api.del<void>(`/projects/${id}`);
}