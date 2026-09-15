import { BlurTargetView, BlurView } from 'expo-blur';
import { useRef } from 'react';
import type { View } from 'react-native';
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, YStack, useTheme, useThemeName } from 'tamagui';
import { TaskRows } from '@/presentation/components/TaskRows';
import {
  FocusCard,
  ProjectCard,
  SummaryMetrics,
  WeeklyHero,
} from '@/presentation/screens/dashboard/components/DashboardCards';
import {
  BottomNav,
  DashboardHeader,
} from '@/presentation/screens/dashboard/components/DashboardNavigation';
import { useScreenNavigation } from '@/presentation/navigation/use-screen-navigation';
import { useIsFocused } from 'expo-router';
import { DashboardState } from '@/presentation/components/DashboardState';
import { BodyText, SectionHeading } from '@/presentation/components/dashboard-primitives';
import { useDashboard } from '@/presentation/screens/dashboard/hooks/use-dashboard';
import { useDashboardDate } from '@/presentation/hooks/use-dashboard-date';
import { useTaskToggle } from '@/presentation/hooks/use-task-toggle';

export default function DashboardScreen() {
  const date = useDashboardDate();
  const dashboard = useDashboard(date);
  const mutation = useTaskToggle();
  const theme = useTheme();
  const themeName = useThemeName();
  const blurTarget = useRef<View | null>(null);
  const insets = useSafeAreaInsets();
  const { open, close } = useScreenNavigation();
  const isFocused = useIsFocused();
  const loaded =
    dashboard.summary.data &&
    dashboard.weekly.data &&
    dashboard.tasks.data &&
    dashboard.projects.data &&
    dashboard.current.data &&
    dashboard.history.data;
  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.screen, { backgroundColor: theme.shell.val }]}
    >
      <YStack flex={1} width='100%' maxWidth={600} alignSelf='center'>
        <DashboardHeader
          date={date}
          onSearch={() => open({ kind: 'search' })}
          onProfile={() => open({ kind: 'profile' })}
        />
        <BlurTargetView ref={blurTarget} style={styles.screen}>
          <ScrollView
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 96 + insets.bottom }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={dashboard.refreshing}
                onRefresh={() => void dashboard.refresh()}
                tintColor={theme.primary.val}
                colors={[theme.primary.val]}
              />
            }
            accessibilityElementsHidden={!isFocused}
            importantForAccessibility={!isFocused ? 'no-hide-descendants' : 'auto'}
          >
            {dashboard.hasError && (
              <DashboardState
                error
                title={
                  loaded ? 'No pudimos actualizar tu dashboard' : 'No pudimos cargar tu dashboard'
                }
                message='Vuelve a intentarlo para consultar tus datos.'
                action='Reintentar'
                onAction={() => void dashboard.refresh()}
              />
            )}
            {!loaded && !dashboard.hasError && (
              <DashboardState
                loading
                title='Cargando tu dashboard'
                message='Preparando tu actividad y tus siguientes pasos.'
              />
            )}
            {loaded && (
              <>
                <WeeklyHero
                  completedTasks={dashboard.completedThisWeek}
                  activeDays={dashboard.activeDaysThisWeek}
                  pendingTasks={dashboard.summary.data!.activeTasks}
                />
                <FocusCard
                  current={dashboard.current.data!}
                  onStreak={() => open({ kind: 'streak' })}
                />
                <SummaryMetrics summary={dashboard.summary.data!} />
                <SectionHeading
                  title='Siguiente acción'
                  action='Ver día →'
                  onAction={() => open({ kind: 'today' })}
                />
                {mutation.isError && (
                  <DashboardState
                    error
                    title='No pudimos actualizar la tarea'
                    message='Tu cambio no se guardó. Inténtalo de nuevo.'
                    action='Reintentar'
                    onAction={() => mutation.variables && mutation.toggle(mutation.variables)}
                  />
                )}
                {dashboard.tasks.data!.tasks.length ? (
                  <TaskRows
                    tasks={dashboard.tasks.data!.tasks}
                    pendingTaskId={mutation.pendingTaskId}
                    onToggle={mutation.toggle}
                    onOpenTask={(task) =>
                      open({ kind: 'task', id: task.id, projectId: task.projectId })
                    }
                  />
                ) : (
                  <DashboardState
                    title='No hay tareas pendientes'
                    message='Crea una tarea en un proyecto para dar el siguiente paso.'
                    action='Nueva tarea'
                    onAction={() => open({ kind: 'create-task' })}
                  />
                )}
                <SectionHeading
                  title='Proyectos activos'
                  action='Ver todos →'
                  onAction={() => open({ kind: 'projects' })}
                />
                {dashboard.projects.data!.projects.length ? (
                  dashboard.projects.data!.projects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onPress={() => open({ kind: 'project', id: project.id })}
                    />
                  ))
                ) : (
                  <DashboardState
                    title={
                      dashboard.summary.data!.completedProjects
                        ? 'No hay proyectos activos'
                        : 'Crea tu primer proyecto'
                    }
                    message='Un lugar para organizar lo que quieres terminar.'
                    action='Crear proyecto'
                    onAction={() => open({ kind: 'create-project' })}
                  />
                )}
                <Button
                  unstyled
                  accessibilityRole='button'
                  accessibilityLabel='Actualizar dashboard'
                  disabled={dashboard.refreshing}
                  minHeight={44}
                  alignSelf='center'
                  onPress={() => void dashboard.refresh()}
                  pressStyle={{ opacity: 0.6 }}
                >
                  <BodyText color='$muted' fontSize={10}>
                    {dashboard.refreshing ? 'Actualizando…' : 'Actualizar'}
                  </BodyText>
                </Button>
              </>
            )}
          </ScrollView>
        </BlurTargetView>
        <YStack position='absolute' bottom={0} left={0} right={0}>
          <BlurView
            pointerEvents='none'
            blurTarget={blurTarget}
            blurMethod='dimezisBlurViewSdk31Plus'
            intensity={44}
            tint={themeName === 'dark' ? 'dark' : 'light'}
            style={StyleSheet.absoluteFill}
          />
          <BottomNav
            bottomInset={insets.bottom}
            selected='home'
            onSelect={(tab) => (tab === 'home' ? close() : open({ kind: tab }))}
            onCreate={() => open({ kind: 'create-task' })}
          />
        </YStack>
      </YStack>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ screen: { flex: 1 } });
