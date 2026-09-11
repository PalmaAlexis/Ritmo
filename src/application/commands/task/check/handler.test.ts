import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { CompletionEventId } from '@/domain/aggregates/completion-event/id.vo';
import { ProjectId } from '@/domain/aggregates/project/id.vo';
import { TaskId } from '@/domain/aggregates/task/id.vo';
import { TaskPriority } from '@/domain/aggregates/task/priority.vo';
import { TaskStatus } from '@/domain/aggregates/task/status.vo';
import { Task } from '@/domain/aggregates/task/task.aggregate';
import { TaskTitle } from '@/domain/aggregates/task/title.vo';
import type { CompletionEventRepository } from '@/domain/repositories/completion-event.repository';
import type { TaskRepository } from '@/domain/repositories/task.repository';
import { TaskStatusValues } from '@/shared/task/status';
import type { TaskCompletionUnitOfWork } from '../../../ports/task-completion-unit-of-work';
import { CheckTaskHandler } from './handler';

const completedAt = new Date(2026, 8, 7, 14, 30);
const startedAt = new Date(2026, 8, 6, 10);

function makeTask(status: TaskStatusValues): Task {
  return Task.rehydrate(
    TaskId.from('task-1'),
    ProjectId.from('project-1'),
    TaskTitle.from('Implementar navegación'),
    TaskStatus.from(status),
    TaskPriority.High(),
    new Date(2026, 8, 5),
    status === TaskStatusValues.toDo ? null : startedAt,
    status === TaskStatusValues.done ? completedAt : null,
    null,
    [],
    null
  );
}

function setup(task: Task | null) {
  jest
    .spyOn(CompletionEventId, 'new')
    .mockReturnValue(CompletionEventId.from('completion-event-1'));

  const taskRepository = {
    findById: jest.fn<TaskRepository['findById']>().mockResolvedValue(task),
    save: jest.fn<TaskRepository['save']>().mockResolvedValue(undefined),
    existsByProjectAndTitle: jest
      .fn<TaskRepository['existsByProjectAndTitle']>()
      .mockResolvedValue(false),
    countTasksByProject: jest.fn<TaskRepository['countTasksByProject']>().mockResolvedValue(1),
  };
  const completionEventRepository = {
    append: jest.fn<CompletionEventRepository['append']>().mockResolvedValue(undefined),
  };
  const unitOfWork = {
    execute: jest
      .fn<TaskCompletionUnitOfWork['execute']>()
      .mockImplementation((operation) => operation({ taskRepository, completionEventRepository })),
  };

  return {
    handler: new CheckTaskHandler(unitOfWork, { now: () => completedAt }),
    taskRepository,
    completionEventRepository,
    unitOfWork,
  };
}

afterEach(() => {
  jest.restoreAllMocks();
});

describe('CheckTaskHandler', () => {
  it('starts and completes a to-do task in one unit of work and records its local completion day', async () => {
    const task = makeTask(TaskStatusValues.toDo);
    const { handler, taskRepository, completionEventRepository, unitOfWork } = setup(task);

    await handler.execute({ id: 'task-1' });

    expect(task.toPrimitives()).toMatchObject({
      status: TaskStatusValues.done,
      startedAt: completedAt,
      finishedAt: completedAt,
    });
    expect(taskRepository.save).toHaveBeenCalledWith(task);
    expect(completionEventRepository.append).toHaveBeenCalledTimes(1);
    expect(completionEventRepository.append.mock.calls[0][0].toPrimitives()).toMatchObject({
      taskId: 'task-1',
      completedAt,
      streakDay: '2026-09-07',
    });
    expect(unitOfWork.execute).toHaveBeenCalledTimes(1);
  });

  it('preserves the original start date when completing an in-progress task', async () => {
    const task = makeTask(TaskStatusValues.inProgress);
    const { handler } = setup(task);

    await handler.execute({ id: 'task-1' });

    expect(task.toPrimitives()).toMatchObject({
      status: TaskStatusValues.done,
      startedAt,
      finishedAt: completedAt,
    });
  });

  it.each([TaskStatusValues.done, TaskStatusValues.archived, TaskStatusValues.deleted])(
    'rejects %s tasks without saving a new completion event',
    async (status) => {
      const { handler, taskRepository, completionEventRepository } = setup(makeTask(status));

      await expect(handler.execute({ id: 'task-1' })).rejects.toThrow();

      expect(taskRepository.save).not.toHaveBeenCalled();
      expect(completionEventRepository.append).not.toHaveBeenCalled();
    }
  );

  it('rejects a missing task without writing', async () => {
    const { handler, taskRepository, completionEventRepository } = setup(null);

    await expect(handler.execute({ id: 'task-1' })).rejects.toThrow('Task does not exist');

    expect(taskRepository.save).not.toHaveBeenCalled();
    expect(completionEventRepository.append).not.toHaveBeenCalled();
  });

  it('propagates event persistence failure to the enclosing transaction', async () => {
    const { handler, completionEventRepository } = setup(makeTask(TaskStatusValues.toDo));
    completionEventRepository.append.mockRejectedValueOnce(new Error('Storage unavailable'));

    await expect(handler.execute({ id: 'task-1' })).rejects.toThrow('Storage unavailable');
  });

  it('does not append an event when saving the completed task fails', async () => {
    const { handler, taskRepository, completionEventRepository } = setup(
      makeTask(TaskStatusValues.toDo)
    );
    taskRepository.save.mockRejectedValueOnce(new Error('Storage unavailable'));

    await expect(handler.execute({ id: 'task-1' })).rejects.toThrow('Storage unavailable');

    expect(completionEventRepository.append).not.toHaveBeenCalled();
  });
});
