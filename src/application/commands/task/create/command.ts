export interface CreateTaskCommand {
  projectId: string;
  title: string;
  priority: string;
  labelsIds: string[];
  description: string;
}
