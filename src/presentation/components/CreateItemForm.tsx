import type { CreateProjectCommand } from '@/application/commands/project/create/command';
import type { CreateTaskCommand } from '@/application/commands/task/create/command';
import { useApplication } from '@/presentation/providers/application-provider';
import { ProjectColorValues } from '@/shared/project-ui/color';
import { ProjectIconValues } from '@/shared/project-ui/icon';
import { ProjectStatusValues } from '@/shared/project/status';
import { TaskPriorityValues } from '@/shared/task/priority';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { Button, Input, XStack, YStack } from 'tamagui';
import { dashboardKeys, projectKeys } from '@/presentation/hooks/query-keys';
import { useProjects } from '@/presentation/hooks/use-projects';
import type { ScreenDestination } from '@/presentation/navigation/use-screen-navigation';
import { DashboardState } from '@/presentation/components/DashboardState';
import { BodyText, HeadingText } from '@/presentation/components/dashboard-primitives';

type CreateSubmission =
  | { kind: 'project'; command: CreateProjectCommand }
  | { kind: 'task'; command: CreateTaskCommand };

export function CreateItemForm({
  kind,
  onNavigate,
  onSaved,
  initialProjectId,
}: {
  kind: 'create-task' | 'create-project';
  onNavigate: (panel: ScreenDestination) => void;
  onSaved: () => void;
  initialProjectId?: string;
}) {
  const { commands, queries } = useApplication();
  const client = useQueryClient();
  const isProject = kind === 'create-project';
  const projects = useProjects(!isProject);
  // A project opened by URL may be outside the first page of the picker.
  const initialProject = useQuery({
    queryKey: projectKeys.info(initialProjectId ?? ''),
    queryFn: () => queries.getProjectBasicInfo.execute({ id: initialProjectId! }),
    enabled: !isProject && !!initialProjectId,
  });
  const inFlight = useRef(false);
  const focused = useRef(false);
  useFocusEffect(
    useCallback(() => {
      focused.current = true;
      return () => {
        focused.current = false;
      };
    }, [])
  );
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Personal');
  const [selectedProject, setSelectedProject] = useState(initialProjectId);
  const [priority, setPriority] = useState(TaskPriorityValues.high);
  const [color, setColor] = useState(ProjectColorValues.blue);
  const [icon, setIcon] = useState(ProjectIconValues.technology);
  const listedProjects = projects.data?.pages.flatMap((page) => page.projects) ?? [];
  const candidates =
    initialProject.data && !listedProjects.some((project) => project.id === initialProject.data.id)
      ? [initialProject.data, ...listedProjects]
      : listedProjects;
  const availableProjects = candidates.filter(
    (project) =>
      project.status === ProjectStatusValues.toDo ||
      project.status === ProjectStatusValues.inProgress
  );
  const projectId = selectedProject
    ? availableProjects.find((project) => project.id === selectedProject)?.id
    : availableProjects[0]?.id;
  const loadingProjects = projects.isPending || initialProject.isLoading;
  const projectsError = projects.isError || initialProject.isError;
  const save = useMutation({
    mutationFn: (submission: CreateSubmission) =>
      submission.kind === 'project'
        ? commands.createProject.execute(submission.command)
        : commands.createTask.execute(submission.command),
    onSuccess: async (_, submission) => {
      await Promise.all([
        client.invalidateQueries({ queryKey: dashboardKeys.summary }),
        client.invalidateQueries({ queryKey: ['dashboard', 'projects'] }),
        client.invalidateQueries({ queryKey: projectKeys.list }),
        ...(submission.kind === 'task'
          ? [
              client.invalidateQueries({ queryKey: ['dashboard', 'tasks'] }),
              client.invalidateQueries({
                queryKey: projectKeys.tasks(submission.command.projectId),
              }),
            ]
          : []),
      ]);
      if (focused.current) onSaved();
    },
    onSettled: () => {
      inFlight.current = false;
    },
  });
  const submit = () => {
    if (inFlight.current || !title.trim() || (!isProject && !projectId)) return;
    inFlight.current = true;
    if (isProject) {
      save.mutate({
        kind: 'project',
        command: {
          title: title.trim(),
          description: description.trim(),
          category: category.trim(),
          icon,
          color,
        },
      });
    } else if (projectId) {
      save.mutate({
        kind: 'task',
        command: {
          projectId,
          title: title.trim(),
          description: description.trim(),
          priority,
          labelsIds: [],
        },
      });
    }
  };
  const disabled = save.isPending;
  return (
    <YStack gap={16}>
      <BodyText color='$muted'>
        {isProject
          ? 'Define el resultado; después organiza el trabajo.'
          : 'Haz que la siguiente acción sea clara y ejecutable.'}
      </BodyText>
      <YStack gap={7}>
        <HeadingText fontSize={12}>Título</HeadingText>
        <Input
          accessibilityLabel='Título'
          placeholder={isProject ? 'Ej. Portfolio v2' : '¿Qué hay que hacer?'}
          value={title}
          onChangeText={setTitle}
          disabled={disabled}
          maxLength={24}
          backgroundColor='$surface'
          color='$text'
          borderColor='$line'
        />
      </YStack>
      {isProject ? (
        <>
          <YStack gap={7}>
            <HeadingText fontSize={12}>Categoría</HeadingText>
            <Input
              accessibilityLabel='Categoría'
              maxLength={10}
              value={category}
              onChangeText={setCategory}
              disabled={disabled}
              backgroundColor='$surface'
              color='$text'
              borderColor='$line'
            />
          </YStack>
          <HeadingText fontSize={12}>Ícono</HeadingText>
          <XStack gap={8} flexWrap='wrap'>
            {(
              [
                [ProjectIconValues.technology, '◎', 'Tecnología'],
                [ProjectIconValues.work, '▱', 'Trabajo'],
                [ProjectIconValues.home, '⌂', 'Hogar'],
                [ProjectIconValues.exercise, '↯', 'Ejercicio'],
              ] as const
            ).map(([value, glyph, label]) => (
              <Button
                key={value}
                accessibilityLabel={label}
                accessibilityState={{ selected: icon === value }}
                onPress={() => setIcon(value)}
                disabled={disabled}
                backgroundColor={icon === value ? '$primarySoft' : '$surface'}
                color='$primary'
                minHeight={44}
              >
                {glyph}
              </Button>
            ))}
          </XStack>
          <HeadingText fontSize={12}>Color</HeadingText>
          <XStack gap={8} flexWrap='wrap'>
            {(
              [
                [ProjectColorValues.blue, '$primary', 'Violeta'],
                [ProjectColorValues.green, '$green', 'Verde'],
                [ProjectColorValues.orange, '$amber', 'Naranja'],
                [ProjectColorValues.red, '$red', 'Rojo'],
                [ProjectColorValues.pink, '$pink', 'Rosa'],
              ] as const
            ).map(([value, token, label]) => (
              <Button
                key={value}
                accessibilityLabel={label}
                accessibilityState={{ selected: color === value }}
                onPress={() => setColor(value)}
                disabled={disabled}
                width={44}
                height={44}
                backgroundColor={token}
                color='$white'
              >
                {color === value ? '✓' : ''}
              </Button>
            ))}
          </XStack>
        </>
      ) : (
        <>
          <HeadingText fontSize={12}>Proyecto</HeadingText>
          {loadingProjects && <DashboardState loading title='Cargando proyectos' />}
          {projectsError && (
            <DashboardState
              error
              title='No pudimos cargar los proyectos'
              action='Reintentar'
              onAction={() => {
                void projects.refetch();
                if (initialProjectId) void initialProject.refetch();
              }}
            />
          )}
          {!loadingProjects && !projectsError && !availableProjects.length && (
            <DashboardState
              title='Primero crea un proyecto'
              message='Las tareas siempre viven dentro de un proyecto.'
              action='Crear proyecto'
              onAction={() => onNavigate({ kind: 'create-project' })}
            />
          )}
          <YStack gap={6}>
            {availableProjects.map((project) => (
              <Button
                key={project.id}
                role='radio'
                accessibilityRole='radio'
                accessibilityState={{ checked: projectId === project.id }}
                onPress={() => setSelectedProject(project.id)}
                disabled={disabled}
                backgroundColor={projectId === project.id ? '$primarySoft' : '$surface'}
                color='$text'
                minHeight={44}
              >
                {project.title}
              </Button>
            ))}
          </YStack>
          {projects.hasNextPage && (
            <Button
              disabled={projects.isFetchingNextPage || disabled}
              onPress={() => void projects.fetchNextPage()}
            >
              Más proyectos
            </Button>
          )}
          <HeadingText fontSize={12}>Prioridad</HeadingText>
          <XStack gap={8} flexWrap='wrap'>
            {(
              [
                [TaskPriorityValues.high, 'Alta'],
                [TaskPriorityValues.medium, 'Media'],
                [TaskPriorityValues.low, 'Baja'],
              ] as const
            ).map(([value, label]) => (
              <Button
                key={value}
                role='radio'
                accessibilityRole='radio'
                accessibilityState={{ checked: priority === value }}
                onPress={() => setPriority(value)}
                disabled={disabled}
                backgroundColor={priority === value ? '$primarySoft' : '$surface'}
                color='$primary'
                minHeight={44}
              >
                {label}
              </Button>
            ))}
          </XStack>
        </>
      )}
      <YStack gap={7}>
        <HeadingText fontSize={12}>
          {isProject ? 'Objetivo' : 'Descripción / criterio de listo'}
        </HeadingText>
        <Input
          accessibilityLabel='Descripción'
          maxLength={100}
          placeholder='Contexto, aceptación, notas…'
          value={description}
          onChangeText={setDescription}
          disabled={disabled}
          multiline
          minHeight={100}
          textAlignVertical='top'
          backgroundColor='$surface'
          color='$text'
          borderColor='$line'
        />
      </YStack>
      {save.isError && (
        <DashboardState
          error
          title={isProject ? 'No pudimos crear el proyecto' : 'No pudimos crear la tarea'}
          message={save.error.message}
        />
      )}
      <Button
        accessibilityLabel={isProject ? 'Guardar proyecto' : 'Guardar tarea'}
        disabled={disabled || !title.trim() || (isProject ? !category.trim() : !projectId)}
        accessibilityState={{ busy: save.isPending }}
        minHeight={48}
        backgroundColor='$primary'
        color='$white'
        onPress={submit}
      >
        {save.isPending ? 'Guardando…' : isProject ? 'Crear proyecto' : 'Crear tarea'}
      </Button>
    </YStack>
  );
}
