import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/stores/store';

type ProvidersProps = {
  children: ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  return (
    <ActionSheetProvider>
      <Provider store={store}>{children}</Provider>
    </ActionSheetProvider>
  );
}
