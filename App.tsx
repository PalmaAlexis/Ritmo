import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { appComposition } from './src/infrastructure/composition/app.composition';

export default function App() {
  const [databaseError, setDatabaseError] = useState<Error | null>(null);
  const [databaseReady, setDatabaseReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    appComposition
      .initialize()
      .then(() => {
        if (mounted) setDatabaseReady(true);
      })
      .catch((error: unknown) => {
        if (!mounted) return;
        setDatabaseError(
          error instanceof Error ? error : new Error('Database initialization failed')
        );
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (databaseError) {
    return (
      <View style={styles.container}>
        <Text>Could not initialize the database: {databaseError.message}</Text>
        <StatusBar style='auto' />
      </View>
    );
  }

  if (!databaseReady) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar style='auto' />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style='auto' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
