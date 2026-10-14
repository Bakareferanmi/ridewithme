import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Tabs } from 'expo-router';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import type { IconName } from '@rwm/icons';
import { Icon } from './Icon';
import { T } from './ui';
import { useColors } from './ThemeProvider';

type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

export const TAB_ICONS: Record<string, { icon: IconName; label: string }> = {
  index: { icon: 'home', label: 'Home' },
  explore: { icon: 'search', label: 'Explore' },
  auctions: { icon: 'auction', label: 'Auctions' },
  saved: { icon: 'heart', label: 'Saved' },
  profile: { icon: 'user', label: 'Profile' },
};

/** Floating pill bar: icons only, the active tab expands to show its label. */
export function FloatingTabBar({ state, navigation }: TabBarProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  return (
    <View pointerEvents="box-none" style={[StyleSheet.absoluteFill, { justifyContent: 'flex-end' }]}>
      <View
        style={{
          marginHorizontal: 24,
          marginBottom: Math.max(insets.bottom, 12) + 4,
          height: 64,
          borderRadius: 32,
          padding: 4,
          flexDirection: 'row',
          backgroundColor: colors.surface1,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
          shadowColor: '#000',
          shadowOpacity: 0.18,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 8 },
          elevation: 10,
        }}
      >
        {state.routes.map((route, i) => {
          const meta = TAB_ICONS[route.name];
          if (!meta) return null;
          const focused = state.index === i;
          return (
            <Animated.View key={route.key} layout={LinearTransition.springify().damping(20).stiffness(220)} style={{ flexGrow: focused ? 2.3 : 1, flexBasis: 0 }}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={meta.label}
                accessibilityState={{ selected: focused }}
                onPress={() => {
                  Haptics.selectionAsync().catch(() => {});
                  const e = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                  if (!focused && !e.defaultPrevented) navigation.navigate(route.name);
                }}
                style={{ flex: 1, borderRadius: 28, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, backgroundColor: focused ? colors.orangeTint : 'transparent' }}
              >
                <Icon name={meta.icon} size={20} color={focused ? colors.orange500 : colors.text3} strokeWidth={focused ? 2 : 1.75} />
                {focused && (
                  <Animated.View entering={FadeIn.duration(180).delay(60)} exiting={FadeOut.duration(80)}>
                    <T v="label" color={colors.orange500} numberOfLines={1}>{meta.label}</T>
                  </Animated.View>
                )}
              </Pressable>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}
