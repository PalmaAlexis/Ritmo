import { Stack } from 'expo-router';
import { useTheme } from 'tamagui';

export function AppNavigator() {
  const theme = useTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: 'fullScreenModal',
        animation: 'slide_from_bottom',
        contentStyle: { backgroundColor: theme.shell.val },
      }}
    >
      <Stack.Screen name='index' options={{ presentation: 'card' }} />
    </Stack>
  );
}
