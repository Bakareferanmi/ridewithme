import { useEffect, useState, type ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View, type PressableProps, type StyleProp, type TextInputProps, type TextProps, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import type { IconName } from '@rwm/icons';
import { Icon } from './Icon';
import { fonts, radius, VARIANTS, type Variant, type ColorPalette } from './theme';
import { useColors, useThemedStyles } from './ThemeProvider';

const useS = () => useThemedStyles(makeStyles);

export function T({ v = 'body', color, style, ...rest }: TextProps & { v?: Variant; color?: string }) {
  const colors = useColors();
  const s = VARIANTS[v];
  return <Text {...rest} style={[{ fontFamily: s.font, fontSize: s.size, lineHeight: s.line, color: color ?? colors.text }, style]} />;
}

export function PressableScale({ children, style, haptic = true, onPress, ...rest }: PressableProps & { style?: StyleProp<ViewStyle>; haptic?: boolean; children: ReactNode }) {
  const scale = useSharedValue(1);
  const a = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Pressable
      {...rest}
      onPressIn={() => { scale.value = withSpring(0.96, { damping: 18, stiffness: 400 }); }}
      onPressOut={() => { scale.value = withSpring(1, { damping: 14, stiffness: 300 }); }}
      onPress={(e) => { if (haptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {}); onPress?.(e); }}
    >
      <Animated.View style={[a, style]}>{children}</Animated.View>
    </Pressable>
  );
}

export function Button({ label, onPress, variant = 'primary', loading, disabled, icon }: { label: string; onPress?: () => void; variant?: 'primary' | 'secondary' | 'ghost'; loading?: boolean; disabled?: boolean; icon?: IconName }) {
  const s = useS();
  const colors = useColors();
  const fg = variant === 'primary' ? colors.onPrimary : colors.text;
  return (
    <PressableScale onPress={onPress} disabled={disabled || loading} accessibilityRole="button" accessibilityLabel={label} style={[s.btn, variant === 'primary' && s.btnPrimary, variant === 'secondary' && s.btnSecondary, (disabled || loading) && { opacity: 0.55 }]}>
      {loading ? <ActivityIndicator color={fg} /> : (<>{icon && <Icon name={icon} size={18} color={fg} />}<T v="title" color={fg}>{label}</T></>)}
    </PressableScale>
  );
}

export function Input({ label, error, ...rest }: TextInputProps & { label: string; error?: string }) {
  const s = useS();
  const colors = useColors();
  const [focus, setFocus] = useState(false);
  return (
    <View style={{ gap: 6 }}>
      <T v="label" color={colors.text2}>{label}</T>
      <TextInput
        {...rest}
        accessibilityLabel={label}
        placeholderTextColor={colors.text3}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={[s.input, focus && { borderColor: colors.orange500 }, !!error && { borderColor: colors.danger }]}
      />
      {!!error && <T v="caption" color={colors.danger}>{error}</T>}
    </View>
  );
}

export function Chip({ label, active, onPress }: { label: string; active?: boolean; onPress: () => void }) {
  const s = useS();
  const colors = useColors();
  return (
    <PressableScale onPress={onPress} accessibilityRole="button" accessibilityState={{ selected: !!active }} style={[s.chip, active && s.chipActive]}>
      <T v="label" color={active ? colors.orange400 : colors.text2}>{label}</T>
    </PressableScale>
  );
}

