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
