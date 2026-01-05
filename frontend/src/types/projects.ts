export type ProjectStatus = "active" | "paused" | "completed";

export type Project = {
  id: number;
  name: string;
  status: ProjectStatus;
  owner_id: number;
  created_at: string;
  updated_at: string;
};

export type ProjectsListResponse = {
  items: Project[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};
