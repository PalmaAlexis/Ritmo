import type { GetRecentProjectsResponse } from '@/application/queries/dashboard/get-recent-projects/response';
import type { GetDashboardSummaryModel } from '@/application/queries/dashboard/get-summary/model';
import type { GetCurrentStreakModel } from '@/application/queries/streak/get-current/model';
import { ProjectColorValues } from '@/shared/project-ui/color';
import { ProjectIconValues } from '@/shared/project-ui/icon';
import { ProjectStatusValues } from '@/shared/project/status';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';
import { Button, XStack, YStack, useTheme } from 'tamagui';
import {
  BodyText,
  DashboardCard,
  HeadingText,
  ProgressBar,
} from '@/presentation/components/dashboard-primitives';

type DashboardProject = GetRecentProjectsResponse['projects'][number];

export function WeeklyHero({
  completedTasks,
  activeDays,
  pendingTasks,
}: {
  completedTasks: number;
  activeDays: number;
  pendingTasks: number;
}) {
  const percentage = Math.round((activeDays / 7) * 100);

  return (
    <YStack
      marginBottom={11}
      borderRadius={25}
      shadowColor='rgba(86,72,207,0.29)'
      shadowOffset={{ width: 0, height: 19 }}
      shadowOpacity={1}
      shadowRadius={22}
      elevation={6}
    >
      <LinearGradient
        colors={['#22203a', '#584cca', '#7465ed']}
        locations={[0, 0.61, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <YStack
          pointerEvents='none'
          position='absolute'
          width={180}
          height={180}
          borderRadius={90}
          right={-72}
          top={-86}
          backgroundColor='rgba(255,255,255,0.1)'
        />
        <YStack
          pointerEvents='none'
          position='absolute'
          width={110}
          height={110}
          borderRadius={55}
          right={28}
          bottom={-74}
          backgroundColor='rgba(91,215,255,0.13)'
        />
        <XStack justifyContent='space-between' gap={12}>
          <YStack flex={1}>
            <HeadingText color='$white' fontSize={17} lineHeight={24}>
              Tu semana en Ritmo
            </HeadingText>
            <BodyText color='rgba(255,255,255,0.67)' fontSize={10} lineHeight={14} marginTop={4}>
              {activeDays} de 7 días con actividad
            </BodyText>
          </YStack>
          <YStack
            alignSelf='flex-start'
            paddingVertical={5}
            paddingHorizontal={8}
            borderRadius={999}
            backgroundColor='rgba(255,255,255,0.12)'
          >
            <BodyText color='$white' fontSize={8.5} lineHeight={12} fontWeight='800'>
              {percentage}%
            </BodyText>
          </YStack>
        </XStack>
        <XStack
          alignItems='baseline'
          gap={5}
          marginTop={17}
          flexWrap='wrap'
          accessibilityLabel={`${completedTasks} tareas completadas esta semana; ${pendingTasks} tareas pendientes`}
        >
          <HeadingText color='$white' fontSize={32} lineHeight={44} letterSpacing={-1.5}>
            {completedTasks}
          </HeadingText>
          <BodyText color='rgba(255,255,255,0.67)' fontSize={11} fontWeight='600'>
            tareas completadas
          </BodyText>
        </XStack>
        <YStack marginTop={9}>
          <ProgressBar hero value={percentage} label='Días activos esta semana' />
        </YStack>
      </LinearGradient>
    </YStack>
  );
}

function focusCopy(current: GetCurrentStreakModel) {
  if (current.completedToday) return 'Hoy completado. Tu racha está segura.';
  if (current.isAtRisk) return 'Tu racha está en riesgo. Completa una tarea hoy.';
  return 'Completa una tarea para sumar un día a tu racha.';
}

export function FocusCard({
  current,
  onStreak,
}: {
  current: GetCurrentStreakModel;
  onStreak: () => void;
}) {
  return (
    <DashboardCard flexDirection='row' alignItems='center' gap={12}>
      <YStack
        accessibilityRole='progressbar'
        accessibilityLabel='Objetivo diario de la racha'
        accessibilityValue={{ min: 0, max: 1, now: current.completedToday ? 1 : 0 }}
        width={55}
        height={55}
        borderRadius={18}
        padding={6}
        flexShrink={0}
        backgroundColor={current.completedToday ? '$green' : '$surface3'}
      >
        <YStack
          flex={1}
          borderRadius={13}
          backgroundColor='$surface'
          alignItems='center'
          justifyContent='center'
        >
          <HeadingText fontSize={12} lineHeight={17}>
            {current.completedToday ? '1/1' : '0/1'}
          </HeadingText>
        </YStack>
      </YStack>
      <YStack flex={1}>
        <BodyText fontSize={12} lineHeight={16} fontWeight='700'>
          Enfoque de hoy
        </BodyText>
        <BodyText
          color={current.isAtRisk && !current.completedToday ? '$amber' : '$muted'}
          fontSize={9.5}
          lineHeight={13}
          marginTop={4}
        >
          {focusCopy(current)}
        </BodyText>
      </YStack>
      <Button
        unstyled
        accessibilityRole='button'
        accessibilityLabel={`Ver racha: ${current.consecutiveDays} días`}
        onPress={onStreak}
        hitSlop={12}
        paddingVertical={6}
        paddingHorizontal={8}
        borderRadius={999}
        backgroundColor='$amberSoft'
        pressStyle={{ opacity: 0.65 }}
      >
        <BodyText color='$amber' fontSize={9} lineHeight={13} fontWeight='800'>
          🔥 {current.consecutiveDays} {current.consecutiveDays === 1 ? 'día' : 'días'}
        </BodyText>
      </Button>
    </DashboardCard>
  );
}

export function SummaryMetrics({ summary }: { summary: GetDashboardSummaryModel }) {
  const metrics = [
    {
      icon: '✓',
      value: summary.activeTasks,
      label: 'Tareas pendientes',
      detail: `${summary.completedTasks} completadas`,
    },
    {
      icon: '◎',
      value: summary.activeProjects,
      label: 'Proyectos activos',
      detail: `${summary.completedProjects} completados`,
    },
  ];

  return (
    <XStack gap={10}>
      {metrics.map((metric) => (
        <DashboardCard
          key={metric.label}
          flex={1}
          minWidth={0}
          borderRadius={18}
          padding={13}
          marginBottom={0}
        >
          <YStack
            width={29}
            height={29}
            borderRadius={9}
            alignItems='center'
            justifyContent='center'
            backgroundColor='$primarySoft'
            marginBottom={9}
          >
            <BodyText accessible={false} color='$primary' fontSize={13}>
              {metric.icon}
            </BodyText>
          </YStack>
          <HeadingText fontSize={22} lineHeight={30}>
            {metric.value}
          </HeadingText>
          <BodyText color='$muted' fontSize={9.5} lineHeight={13} marginTop={2}>
            {metric.label}
          </BodyText>
          <BodyText color='$green' fontSize={9} lineHeight={12} fontWeight='800' marginTop={6}>
            {metric.detail}
          </BodyText>
        </DashboardCard>
      ))}
    </XStack>
  );
}

const projectIcons = {
  [ProjectIconValues.work]: '▱',
  [ProjectIconValues.health]: '♡',
  [ProjectIconValues.exercise]: '↯',
  [ProjectIconValues.home]: '⌂',
  [ProjectIconValues.technology]: '◎',
  [ProjectIconValues.money]: '$',
  [ProjectIconValues.family]: '♧',
};

export function ProjectCard({
  project,
  onPress,
}: {
  project: DashboardProject;
  onPress: () => void;
}) {
  const theme = useTheme();
  const colors = {
    [ProjectColorValues.green]: [theme.green.val, theme.cyan.val],
    [ProjectColorValues.red]: [theme.red.val, theme.pink.val],
    [ProjectColorValues.blue]: [theme.primary.val, theme.cyan.val],
    [ProjectColorValues.pink]: [theme.pink.val, theme.primary.val],
    [ProjectColorValues.orange]: [theme.amber.val, theme.red.val],
  } satisfies Record<ProjectColorValues, [string, string]>;
  const active = project.status === ProjectStatusValues.inProgress;
  const done = project.status === ProjectStatusValues.done;
  const statusLabel = done ? 'Completado' : active ? 'Activo' : 'Nuevo';

  return (
    <DashboardCard
      accessible
      accessibilityRole='button'
      accessibilityLabel={`Ver proyecto: ${project.title}`}
      onPress={onPress}
      pressStyle={{ opacity: 0.75 }}
    >
      <XStack alignItems='center' gap={10}>
        <LinearGradient
          colors={colors[project.color]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.projectIcon}
        >
          <BodyText accessible={false} color='$white' fontSize={17} lineHeight={23}>
            {projectIcons[project.icon]}
          </BodyText>
        </LinearGradient>
        <YStack flex={1} minWidth={0}>
          <BodyText fontSize={12} lineHeight={16} fontWeight='800' numberOfLines={2}>
            {project.title}
          </BodyText>
          <BodyText color='$muted' fontSize={9} lineHeight={12} marginTop={4}>
            {project.category || 'Sin categoría'}
          </BodyText>
        </YStack>
        <YStack
          paddingVertical={5}
          paddingHorizontal={8}
          borderRadius={999}
          backgroundColor={active || done ? '$greenSoft' : '$primarySoft'}
        >
          <BodyText
            fontSize={8.5}
            lineHeight={12}
            fontWeight='800'
            color={active || done ? '$green' : '$primary'}
          >
            {statusLabel}
          </BodyText>
        </YStack>
      </XStack>
      <YStack marginTop={12}>
        <ProgressBar
          value={project.completedTasksPercentage}
          label={`Progreso de ${project.title}`}
        />
      </YStack>
      <XStack justifyContent='space-between' marginTop={8}>
        <BodyText color='$muted' fontSize={9} lineHeight={12}>
          {project.allTasksCount} {project.allTasksCount === 1 ? 'tarea' : 'tareas'}
        </BodyText>
        <BodyText color='$muted' fontSize={9} lineHeight={12}>
          {project.completedTasksPercentage}%
        </BodyText>
      </XStack>
    </DashboardCard>
  );
}

const styles = StyleSheet.create({
  hero: { borderRadius: 25, padding: 19, overflow: 'hidden' },
  projectIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
