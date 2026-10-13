import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown, FadeInUp, Extrapolation, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { findVehicle, formatKm, formatNaira, listingModes, makeBidSchema, modeLabel, orderAmount, priceFor, vehicleName, type ListingMode } from '@rwm/shared';
import type { IconName } from '@rwm/icons';
import { Icon } from '../../src/Icon';
import { HeartButton, VehiclePhoto } from '../../src/VehicleCard';
import { Badge, Button, EmptyState, Input, PressableScale, Segmented, T, useShake } from '../../src/ui';
import { useCountdown } from '../../src/hooks';
import { layout } from '../../src/theme';
import { useColors } from '../../src/ThemeProvider';

const HERO = 300;

function BidSheet({ visible, onClose, minBid, onPlaced }: { visible: boolean; onClose: () => void; minBid: number; onPlaced: (amount: number) => void }) {
  const colors = useColors();
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const shake = useShake();
  const place = () => {
    const r = makeBidSchema(minBid).safeParse({ amount: Number(value.replace(/[^\d]/g, '')) || undefined });
    if (!r.success) { setError(r.error.issues[0]?.message ?? 'Enter a valid bid'); shake.trigger(); return; }
    setError('');
    onPlaced(r.data.amount);
    setValue('');
  };
  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <KeyboardAvoidingView style={{ flex: 1, justifyContent: 'flex-end' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Animated.View entering={FadeIn} style={{ position: 'absolute', inset: 0, backgroundColor: colors.scrim }}><Pressable style={{ flex: 1 }} onPress={onClose} accessibilityLabel="Close" /></Animated.View>
        <Animated.View entering={FadeInUp.springify().damping(18)} style={[{ padding: 24, gap: 16, borderTopLeftRadius: 28, borderTopRightRadius: 28, backgroundColor: colors.surface2 }, shake.style]}>
          <T v="h3">Place a bid</T>
          <T color={colors.text2}>Minimum bid is {formatNaira(minBid)}. Bids are binding.</T>
          <Input label="Your bid (₦)" value={value} onChangeText={setValue} keyboardType="number-pad" placeholder={String(minBid)} error={error} />
          <Button label="Confirm bid" onPress={place} />
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default function VehicleDetail() {
  const colors = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const v = findVehicle(String(id));
  const [mode, setMode] = useState<ListingMode>(v?.modes[0] ?? 'buy');
  const [days, setDays] = useState(3);
  const [bidOpen, setBidOpen] = useState(false);
  const [bid, setBid] = useState<number | null>(null);
  const y = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => { y.value = e.contentOffset.y; });
  const hero = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(y.value, [-HERO, 0, HERO], [-HERO / 2, 0, HERO * 0.45], Extrapolation.CLAMP) },
      { scale: interpolate(y.value, [-HERO, 0], [2, 1], Extrapolation.CLAMP) },
    ],
  }));
  const bar = useAnimatedStyle(() => ({ opacity: interpolate(y.value, [HERO - 120, HERO - 60], [0, 1], Extrapolation.CLAMP) }));
  const countdown = useCountdown(v?.auction?.endsInMs ?? 0);

  const options = useMemo(() => listingModes.filter((m) => v?.modes.includes(m.id)).map((m) => ({ id: m.id, label: m.label })), [v]);

  if (!v) return <View style={{ flex: 1, paddingTop: insets.top }}><EmptyState icon="car" title="Vehicle not found" body="It may have been sold." /><Button label="Go back" onPress={() => router.back()} /></View>;

  const price = priceFor(v, mode);
  const current = mode === 'auction' && bid ? Math.max(bid, v.auction?.currentBid ?? 0) : price?.amount ?? 0;
  const minBid = (v.auction?.currentBid ?? 0) + (v.auction?.minIncrement ?? 0);
  const specs: { icon: IconName; label: string; value: string }[] = [
    { icon: 'gauge', label: 'Mileage', value: formatKm(v.mileageKm) },
    { icon: 'fuel', label: 'Fuel', value: v.fuel },
    { icon: 'gear', label: 'Gearbox', value: v.transmission },
    { icon: 'pin', label: 'Location', value: v.location },
  ];

  const cta = () => {
    if (mode === 'auction') { setBidOpen(true); return; }
    router.push({ pathname: '/checkout', params: { id: v.id, mode, days: String(days) } });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Animated.ScrollView onScroll={onScroll} scrollEventThrottle={16} contentContainerStyle={{ paddingBottom: 130 }} showsVerticalScrollIndicator={false}>
        <Animated.View style={[{ height: HERO, overflow: 'hidden' }, hero]}><VehiclePhoto photo={v.photos[0]} height={HERO} width={1100} /></Animated.View>
        <View style={{ marginTop: -24, borderTopLeftRadius: 28, borderTopRightRadius: 28, backgroundColor: colors.bg, paddingHorizontal: layout.gutter, paddingTop: 28, gap: layout.section }}>
          <Animated.View entering={FadeInDown.springify()} style={{ gap: 14 }}>
            <View style={{ flexDirection: 'row', gap: 6 }}>{v.inspected && <Badge label="Inspected" tone="success" />}<Badge label={v.body} tone="info" /></View>
            <T v="h2">{vehicleName(v)}</T>
            <T color={colors.text2}>{v.description}</T>
          </Animated.View>
          {options.length > 1 && <Segmented options={options} value={mode} onChange={setMode} />}
          <Animated.View key={mode} entering={FadeInDown.springify()} style={{ padding: 20, borderRadius: 24, backgroundColor: colors.surface1, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border, gap: 14 }}>
            {price && <><T v="label" color={colors.text2}>{mode === 'auction' ? 'Current bid' : price.label}</T>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}><T v="h2">{formatNaira(mode === 'auction' ? current : price.amount)}</T><T color={colors.text3}>{price.suffix}</T></View></>}
            {mode === 'rent' && (
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <T v="label">Rental days</T>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                  <PressableScale onPress={() => setDays(Math.max(1, days - 1))} accessibilityRole="button" accessibilityLabel="Fewer days" style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' }}><Icon name="minus" size={16} /></PressableScale>
                  <T v="title">{days}</T>
                  <PressableScale onPress={() => setDays(Math.min(30, days + 1))} accessibilityRole="button" accessibilityLabel="More days" style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' }}><Icon name="plus" size={16} /></PressableScale>
                </View>
              </View>
            )}
            {mode === 'lease' && v.leaseTermMonths && <T v="label" color={colors.text2}>{v.leaseTermMonths}-month term</T>}
            {mode === 'auction' && v.auction && <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><T v="label" color={colors.text2}>{v.auction.bidCount} bids</T><T v="label" color={colors.orange400}>Ends in {countdown.text}</T></View>}
          </Animated.View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {specs.map((s, i) => (
              <Animated.View key={s.label} entering={FadeInDown.delay(i * 60).springify()} style={{ width: '48%', padding: 14, borderRadius: 16, backgroundColor: colors.surface1, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border, gap: 6 }}>
                <Icon name={s.icon} size={18} color={colors.text2} /><T v="caption" color={colors.text3}>{s.label}</T><T v="label">{s.value}</T>
              </Animated.View>
            ))}
          </View>
          <View style={{ gap: 14 }}>
            <T v="h3">Features</T>
            {v.features.map((f) => <View key={f} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}><Icon name="check" size={16} color={colors.text2} /><T color={colors.text2}>{f}</T></View>)}
          </View>
        </View>
      </Animated.ScrollView>

      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, paddingTop: insets.top + 8, paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Animated.View pointerEvents="none" style={[{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colors.bg }, bar]} />
        <PressableScale onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Back" style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.overlay, alignItems: 'center', justifyContent: 'center' }}><Icon name="arrowLeft" size={20} /></PressableScale>
        <HeartButton id={v.id} />
      </View>

      <Animated.View entering={FadeInUp.delay(200).springify()} style={{ position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: layout.gutter, paddingTop: 16, paddingBottom: insets.bottom + 16, backgroundColor: colors.surface1, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border, flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <View style={{ flex: 1 }}><T v="caption" color={colors.text3}>{modeLabel(mode)}</T><T v="title">{formatNaira(mode === 'auction' ? current : orderAmount(v, mode, { days }))}</T></View>
        <View style={{ flex: 1.2 }}><Button label={mode === 'auction' ? 'Place bid' : mode === 'buy' ? 'Buy now' : mode === 'rent' ? 'Rent now' : 'Start lease'} onPress={cta} /></View>
      </Animated.View>

      <BidSheet visible={bidOpen} onClose={() => setBidOpen(false)} minBid={minBid} onPlaced={(a) => { setBid(a); setBidOpen(false); }} />
    </View>
  );
}
