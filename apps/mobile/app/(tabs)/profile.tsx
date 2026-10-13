import { StyleSheet, View } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { IconName } from '@rwm/icons';
import { Icon } from '../../src/Icon';
import { Avatar, Button, PressableScale, Segmented, T } from '../../src/ui';
import { useStore } from '../../src/store';
import { layout } from '../../src/theme';
import { useColors, useTheme } from '../../src/ThemeProvider';

const ROWS: { icon: IconName; label: string; href: Href }[] = [
  { icon: 'package', label: 'My orders', href: '/orders' },
  { icon: 'payment', label: 'Payment methods', href: '/payment-methods' },
  { icon: 'bell', label: 'Notifications', href: '/notifications' },
  { icon: 'info', label: 'Help and support', href: '/help' },
  { icon: 'route', label: 'Welcome tour', href: '/onboarding' },
];

export default function Profile() {
  const colors = useColors();
  const { mode, setMode } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { session, signOut } = useStore();
  return (
    <Animated.ScrollView contentContainerStyle={{ paddingTop: insets.top + layout.top, paddingHorizontal: layout.gutter, paddingBottom: layout.tabBar, gap: layout.section }}>
      <T v="h1">Profile</T>
      {session ? (
        <Animated.View entering={FadeInDown.springify()}>
          <PressableScale onPress={() => router.push('/edit-profile')} accessibilityRole="button" accessibilityLabel="Edit profile" style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <Avatar name={session.name} photoUrl={session.photoUrl} />
            <View style={{ flex: 1 }}>
              <T v="title" numberOfLines={1}>{session.name}</T>
              <T v="label" color={colors.text2} numberOfLines={1}>{session.email}</T>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, height: 34, paddingHorizontal: 14, borderRadius: 17, backgroundColor: colors.surface2 }}>
              <Icon name="edit" size={14} color={colors.text2} />
              <T v="label" color={colors.text2}>Edit</T>
            </View>
          </PressableScale>
        </Animated.View>
      ) : (
        <View style={{ gap: 16 }}><T color={colors.text2}>Sign in or create an account to save vehicles and track your orders.</T><Button label="Sign in or sign up" onPress={() => router.push('/login')} /></View>
      )}
      <View style={{ borderRadius: 20, backgroundColor: colors.surface1, overflow: 'hidden' }}>
        {ROWS.map((r, i) => (
          <PressableScale key={r.label} onPress={() => router.push(r.href)} accessibilityRole="button" accessibilityLabel={r.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 20, paddingHorizontal: 20, borderTopWidth: i ? StyleSheet.hairlineWidth : 0, borderTopColor: colors.border }}>
            <Icon name={r.icon} size={20} color={colors.text2} /><T style={{ flex: 1 }}>{r.label}</T><Icon name="chevronRight" size={18} color={colors.text3} />
          </PressableScale>
        ))}
      </View>
      <View style={{ gap: 14 }}>
        <T v="title">Appearance</T>
        <Segmented options={[{ id: 'system', label: 'System' }, { id: 'light', label: 'Light' }, { id: 'dark', label: 'Dark' }]} value={mode} onChange={setMode} />
      </View>
      {session && <Button label="Sign out" variant="secondary" icon="logout" onPress={signOut} />}
    </Animated.ScrollView>
  );
}
