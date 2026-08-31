import {
  ArchiveProjectHandler,
  ArchiveTaskHandler,
  CompleteProjectHandler,
  CompleteTaskHandler,
  CreateLabelHandler,
  CreateProjectHandler,
  CreateTaskHandler,
  DeleteLabelHandler,
  DeleteProjectHandler,
  DeleteTaskHandler,
  ModifyProjectCategoryHandler,
  ModifyProjectColorHandler,
  ModifyProjectDescriptionHandler,
  ModifyProjectIconHandler,
  RenameProjectHandler,
  RenameTaskHandler,
  ReopenProjectHandler,
  ReopenTaskHandler,
  StartProjectHandler,
  StartTaskHandler,
} from '../../application/commands';
import {
  GetDashboardSummaryHandler,
  GetMostUsedLabelsHandler,
  GetProjectBasicInfoHandler,
  GetProjectDetailsHandler,
  GetProjectsHandler,
  GetProjectStatsHandler,
  GetRecentProjectsHandler,
  GetRecentTasksHandler,
  GetTaskInfoHandler,
  GetTasksByProjectHandler,
  GetWeeklyCountHandler,
} from '../../application/queries';
import { appDatabase, database } from '../persistence/sqlite/database/app.database';
import {
  SQLiteCreateTaskRepository,
  SQLiteDashboardRepository,
  SQLiteGetProjectsRepository,
  SQLiteLabelRepository,
  SQLiteProjectInfoRepository,
  SQLiteProjectRepository,
  SQLiteTaskInfoRepository,
  SQLiteTaskRepository,
} from '../persistence/sqlite/repositories';

// === Repositories ===
const projectRepository = new SQLiteProjectRepository(database);
const taskRepository = new SQLiteTaskRepository(database);
const labelRepository = new SQLiteLabelRepository(database);
const createTaskRepository = new SQLiteCreateTaskRepository(database);
const dashboardRepository = new SQLiteDashboardRepository(database);
const getProjectsRepository = new SQLiteGetProjectsRepository(database);
const projectInfoRepository = new SQLiteProjectInfoRepository(database);
const taskInfoRepository = new SQLiteTaskInfoRepository(database);

// === Command handlers ===
export const commands = {
  createLabel: new CreateLabelHandler(labelRepository),
  deleteLabel: new DeleteLabelHandler(labelRepository),
  createProject: new CreateProjectHandler(projectRepository),
  startProject: new StartProjectHandler(projectRepository),
  completeProject: new CompleteProjectHandler(projectRepository),
  reopenProject: new ReopenProjectHandler(projectRepository),
  archiveProject: new ArchiveProjectHandler(projectRepository),
  deleteProject: new DeleteProjectHandler(projectRepository),
  renameProject: new RenameProjectHandler(projectRepository),
  modifyProjectDescription: new ModifyProjectDescriptionHandler(projectRepository),
  modifyProjectCategory: new ModifyProjectCategoryHandler(projectRepository),
  modifyProjectIcon: new ModifyProjectIconHandler(projectRepository),
  modifyProjectColor: new ModifyProjectColorHandler(projectRepository),
  createTask: new CreateTaskHandler(taskRepository, projectRepository, labelRepository),
  startTask: new StartTaskHandler(taskRepository),
  completeTask: new CompleteTaskHandler(taskRepository),
  reopenTask: new ReopenTaskHandler(taskRepository),
  archiveTask: new ArchiveTaskHandler(taskRepository),
  deleteTask: new DeleteTaskHandler(taskRepository),
  renameTask: new RenameTaskHandler(taskRepository),
} as const;

// === Query handlers ===
export const queries = {
  getMostUsedLabels: new GetMostUsedLabelsHandler(createTaskRepository),
  getDashboardSummary: new GetDashboardSummaryHandler(dashboardRepository),
  getWeeklyCount: new GetWeeklyCountHandler(dashboardRepository),
  getRecentProjects: new GetRecentProjectsHandler(dashboardRepository),
  getRecentTasks: new GetRecentTasksHandler(dashboardRepository),
  getProjects: new GetProjectsHandler(getProjectsRepository),
  getProjectBasicInfo: new GetProjectBasicInfoHandler(projectInfoRepository),
  getProjectStats: new GetProjectStatsHandler(projectInfoRepository),
  getTasksByProject: new GetTasksByProjectHandler(projectInfoRepository),
  getProjectDetails: new GetProjectDetailsHandler(projectInfoRepository),
  getTaskInfo: new GetTaskInfoHandler(taskInfoRepository),
} as const;

export const appComposition = {
  initialize: (): Promise<void> => appDatabase.initialize(),
  commands,
  queries,
} as const;
