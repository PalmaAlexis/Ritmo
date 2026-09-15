import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';
import { Button, XStack, YStack, useTheme } from 'tamagui';
import { BodyText, HeadingText } from '@/presentation/components/dashboard-primitives';

export function DashboardHeader({
  date,
  onSearch,
  onProfile,
}: {
  date: Date;
  onSearch: () => void;
  onProfile: () => void;
}) {
  const theme = useTheme();
  const formattedDate = new Intl.DateTimeFormat('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date);
  const hour = date.getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches';

  return (
    <XStack
      alignItems='center'
      justifyContent='space-between'
      gap={12}
      paddingTop={10}
      paddingHorizontal={20}
      paddingBottom={14}
    >
      <YStack flex={1}>
        <BodyText color='$muted' fontSize={11} lineHeight={15} fontWeight='700' marginBottom={4}>
          {formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)}
        </BodyText>
        <HeadingText accessibilityRole='header' fontSize={27} lineHeight={29} letterSpacing={-0.8}>
          {greeting}
        </HeadingText>
      </YStack>
      <XStack gap={8} alignItems='center'>
        <Button
          unstyled
          accessibilityRole='button'
          accessibilityLabel='Buscar tareas y proyectos'
          onPress={onSearch}
          hitSlop={2}
          width={40}
          height={40}
          borderRadius={13}
          borderWidth={1}
          borderColor='$line'
          backgroundColor='$surface'
          alignItems='center'
          justifyContent='center'
          pressStyle={{ opacity: 0.6 }}
        >
          <BodyText fontSize={20} lineHeight={25}>
            ⌕
          </BodyText>
        </Button>
        <Button
          unstyled
          accessibilityRole='button'
          accessibilityLabel='Abrir perfil'
          onPress={onProfile}
          hitSlop={2}
          pressStyle={{ opacity: 0.6 }}
        >
          <LinearGradient
            colors={[theme.primary.val, theme.pink.val]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatar}
          >
            <BodyText color='$white' fontSize={13} fontWeight='800'>
              R
            </BodyText>
          </LinearGradient>
        </Button>
      </XStack>
    </XStack>
  );
}

export type DashboardTab = 'home' | 'projects' | 'today' | 'insights';

const tabs = [
  { key: 'home', label: 'Inicio', icon: '⌂' },
  { key: 'projects', label: 'Proyectos', icon: '▱' },
  { key: 'today', label: 'Hoy', icon: '◷' },
  { key: 'insights', label: 'Insights', icon: '◫' },
] as const;

export function BottomNav({
  selected,
  onSelect,
  onCreate,
  bottomInset = 0,
}: {
  selected: DashboardTab;
  onSelect: (tab: DashboardTab) => void;
  onCreate: () => void;
  bottomInset?: number;
}) {
  const theme = useTheme();

  const renderTab = (tab: (typeof tabs)[number]) => (
    <Button
      key={tab.key}
      unstyled
      role='tab'
      accessibilityRole='tab'
      accessibilityLabel={tab.label}
      accessibilityState={{ selected: selected === tab.key }}
      onPress={() => onSelect(tab.key)}
      flex={1}
      minWidth={0}
      minHeight={44}
      alignItems='center'
      justifyContent='flex-end'
      gap={3}
      pressStyle={{ opacity: 0.6 }}
    >
      <BodyText
        accessible={false}
        color={selected === tab.key ? '$primary' : '$muted2'}
        fontSize={17}
        lineHeight={20}
      >
        {tab.icon}
      </BodyText>
      <BodyText
        color={selected === tab.key ? '$primary' : '$muted2'}
        fontSize={8.5}
        lineHeight={12}
        fontWeight='700'
      >
        {tab.label}
      </BodyText>
    </Button>
  );

  return (
    <XStack
      accessibilityRole='tablist'
      position='relative'
      zIndex={1}
      minHeight={64 + Math.max(16, bottomInset)}
      paddingTop={9}
      paddingHorizontal={11}
      paddingBottom={Math.max(16, bottomInset)}
      backgroundColor='$tab'
      borderTopWidth={1}
      borderColor='$line'
      alignItems='flex-end'
    >
      {tabs.slice(0, 2).map(renderTab)}
      <YStack flex={1} alignItems='center'>
        <Button
          unstyled
          accessibilityRole='button'
          accessibilityLabel='Crear tarea'
          onPress={onCreate}
          marginBottom={8}
          borderRadius={16}
          pressStyle={{ opacity: 0.75 }}
          shadowColor='rgba(117,103,248,0.38)'
          shadowOffset={{ width: 0, height: 12 }}
          shadowRadius={14}
          shadowOpacity={1}
          elevation={5}
        >
          <LinearGradient
            colors={[theme.primary.val, '#5949cc']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.fab}
          >
            <BodyText color='$white' fontSize={27} lineHeight={34}>
              ＋
            </BodyText>
          </LinearGradient>
        </Button>
      </YStack>
      {tabs.slice(2).map(renderTab)}
    </XStack>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: { width: 50, height: 50, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
});
