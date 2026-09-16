import { useApplication } from '@/presentation/providers/application-provider';
import { TaskStatusValues } from '@/shared/task/status';
import { useQuery } from '@tanstack/react-query';
import { YStack } from 'tamagui';
import { projectKeys } from '@/presentation/hooks/query-keys';
import { useTaskToggle } from '@/presentation/hooks/use-task-toggle';
import { TaskRows } from '@/presentation/components/TaskRows';
import type { ScreenDestination } from '@/presentation/navigation/use-screen-navigation';
import { DashboardState } from '@/presentation/components/DashboardState';
import {
  BodyText,
  DashboardCard,
  HeadingText,
  SectionHeading,
} from '@/presentation/components/dashboard-primitives';

export function ProjectDetails({
  id,
  onNavigate,
}: {
  id: string;
  onNavigate: (panel: ScreenDestination) => void;
}) {
  const { queries } = useApplication();
  const info = useQuery({
    queryKey: projectKeys.info(id),
    queryFn: () => queries.getProjectBasicInfo.execute({ id }),
  });
  const details = useQuery({
    queryKey: projectKeys.details(id),
    queryFn: () => queries.getProjectDetails.execute({ id }),
  });
  const tasks = useQuery({
    queryKey: projectKeys.tasks(id),
    queryFn: () => queries.getTasksByProject.execute({ projectId: id }),
  });
  const toggle = useTaskToggle();
  if (info.isError || details.isError || tasks.isError)
    return (
      <DashboardState
        error
        title='No pudimos cargar el proyecto'
        action='Reintentar'
        onAction={() => {
          void info.refetch();
          void details.refetch();
          void tasks.refetch();
        }}
      />
    );
  if (!info.data || !details.data || !tasks.data)
    return <DashboardState loading title='Cargando proyecto' />;
  const rows = tasks.data.tasks
    .filter(
      (task) =>
        task.status === TaskStatusValues.toDo ||
        task.status === TaskStatusValues.inProgress ||
        task.status === TaskStatusValues.done
    )
    .map((task) => ({ ...task, projectTitle: info.data.title, startedAt: null, finishedAt: null }));
  return (
    <YStack>
      <DashboardCard gap={10}>
        <HeadingText fontSize={22} lineHeight={28}>
          {info.data.title}
        </HeadingText>
        <BodyText color='$muted'>{info.data.category}</BodyText>
        <BodyText>{details.data.description || 'Sin descripción.'}</BodyText>
      </DashboardCard>
      <SectionHeading title='Tareas del proyecto' />
      {toggle.isError && (
        <DashboardState
          error
          title='No pudimos actualizar la tarea'
          action='Reintentar'
          onAction={() => toggle.variables && toggle.toggle(toggle.variables)}
        />
      )}
      {rows.length ? (
        <TaskRows
          tasks={rows}
          pendingTaskId={toggle.pendingTaskId}
          onToggle={toggle.toggle}
          onOpenTask={(task) => onNavigate({ kind: 'task', id: task.id, projectId: id })}
        />
      ) : (
        <DashboardState
          title='Este proyecto aún no tiene tareas'
          action='Nueva tarea'
          onAction={() => onNavigate({ kind: 'create-task', projectId: id })}
        />
      )}
    </YStack>
  );
}
