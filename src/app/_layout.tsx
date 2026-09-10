import { AppNavigator } from '@/presentation/navigation/app-navigator';
import { appComposition } from '@/infrastructure/composition/app.composition';
import { AppProviders } from '@/presentation/providers/app-providers';

export default function RootLayout() {
  return (
    <AppProviders services={appComposition} initialize={appComposition.initialize}>
      <AppNavigator />
    </AppProviders>
  );
}
