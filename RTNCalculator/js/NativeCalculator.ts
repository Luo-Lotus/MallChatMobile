import type { TurboModule } from 'react-native/Libraries/TurboModule/RCTExport';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  add(a: number, b: number): Promise<number>;
  myEquals(a: string, b: string): boolean;
}

export default TurboModuleRegistry.get<Spec>('RTNCalculator') as Spec | null;
