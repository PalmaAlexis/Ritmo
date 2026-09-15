import { ActivityIndicator } from 'react-native';
import { Button, YStack, useTheme } from 'tamagui';
import {
  BodyText,
  DashboardCard,
  HeadingText,
} from '@/presentation/components/dashboard-primitives';

export function DashboardState({
  title,
  message,
  loading = false,
  error = false,
  action,
  onAction,
}: {
  title: string;
  message?: string;
  loading?: boolean;
  error?: boolean;
  action?: string;
  onAction?: () => void;
}) {
  const theme = useTheme();
  return (
    <DashboardCard>
      <YStack alignItems='center' gap={10} paddingVertical={16}>
        {loading && <ActivityIndicator accessibilityLabel={title} color={theme.primary.val} />}
        <HeadingText
          accessible
          accessibilityRole={error ? 'alert' : 'header'}
          role={error ? 'alert' : 'heading'}
          accessibilityLiveRegion={error ? 'polite' : undefined}
          fontSize={15}
          textAlign='center'
        >
          {title}
        </HeadingText>
        {message && (
          <BodyText fontSize={11} color='$muted' textAlign='center'>
            {message}
          </BodyText>
        )}
        {action && onAction && (
          <Button minHeight={44} backgroundColor='$primarySoft' color='$primary' onPress={onAction}>
            {action}
          </Button>
        )}
      </YStack>
    </DashboardCard>
  );
}
