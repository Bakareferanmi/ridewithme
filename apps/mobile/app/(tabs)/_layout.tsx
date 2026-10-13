import { Tabs } from 'expo-router';
import { FloatingTabBar } from '../../src/TabBar';
import { useColors } from '../../src/ThemeProvider';

export default function TabsLayout() {
  const colors = useColors();
  return (
    <Tabs tabBar={(props) => <FloatingTabBar {...props} />} screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.bg } }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="explore" />
      <Tabs.Screen name="auctions" />
      <Tabs.Screen name="saved" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
