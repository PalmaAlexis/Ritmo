import { randomUUID } from 'expo-crypto';
import { Platform } from 'react-native';

/** Supplies the standard UUID API used by domain identifiers on native runtimes. */
export function initializeCrypto(): void {
  if (Platform.OS === 'web' || typeof globalThis.crypto?.randomUUID === 'function') return;

  const runtimeCrypto = globalThis.crypto ?? {};
  Object.defineProperty(runtimeCrypto, 'randomUUID', {
    configurable: true,
    writable: true,
    value: randomUUID,
  });

  if (!globalThis.crypto) {
    Object.defineProperty(globalThis, 'crypto', {
      configurable: true,
      writable: true,
      value: runtimeCrypto,
    });
  }
}
