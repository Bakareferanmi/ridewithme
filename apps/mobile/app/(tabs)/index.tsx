import { ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { formatNaira, listingModes, vehicleName, vehicles, type ListingMode, type Vehicle } from '@rwm/shared';
import type { IconName } from '@rwm/icons';
import { Icon } from '../../src/Icon';
import { PressableScale, SectionHeader, T } from '../../src/ui';
import { VehicleCard, VehiclePhoto } from '../../src/VehicleCard';
import { useCountdown } from '../../src/hooks';
import { useStore } from '../../src/store';
import { firstName, useGreeting } from '../../src/greeting';
import { layout, radius } from '../../src/theme';
import { useColors } from '../../src/ThemeProvider';

const ICON: Record<ListingMode, IconName> = { buy: 'car', rent: 'key', lease: 'lease', auction: 'auction' };
const TILE = 232;

/** Compact auction card for the horizontal "Ending soon" strip. */
function AuctionTile({ v }: { v: Vehicle }) {
  const colors = useColors();
  const router = useRouter();
  const a = v.auction!;
  const { text, left } = useCountdown(a.endsInMs);
  const urgent = left < 3_600_000;
  return (
    <PressableScale
      onPress={() => router.push({ pathname: '/vehicle/[id]', params: { id: v.id } })}
      accessibilityRole="button"
      accessibilityLabel={`${vehicleName(v)}, current bid ${formatNaira(a.currentBid)}, ends in ${text}`}
      style={{ width: TILE, borderRadius: 20, overflow: 'hidden', backgroundColor: colors.surface1, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border }}
    >
      <VehiclePhoto photo={v.photos[0]} height={120} width={500} />
      <View style={{ padding: 14, gap: 6 }}>
        <T v="title" numberOfLines={1}>{vehicleName(v)}</T>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <T v="label">{formatNaira(a.currentBid)}</T>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Icon name="clock" size={13} color={urgent ? colors.danger : colors.text2} />
            <T v="caption" color={urgent ? colors.danger : colors.text2}>{text}</T>
          </View>
        </View>
      </View>
    </PressableScale>
  );
}

export default function Home() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { session } = useStore();
  const greeting = useGreeting();
  const endingSoon = vehicles.filter((v) => v.auction).sort((a, b) => a.auction!.endsInMs - b.auction!.endsInMs).slice(0, 4);
  return (
    <ScrollView contentContainerStyle={{ paddingTop: insets.top + layout.top, paddingBottom: layout.tabBar, gap: layout.section }} showsVerticalScrollIndicator={false}>
      <Animated.View entering={FadeInDown.springify()} style={{ gap: 8, paddingHorizontal: layout.gutter }}>
        <T v="label" color={colors.text2}>{session ? `${greeting}, ${firstName(session.name)}` : greeting}</T>
        <T v="h1">Find your next ride</T>
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(80).springify()} style={{ paddingHorizontal: layout.gutter }}>
        <PressableScale onPress={() => router.push('/explore')} accessibilityRole="search" accessibilityLabel="Search vehicles" style={{ height: 54, borderRadius: radius.pill, backgroundColor: colors.surface2, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20 }}>
          <Icon name="search" size={18} color={colors.text3} />
          <T color={colors.text3}>Search make, model or city</T>
        </PressableScale>
      </Animated.View>
      <View style={{ flexDirection: 'row', paddingHorizontal: layout.gutter - 4 }}>
        {listingModes.map((m, i) => (
          <Animated.View key={m.id} entering={FadeInRight.delay(160 + i * 60).springify()} style={{ flex: 1 }}>
            <PressableScale onPress={() => router.push({ pathname: '/explore', params: { mode: m.id } })} accessibilityRole="button" accessibilityLabel={m.label} style={{ alignItems: 'center', gap: 8 }}>
              <View style={{ width: 56, height: 56, borderRadius: 20, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' }}><Icon name={ICON[m.id]} size={22} color={colors.orange500} /></View>
              <T v="caption" color={colors.text2}>{m.label}</T>
            </PressableScale>
          </Animated.View>
        ))}
      </View>
      {endingSoon.length > 0 && (
        <View style={{ gap: layout.item }}>
          <View style={{ paddingHorizontal: layout.gutter }}>
            <SectionHeader title="Ending soon" action="See all" onAction={() => router.push('/auctions')} />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: layout.gutter, gap: 14 }}>
            {endingSoon.map((v) => <AuctionTile key={v.id} v={v} />)}
          </ScrollView>
        </View>
      )}
      <View style={{ gap: layout.item, paddingHorizontal: layout.gutter }}>
        <SectionHeader title="Featured" action="See all" onAction={() => router.push('/explore')} />
        {vehicles.slice(0, 4).map((v, i) => <VehicleCard key={v.id} vehicle={v} index={i} />)}
      </View>
    </ScrollView>
  );
}
