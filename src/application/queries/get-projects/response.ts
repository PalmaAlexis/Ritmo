interface Project {
  id: string;
  title: string;
  category: string;
  status: string;
  icon: string;
  color: string;
  allTasksCount: number;
  completedTasksCount: number;
  completedTasksPercentage: number;
}

export interface GetProjectsResponse {
  projects: Project[];
}
