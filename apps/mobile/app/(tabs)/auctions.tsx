import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { formatNaira, vehicleName, vehicles, type Vehicle } from '@rwm/shared';
import { Icon } from '../../src/Icon';
import { VehiclePhoto } from '../../src/VehicleCard';
import { Badge, PressableScale, T } from '../../src/ui';
import { useCountdown } from '../../src/hooks';
import { useColors } from '../../src/ThemeProvider';

function AuctionRow({ v, index }: { v: Vehicle; index: number }) {
  const colors = useColors();
  const router = useRouter();
  const a = v.auction!;
  const { text, left } = useCountdown(a.endsInMs);
  const urgent = left < 3_600_000;
  return (
    <Animated.View entering={FadeInDown.delay(index * 80).springify()}>
      <PressableScale accessibilityRole="button" onPress={() => router.push({ pathname: '/vehicle/[id]', params: { id: v.id } })} style={{ borderRadius: 20, overflow: 'hidden', backgroundColor: colors.surface1, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border }}>
        <VehiclePhoto photo={v.photos[0]} height={150} width={700} />
        <View style={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 16, gap: 12 }}>
          <T v="title">{vehicleName(v)}</T>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <View><T v="caption" color={colors.text3}>Current bid</T><T v="h3" color={colors.orange400}>{formatNaira(a.currentBid)}</T></View>
            <View style={{ alignItems: 'flex-end', gap: 4 }}>
              <Badge label={`${a.bidCount} bids`} tone="info" />
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}><Icon name="clock" size={14} color={urgent ? colors.danger : colors.text2} /><T v="label" color={urgent ? colors.danger : colors.text2}>{text}</T></View>
            </View>
          </View>
        </View>
      </PressableScale>
    </Animated.View>
  );
}

export default function Auctions() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const live = vehicles.filter((v) => v.auction);
  return (
    <Animated.ScrollView contentContainerStyle={{ paddingTop: insets.top + 16, paddingHorizontal: 20, paddingBottom: 124, gap: 16 }}>
      <View style={{ gap: 4 }}><T v="h1">Auctions</T><T color={colors.text2}>Every vehicle is inspected. Highest bid wins.</T></View>
      {live.map((v, i) => <AuctionRow key={v.id} v={v} index={i} />)}
    </Animated.ScrollView>
  );
}
