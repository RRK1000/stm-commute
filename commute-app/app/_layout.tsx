import { ThemeProvider, DarkTheme } from '@react-navigation/native';
import { Slot } from 'expo-router';
// import { NativeWindStyleSheet } from 'nativewind';

// NativeWindStyleSheet.setOutput({
//   default: 'native',
// });

export default function Layout() {
  return (
    <ThemeProvider value={DarkTheme}>
      <Slot />
    </ThemeProvider>
  );
}
