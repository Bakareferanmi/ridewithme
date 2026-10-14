import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInRight, FadeOutLeft, ZoomIn, useAnimatedProps, useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';
import { checkoutSchema, fieldErrors, findVehicle, formatNaira, modeLabel, orderAmount, vehicleName, type ListingMode, type PaymentMethod } from '@rwm/shared';
import type { IconName } from '@rwm/icons';
import { Icon } from '../src/Icon';
import { Button, Input, PressableScale, T, useShake } from '../src/ui';
import { useStore } from '../src/store';
import { layout } from '../src/theme';
import { useColors } from '../src/ThemeProvider';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const STEPS = ['Details', 'Payment', 'Review'];
const METHODS: { id: PaymentMethod; label: string; sub: string; icon: IconName }[] = [
  { id: 'card', label: 'Debit card', sub: 'Pay instantly', icon: 'payment' },
  { id: 'transfer', label: 'Bank transfer', sub: 'Confirm in 10 minutes', icon: 'wallet' },
  { id: 'wallet', label: 'RideWithMe wallet', sub: 'Use your balance', icon: 'shield' },
];

function Check() {
  const colors = useColors();
  const p = useSharedValue(26);
  const s = useSharedValue(0.6);
  useEffect(() => { s.value = withSpring(1, { damping: 8 }); p.value = withDelay(250, withTiming(0, { duration: 550 })); }, [p, s]);
  const props = useAnimatedProps(() => ({ strokeDashoffset: p.value }));
  const st = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  return (
    <Animated.View style={st}>
      <Svg width={96} height={96} viewBox="0 0 24 24">
        <Circle cx={12} cy={12} r={11} fill={colors.successTint} />
        <AnimatedPath d="M7 12.5l3.2 3.2L17 9" stroke={colors.success} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={26} animatedProps={props} />
      </Svg>
    </Animated.View>
  );
}

export default function Checkout() {
  const colors = useColors();
  const { id, mode, days } = useLocalSearchParams<{ id: string; mode: string; days?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const v = findVehicle(String(id));
  const m = (mode as ListingMode) ?? 'buy';
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ fullName: '', phone: '', email: '', address: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { defaultPayment } = useStore();
  const [method, setMethod] = useState<PaymentMethod>(defaultPayment);
  const shake = useShake();
  const progress = useSharedValue(1 / 3);
  useEffect(() => { progress.value = withTiming((step + 1) / 3, { duration: 350 }); }, [step, progress]);
  const bar = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` }));

  if (!v) return null;
  const amount = orderAmount(v, m, { days: Number(days) || 1 });

  const next = async () => {
    if (step === 0) {
      const r = checkoutSchema.safeParse(form);
      if (!r.success) { setErrors(fieldErrors(r.error)); shake.trigger(); return; }
      setErrors({});
    }
    if (step === 2) {
      setBusy(true);
      await new Promise((res) => setTimeout(res, 1200));
      setBusy(false);
      setDone(true);
      return;
    }
    setStep(step + 1);
  };

  if (done) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 16 }}>
        <Check />
        <Animated.View entering={FadeIn.delay(700)} style={{ alignItems: 'center', gap: 8 }}>
          <T v="h2">Order placed</T>
          <T color={colors.text2} style={{ textAlign: 'center' }}>{vehicleName(v)} is reserved for you. We will confirm your payment shortly.</T>
        </Animated.View>
        <Animated.View entering={FadeIn.delay(900)} style={{ width: '100%', gap: 8, marginTop: 12 }}>
          <Button label="Back to home" onPress={() => router.dismissAll()} />
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, paddingTop: insets.top }}>
      <View style={{ paddingHorizontal: layout.gutter, paddingVertical: 16, gap: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <PressableScale onPress={() => (step ? setStep(step - 1) : router.back())} accessibilityRole="button" accessibilityLabel="Back" style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' }}><Icon name="arrowLeft" size={20} /></PressableScale>
          <T v="h3">Checkout</T>
        </View>
        <View style={{ height: 4, borderRadius: 4, backgroundColor: colors.surface3, overflow: 'hidden' }}><Animated.View style={[{ height: 4, backgroundColor: colors.orange500 }, bar]} /></View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>{STEPS.map((s, i) => <T key={s} v="caption" color={i <= step ? colors.text : colors.text3}>{i + 1}. {s}</T>)}</View>
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: layout.gutter, paddingTop: 12, gap: layout.item, paddingBottom: 140 }} keyboardShouldPersistTaps="handled">
        <Animated.View key={step} entering={FadeInRight.springify().damping(20)} exiting={FadeOutLeft.duration(120)} style={{ gap: layout.item }}>
          {step === 0 && (
            <Animated.View style={[{ gap: layout.item }, shake.style]}>
              <Input label="Full name" value={form.fullName} onChangeText={(t) => setForm({ ...form, fullName: t })} error={errors.fullName} autoComplete="name" />
              <Input label="Phone" value={form.phone} onChangeText={(t) => setForm({ ...form, phone: t })} error={errors.phone} keyboardType="phone-pad" placeholder="080 1234 5678" />
              <Input label="Email" value={form.email} onChangeText={(t) => setForm({ ...form, email: t })} error={errors.email} keyboardType="email-address" autoCapitalize="none" />
              <Input label="Address" value={form.address} onChangeText={(t) => setForm({ ...form, address: t })} error={errors.address} />
            </Animated.View>
          )}
          {step === 1 && METHODS.map((mm) => (
            <PressableScale key={mm.id} onPress={() => setMethod(mm.id)} accessibilityRole="radio" accessibilityState={{ selected: method === mm.id }} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 20, backgroundColor: method === mm.id ? colors.orangeTint : colors.surface1, borderWidth: 1, borderColor: method === mm.id ? colors.orange500 : colors.border }}>
              <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' }}><Icon name={mm.icon} size={20} color={colors.orange500} /></View>
              <View style={{ flex: 1 }}><T v="title">{mm.label}</T><T v="label" color={colors.text2}>{mm.sub}</T></View>
              {method === mm.id && <Animated.View entering={ZoomIn}><Icon name="checkCircle" size={20} color={colors.orange500} /></Animated.View>}
            </PressableScale>
          ))}
          {step === 2 && (
            <View style={{ padding: 20, borderRadius: 24, backgroundColor: colors.surface1, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border, gap: 12 }}>
              <T v="title">{vehicleName(v)}</T>
              {[['Type', modeLabel(m)], ['Name', form.fullName], ['Phone', form.phone], ['Payment', METHODS.find((x) => x.id === method)?.label ?? '']].map(([k, val]) => (
                <View key={k} style={{ flexDirection: 'row', justifyContent: 'space-between' }}><T color={colors.text3}>{k}</T><T>{val}</T></View>
              ))}
              <View style={{ height: 1, backgroundColor: colors.border }} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><T v="title">Total today</T><T v="h3">{formatNaira(amount)}</T></View>
            </View>
          )}
        </Animated.View>
      </ScrollView>
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: layout.gutter, paddingTop: 16, paddingBottom: insets.bottom + 16, backgroundColor: colors.surface1, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border }}>
        <Button label={step === 2 ? `Pay ${formatNaira(amount)}` : 'Continue'} onPress={next} loading={busy} />
      </View>
    </View>
  );
}
