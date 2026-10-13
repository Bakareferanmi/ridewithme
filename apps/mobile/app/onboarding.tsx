import { useRef, useState } from 'react';
import { FlatList, Image, useWindowDimensions, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, type SharedValue } from 'react-native-reanimated';
import type { IconName } from '@rwm/icons';
import { Icon } from '../src/Icon';
import { Button, PressableScale, T } from '../src/ui';
import { GoogleButton } from '../src/GoogleButton';
import { useStore } from '../src/store';
import { useColors } from '../src/ThemeProvider';

const SIDE = 28;

type Slide = { icon: IconName | 'logo'; title: string; body: string };
const SLIDES: Slide[] = [
  { icon: 'car', title: 'Every way to get a car', body: 'Buy, rent, lease or bid at auction, all in one place.' },
  { icon: 'shield', title: 'Inspected and verified', body: 'Every listing carries a clear inspection report before you commit.' },
  { icon: 'wallet', title: 'Pay your way', body: 'Card, bank transfer or wallet, then follow your order from payment to delivery.' },
  { icon: 'logo', title: 'Welcome to RideWithMe', body: 'Create an account in one tap to save vehicles, bid at auctions and track your orders.' },
];

/** One thin bar per step. It lights up as you reach its page. */
function Bar({ i, x, w }: { i: number; x: SharedValue<number>; w: number }) {
  const colors = useColors();
  const a = useAnimatedStyle(() => ({ opacity: interpolate(x.value, [(i - 1) * w, i * w], [0.18, 1], 'clamp') }));
  return <Animated.View style={[{ flex: 1, height: 3, borderRadius: 2, backgroundColor: colors.orange500 }, a]} />;
}

export default function Onboarding() {
  const colors = useColors();
  const router = useRouter();
  const { finishOnboarding } = useStore();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const x = useSharedValue(0);
  const [index, setIndex] = useState(0);
  const ref = useRef<FlatList>(null);
  const onScroll = useAnimatedScrollHandler((e) => { x.value = e.contentOffset.x; });
  const last = index === SLIDES.length - 1;

  const done = () => { finishOnboarding(); router.replace('/(tabs)'); };
  const next = () => { ref.current?.scrollToIndex({ index: index + 1, animated: true }); setIndex(index + 1); };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 24, paddingHorizontal: SIDE, height: 40 }}>
        <View style={{ flex: 1, flexDirection: 'row', gap: 6 }}>{SLIDES.map((s, i) => <Bar key={s.title} i={i} x={x} w={width} />)}</View>
        <PressableScale onPress={done} disabled={last} accessibilityRole="button" accessibilityLabel="Skip" style={{ opacity: last ? 0 : 1 }}>
          <T v="label" color={colors.text2}>Skip</T>
        </PressableScale>
      </View>

      <Animated.FlatList
        ref={ref}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(s) => s.title}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
        renderItem={({ item, index: i }) => (
          <View style={{ width, paddingHorizontal: SIDE, justifyContent: 'center', paddingBottom: 32 }}>
            <Animated.View key={`${i}-${index === i}`} entering={FadeInDown.springify().damping(20)} style={{ gap: 32 }}>
              {item.icon === 'logo'
                ? <Image source={require('../assets/logo.png')} style={{ width: 64, height: 64 }} resizeMode="contain" accessibilityIgnoresInvertColors />
                : <Icon name={item.icon} size={56} color={colors.orange500} strokeWidth={1.25} />}
              <View style={{ gap: 14 }}>
                <T v="h1" style={{ fontSize: 32, lineHeight: 40 }}>{item.title}</T>
                <T color={colors.text2} style={{ fontSize: 16, lineHeight: 25, maxWidth: 320 }}>{item.body}</T>
              </View>
            </Animated.View>
          </View>
        )}
      />

      <View style={{ paddingHorizontal: SIDE }}>
        {last ? (
          <Animated.View entering={FadeInDown.springify().damping(20)} style={{ gap: 14 }}>
            <GoogleButton onDone={done} />
            <Button label="Sign in with email" variant="secondary" onPress={() => { finishOnboarding(); router.replace('/(tabs)'); router.push('/login'); }} />
            <PressableScale onPress={done} accessibilityRole="button" accessibilityLabel="Continue as guest" style={{ alignSelf: 'center', paddingVertical: 10, paddingHorizontal: 20 }}>
              <T v="label" color={colors.text2}>Continue as guest</T>
            </PressableScale>
          </Animated.View>
        ) : (
          <Button label="Continue" onPress={next} />
        )}
      </View>
    </View>
  );
}
