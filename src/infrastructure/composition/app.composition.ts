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
  GetCompletionEventsByDayHandler,
  GetCurrentStreakHandler,
  GetMostUsedLabelsHandler,
  GetProjectBasicInfoHandler,
  GetProjectDetailsHandler,
  GetProjectsHandler,
  GetProjectStatsHandler,
  GetRecentProjectsHandler,
  GetRecentTasksHandler,
  GetStreakHistoricalHandler,
  GetStreakSummaryHandler,
  GetTaskInfoHandler,
  GetTasksByProjectHandler,
  GetWeeklyCountHandler,
} from '../../application/queries';
import { appDatabase, database } from '../persistence/sqlite/database/app.database';
import {
  SQLiteCreateTaskRepository,
  SQLiteDashboardRepository,
  SQLiteGetProjectsRepository,
  SQLiteGetStreakRepository,
  SQLiteLabelRepository,
  SQLiteProjectInfoRepository,
  SQLiteProjectRepository,
  SQLiteTaskInfoRepository,
  SQLiteTaskRepository,
} from '../persistence/sqlite/repositories';
import { SQLiteTaskCompletionUnitOfWork } from '../persistence/sqlite/unit-of-work/task-completion.unit-of-work';
import { SystemClock } from '../time/system.clock';

// === Repositories ===
const projectRepository = new SQLiteProjectRepository(database);
const taskRepository = new SQLiteTaskRepository(database);
const labelRepository = new SQLiteLabelRepository(database);
const createTaskRepository = new SQLiteCreateTaskRepository(database);
const dashboardRepository = new SQLiteDashboardRepository(database);
const getProjectsRepository = new SQLiteGetProjectsRepository(database);
const getStreakRepository = new SQLiteGetStreakRepository(database);
const projectInfoRepository = new SQLiteProjectInfoRepository(database);
const taskInfoRepository = new SQLiteTaskInfoRepository(database);

// === Services ===
const clock = new SystemClock();
const taskCompletionUnitOfWork = new SQLiteTaskCompletionUnitOfWork(database);

// === Command handlers ===
export const commands = {
  createLabel: new CreateLabelHandler(labelRepository),
  deleteLabel: new DeleteLabelHandler(labelRepository, clock),
  createProject: new CreateProjectHandler(projectRepository, clock),
  startProject: new StartProjectHandler(projectRepository, clock),
  completeProject: new CompleteProjectHandler(projectRepository, clock),
  reopenProject: new ReopenProjectHandler(projectRepository),
  archiveProject: new ArchiveProjectHandler(projectRepository),
  deleteProject: new DeleteProjectHandler(projectRepository, clock),
  renameProject: new RenameProjectHandler(projectRepository),
  modifyProjectDescription: new ModifyProjectDescriptionHandler(projectRepository),
  modifyProjectCategory: new ModifyProjectCategoryHandler(projectRepository),
  modifyProjectIcon: new ModifyProjectIconHandler(projectRepository),
  modifyProjectColor: new ModifyProjectColorHandler(projectRepository),
  createTask: new CreateTaskHandler(taskRepository, projectRepository, labelRepository, clock),
  startTask: new StartTaskHandler(taskRepository, clock),
  completeTask: new CompleteTaskHandler(taskCompletionUnitOfWork, clock),
  reopenTask: new ReopenTaskHandler(taskRepository),
  archiveTask: new ArchiveTaskHandler(taskRepository),
  deleteTask: new DeleteTaskHandler(taskRepository, clock),
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
  getCurrentStreak: new GetCurrentStreakHandler(getStreakRepository, clock),
  getStreakSummary: new GetStreakSummaryHandler(getStreakRepository),
  getStreakHistorical: new GetStreakHistoricalHandler(getStreakRepository),
  getCompletionEventsByDay: new GetCompletionEventsByDayHandler(getStreakRepository),
} as const;

export const appComposition = {
  initialize: (): Promise<void> => appDatabase.initialize(),
  commands,
  queries,
} as const;
