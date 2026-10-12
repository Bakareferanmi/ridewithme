import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { initials } from '@rwm/shared';
import type { IconName } from '@rwm/icons';
import { Icon } from '../../src/Icon';
import { Button, PressableScale, Segmented, T } from '../../src/ui';
import { useStore } from '../../src/store';
import { radius } from '../../src/theme';
import { useColors, useTheme } from '../../src/ThemeProvider';

const ROWS: { icon: IconName; label: string }[] = [
  { icon: 'package', label: 'My orders' },
  { icon: 'payment', label: 'Payment methods' },
  { icon: 'bell', label: 'Notifications' },
  { icon: 'info', label: 'Help and support' },
];

export default function Profile() {
  const colors = useColors();
  const { mode, setMode } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { session, signOut } = useStore();
  return (
    <Animated.ScrollView contentContainerStyle={{ paddingTop: insets.top + 16, padding: 20, gap: 20 }}>
      <T v="h1">Profile</T>
      {session ? (
        <Animated.View entering={FadeInDown.springify()} style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: colors.orange500, alignItems: 'center', justifyContent: 'center' }}><T v="h3" color={colors.onPrimary}>{initials(session.name)}</T></View>
          <View><T v="title">{session.name}</T><T v="label" color={colors.text2}>{session.email}</T></View>
        </Animated.View>
      ) : (
        <View style={{ gap: 12 }}><T color={colors.text2}>Sign in to save vehicles and track your orders.</T><Button label="Sign in" onPress={() => router.push('/login')} /></View>
      )}
      <View style={{ borderRadius: radius.lg, backgroundColor: colors.surface1, borderWidth: 1, borderColor: colors.border }}>
        {ROWS.map((r, i) => (
          <PressableScale key={r.label} accessibilityRole="button" style={{ flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderTopWidth: i ? 1 : 0, borderTopColor: colors.border }}>
            <Icon name={r.icon} size={22} color={colors.text2} /><T style={{ flex: 1 }}>{r.label}</T><Icon name="chevronRight" size={18} color={colors.text3} />
          </PressableScale>
        ))}
      </View>
      <View style={{ gap: 10 }}>
        <T v="title">Appearance</T>
        <Segmented options={[{ id: 'system', label: 'System' }, { id: 'light', label: 'Light' }, { id: 'dark', label: 'Dark' }]} value={mode} onChange={setMode} />
      </View>
      {session && <Button label="Sign out" variant="secondary" icon="logout" onPress={signOut} />}
    </Animated.ScrollView>
  );
}
