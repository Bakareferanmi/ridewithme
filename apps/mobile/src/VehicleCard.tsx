import { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, LinearTransition, useAnimatedStyle, useSharedValue, withSequence, withSpring } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { photoUrl, priceFor, formatKm, vehicleName, formatNaira, type ListingMode, type Vehicle } from '@rwm/shared';
import { Icon } from './Icon';
import { PressableScale, Badge, T } from './ui';
import { useStore } from './store';
import { useColors, useThemedStyles } from './ThemeProvider';
import type { ColorPalette } from './theme';

export function VehicleArt({ height, children }: { height: number; children?: React.ReactNode }) {
  const colors = useColors();
  return (
    <LinearGradient colors={[colors.artA, colors.artB]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ height, alignItems: 'center', justifyContent: 'center' }}>
      <Icon name="car" size={Math.min(96, height * 0.5)} color={colors.artIcon} />
      {children}
    </LinearGradient>
  );
}

/** Real photo with the placeholder underneath, so a slow or failed load never leaves a hole. */
export function VehiclePhoto({ photo, height, width = 900 }: { photo?: string; height: number; width?: number }) {
  const [failed, setFailed] = useState(false);
  return (
    <View style={{ height, overflow: 'hidden' }}>
      <VehicleArt height={height} />
      {photo && !failed && (
        <Image source={{ uri: photoUrl(photo, width) }} accessibilityIgnoresInvertColors resizeMode="cover" onError={() => setFailed(true)} style={[StyleSheet.absoluteFill, { width: '100%', height }]} />
      )}
    </View>
  );
}

export function HeartButton({ id }: { id: string }) {
  const s = useThemedStyles(makeStyles);
  const colors = useColors();
  const { favorites, toggleFavorite } = useStore();
  const on = favorites.includes(id);
  const sc = useSharedValue(1);
  const a = useAnimatedStyle(() => ({ transform: [{ scale: sc.value }] }));
  return (
    <PressableScale accessibilityRole="button" accessibilityLabel={on ? 'Remove from saved' : 'Save vehicle'} onPress={() => { sc.value = withSequence(withSpring(1.35, { damping: 6 }), withSpring(1)); toggleFavorite(id); }} style={s.heart}>
      <Animated.View style={a}><Icon name="heart" size={18} color={on ? colors.orange500 : colors.text} fill={on ? colors.orange500 : 'none'} /></Animated.View>
    </PressableScale>
  );
}

export function VehicleCard({ vehicle, mode, index = 0 }: { vehicle: Vehicle; mode?: ListingMode; index?: number }) {
  const s = useThemedStyles(makeStyles);
  const colors = useColors();
  const router = useRouter();
  const m = mode && vehicle.modes.includes(mode) ? mode : vehicle.modes[0] ?? 'buy';
  const price = priceFor(vehicle, m);
  return (
    <Animated.View entering={FadeInDown.delay(Math.min(index, 8) * 70).springify().damping(18)} layout={LinearTransition.springify()}>
      <PressableScale accessibilityRole="button" accessibilityLabel={vehicleName(vehicle)} onPress={() => router.push({ pathname: '/vehicle/[id]', params: { id: vehicle.id } })} style={s.card}>
        <View>
          <VehiclePhoto photo={vehicle.photos[0]} height={180} width={700} />
          <View style={s.badges}>{vehicle.inspected && <Badge label="Inspected" tone="success" />}{vehicle.auction && <Badge label="Auction" />}</View>
          <HeartButton id={vehicle.id} />
        </View>
        <View style={s.body}>
          <T v="title" numberOfLines={1}>{vehicleName(vehicle)}</T>
          <T v="label" color={colors.text2}>{formatKm(vehicle.mileageKm)} · {vehicle.fuel} · {vehicle.location}</T>
          {price && (
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4, marginTop: 6 }}>
              <T v="h3" color={colors.orange400}>{formatNaira(price.amount)}</T>
              <T v="label" color={colors.text3}>{price.suffix}</T>
            </View>
          )}
        </View>
      </PressableScale>
    </Animated.View>
  );
}

const makeStyles = (colors: ColorPalette) => StyleSheet.create({
  card: { borderRadius: 20, overflow: 'hidden', backgroundColor: colors.surface1, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border },
  body: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 16, gap: 4 },
  badges: { position: 'absolute', left: 12, top: 12, flexDirection: 'row', gap: 6 },
  heart: { position: 'absolute', right: 12, top: 12, width: 36, height: 36, borderRadius: 18, backgroundColor: colors.overlay, alignItems: 'center', justifyContent: 'center' },
});