export function Segmented<K extends string>({ options, value, onChange }: { options: { id: K; label: string }[]; value: K; onChange: (v: K) => void }) {
  const s = useS();
  const colors = useColors();
  const [w, setW] = useState(0);
  const seg = w / options.length;
  const idx = Math.max(0, options.findIndex((o) => o.id === value));
  const x = useSharedValue(0);
  useEffect(() => { x.value = withSpring(idx * seg, { damping: 20, stiffness: 240 }); }, [idx, seg, x]);
  const ind = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }], width: seg }));
  return (
    <View style={s.seg}>
      <View style={{ flexDirection: 'row' }} onLayout={(e) => setW(e.nativeEvent.layout.width)}>
        <Animated.View style={[s.segInd, ind]} />
        {options.map((o) => (
          <Pressable key={o.id} style={s.segBtn} accessibilityRole="button" accessibilityState={{ selected: o.id === value }} onPress={() => { Haptics.selectionAsync().catch(() => {}); onChange(o.id); }}>
            <T v="label" color={o.id === value ? colors.text : colors.text3}>{o.label}</T>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export function Skeleton({ height, radius: r = radius.md, style }: { height: number; radius?: number; style?: StyleProp<ViewStyle> }) {
  const colors = useColors();
  const o = useSharedValue(0.4);
  useEffect(() => { o.value = withRepeat(withSequence(withTiming(0.9, { duration: 700 }), withTiming(0.4, { duration: 700 })), -1); }, [o]);
  const a = useAnimatedStyle(() => ({ opacity: o.value }));
  return <Animated.View style={[{ height, borderRadius: r, backgroundColor: colors.surface3 }, a, style]} />;
}

export function Badge({ label, tone = 'orange' }: { label: string; tone?: 'orange' | 'success' | 'warning' | 'danger' | 'info' }) {
  const s = useS();
  const colors = useColors();
  const m = { orange: [colors.orangeTint, colors.orange400], success: [colors.successTint, colors.success], warning: [colors.warningTint, colors.warning], danger: [colors.dangerTint, colors.danger], info: [colors.infoTint, colors.info] }[tone];
  return <View style={[s.badge, { backgroundColor: m[0] }]}><T v="caption" color={m[1]}>{label}</T></View>;
}

export function EmptyState({ icon, title, body }: { icon: IconName; title: string; body: string }) {
  const s = useS();
  const colors = useColors();
  return (
    <View style={s.empty}>
      <View style={s.emptyIcon}><Icon name={icon} size={24} color={colors.orange400} /></View>
      <T v="h3">{title}</T>
      <T color={colors.text2} style={{ textAlign: 'center' }}>{body}</T>
    </View>
  );
}

/** Returns an animated style that shakes horizontally each time `trigger()` is called. */
export function useShake() {
  const colors = useColors();
  const x = useSharedValue(0);
  const style = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
  const trigger = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
    x.value = withSequence(withTiming(-10, { duration: 50 }), withTiming(10, { duration: 80 }), withTiming(-6, { duration: 70 }), withTiming(0, { duration: 50 }));
  };
  return { style, trigger };
}

const makeStyles = (colors: ColorPalette) => StyleSheet.create({
  btn: { minHeight: 48, borderRadius: radius.pill, paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  btnPrimary: { backgroundColor: colors.orange500 },
  btnSecondary: { backgroundColor: colors.surface2 },
  input: { minHeight: 48, borderRadius: radius.md, borderWidth: 1, borderColor: 'transparent', backgroundColor: colors.surface2, paddingHorizontal: 16, color: colors.text, fontFamily: fonts.regular, fontSize: 15 },
  chip: { height: 34, paddingHorizontal: 14, borderRadius: radius.pill, borderWidth: 1, borderColor: 'transparent', backgroundColor: colors.surface2, justifyContent: 'center' },
  chipActive: { borderColor: colors.orange500, backgroundColor: colors.orangeTint },
  seg: { padding: 3, borderRadius: radius.pill, backgroundColor: colors.surface2 },
  segInd: { position: 'absolute', top: 0, bottom: 0, left: 0, borderRadius: radius.pill, backgroundColor: colors.surface1, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  segBtn: { flex: 1, height: 34, alignItems: 'center', justifyContent: 'center' },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 9, height: 22, borderRadius: radius.pill, justifyContent: 'center' },
  empty: { alignItems: 'center', gap: 10, padding: 32 },
  emptyIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.orangeTint, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
});
