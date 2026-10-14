import { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, LinearTransition, useAnimatedStyle, useSharedValue, withSequence, withSpring } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { photoUrl, priceFor, formatKm, vehicleName, formatNaira, type ListingMode, type Vehicle } from '@rwm/shared';
import { Icon } from './Icon';
import { PressableScale, T } from './ui';
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

/** Heart toggle. Floats over a photo by default; `inline` is a quiet, background-free version for use in a row. */
export function HeartButton({ id, inline }: { id: string; inline?: boolean }) {
  const s = useThemedStyles(makeStyles);
  const colors = useColors();
  const { favorites, toggleFavorite } = useStore();
  const on = favorites.includes(id);
  const sc = useSharedValue(1);
  const a = useAnimatedStyle(() => ({ transform: [{ scale: sc.value }] }));
  return (
    <PressableScale accessibilityRole="button" accessibilityLabel={on ? 'Remove from saved' : 'Save vehicle'} onPress={() => { sc.value = withSequence(withSpring(1.35, { damping: 6 }), withSpring(1)); toggleFavorite(id); }} style={inline ? s.heartInline : s.heart}>
      <Animated.View style={a}><Icon name="heart" size={inline ? 19 : 18} color={on ? colors.orange500 : inline ? colors.text3 : colors.text} fill={on ? colors.orange500 : 'none'} /></Animated.View>
    </PressableScale>
  );
}

const THUMB_W = 108;
const THUMB_H = 92;

/** Compact row card: small photo on the left, name, place and price lined up on the right. */
export function VehicleCard({ vehicle, mode, index = 0 }: { vehicle: Vehicle; mode?: ListingMode; index?: number }) {
  const s = useThemedStyles(makeStyles);
  const colors = useColors();
  const router = useRouter();
  const m = mode && vehicle.modes.includes(mode) ? mode : vehicle.modes[0] ?? 'buy';
  const price = priceFor(vehicle, m);
  const suffix = m === 'auction' ? ' bid' : price?.suffix ?? '';
  return (
    <Animated.View entering={FadeInDown.delay(Math.min(index, 8) * 70).springify().damping(18)} layout={LinearTransition.springify()}>
      <PressableScale accessibilityRole="button" accessibilityLabel={vehicleName(vehicle)} onPress={() => router.push({ pathname: '/vehicle/[id]', params: { id: vehicle.id } })} style={s.card}>
        <View style={s.thumb}>
          <VehiclePhoto photo={vehicle.photos[0]} height={THUMB_H} width={320} />
        </View>
        <View style={s.info}>
          <View style={s.top}>
            <T v="title" numberOfLines={1} style={{ flex: 1 }}>{vehicleName(vehicle)}</T>
            <HeartButton id={vehicle.id} inline />
          </View>
          <T v="label" color={colors.text2} numberOfLines={1}>{vehicle.location} · {formatKm(vehicle.mileageKm)}</T>
          <View style={s.bottom}>
            {price ? (
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 2, flexShrink: 1 }}>
                <T v="h3" numberOfLines={1}>{formatNaira(price.amount)}</T>
                <T v="label" color={colors.text3}>{suffix}</T>
              </View>
            ) : <View />}
            {vehicle.inspected && <View accessible accessibilityLabel="Inspected"><Icon name="checkCircle" size={17} color={colors.success} /></View>}
          </View>
        </View>
      </PressableScale>
    </Animated.View>
  );
}

const makeStyles = (colors: ColorPalette) => StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'stretch', gap: 14, padding: 10, borderRadius: 20, backgroundColor: colors.surface1, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border },
  thumb: { width: THUMB_W, height: THUMB_H, borderRadius: 14, overflow: 'hidden' },
  info: { flex: 1, justifyContent: 'space-between', paddingVertical: 2 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 8, marginRight: -6 },
  bottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, paddingRight: 4 },
  heart: { position: 'absolute', right: 12, top: 12, width: 36, height: 36, borderRadius: 18, backgroundColor: colors.overlay, alignItems: 'center', justifyContent: 'center' },
  heartInline: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
});
