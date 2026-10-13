import { ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { listingModes, vehicles, type ListingMode } from '@rwm/shared';
import type { IconName } from '@rwm/icons';
import { Icon } from '../../src/Icon';
import { PressableScale, T } from '../../src/ui';
import { VehicleCard } from '../../src/VehicleCard';
import { useStore } from '../../src/store';
import { firstName, useGreeting } from '../../src/greeting';
import { radius } from '../../src/theme';
import { useColors } from '../../src/ThemeProvider';

const ICON: Record<ListingMode, IconName> = { buy: 'car', rent: 'key', lease: 'lease', auction: 'auction' };

export default function Home() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { session } = useStore();
  const greeting = useGreeting();
  return (
    <ScrollView contentContainerStyle={{ paddingTop: insets.top + 16, paddingHorizontal: 20, paddingBottom: 124, gap: 28 }} showsVerticalScrollIndicator={false}>
      <Animated.View entering={FadeInDown.springify()} style={{ gap: 4 }}>
        <T v="label" color={colors.text2}>{session ? `${greeting}, ${firstName(session.name)}` : greeting}</T>
        <T v="h1">Find your <T v="h1" color={colors.orange500}>next ride</T></T>
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(80).springify()}>
        <PressableScale onPress={() => router.push('/explore')} accessibilityRole="search" accessibilityLabel="Search vehicles" style={{ height: 48, borderRadius: radius.pill, backgroundColor: colors.surface2, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 18 }}>
          <Icon name="search" size={18} color={colors.text3} />
          <T color={colors.text3}>Search make, model or city</T>
        </PressableScale>
      </Animated.View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {listingModes.map((m, i) => (
          <Animated.View key={m.id} entering={FadeInRight.delay(160 + i * 60).springify()}>
            <PressableScale onPress={() => router.push({ pathname: '/explore', params: { mode: m.id } })} accessibilityRole="button" accessibilityLabel={m.label} style={{ alignItems: 'center', gap: 8, width: 72 }}>
              <View style={{ width: 52, height: 52, borderRadius: 18, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' }}><Icon name={ICON[m.id]} size={22} color={colors.orange500} /></View>
              <T v="caption" color={colors.text2}>{m.label}</T>
            </PressableScale>
          </Animated.View>
        ))}
      </View>
      <View style={{ gap: 16 }}>
        <T v="h3">Featured</T>
        {vehicles.slice(0, 4).map((v, i) => <VehicleCard key={v.id} vehicle={v} index={i} />)}
      </View>
    </ScrollView>
  );
}
