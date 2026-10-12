import { useEffect } from 'react';
import { Tabs } from 'expo-router';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import type { IconName } from '@rwm/icons';
import { Icon } from '../../src/Icon';
import { fonts } from '../../src/theme';
import { useColors } from '../../src/ThemeProvider';

function TabIcon({ name, color, focused }: { name: IconName; color: string; focused: boolean }) {
  const s = useSharedValue(1);
  useEffect(() => { s.value = withSpring(focused ? 1.18 : 1, { damping: 10, stiffness: 220 }); }, [focused, s]);
  const a = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  return <Animated.View style={a}><Icon name={name} size={24} color={color} /></Animated.View>;
}

const tab = (title: string, icon: IconName) => ({
  title,
  tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => <TabIcon name={icon} color={color} focused={focused} />,
});

export default function TabsLayout() {
  const colors = useColors();
  return (
    <Tabs
      screenListeners={{ tabPress: () => { Haptics.selectionAsync().catch(() => {}); } }}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.orange500,
        tabBarInactiveTintColor: colors.text3,
        tabBarStyle: { backgroundColor: colors.surface1, borderTopColor: colors.border, height: 64, paddingTop: 6 },
        tabBarLabelStyle: { fontFamily: fonts.medium, fontSize: 11, marginBottom: 6 },
        sceneStyle: { backgroundColor: colors.bg },
      }}
    >
      <Tabs.Screen name="index" options={tab('Home', 'home')} />
      <Tabs.Screen name="explore" options={tab('Explore', 'search')} />
      <Tabs.Screen name="auctions" options={tab('Auctions', 'auction')} />
      <Tabs.Screen name="saved" options={tab('Saved', 'heart')} />
      <Tabs.Screen name="profile" options={tab('Profile', 'user')} />
    </Tabs>
  );
}
