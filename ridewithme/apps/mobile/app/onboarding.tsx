import { useRef, useState } from 'react';
import { FlatList, useWindowDimensions, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, type SharedValue } from 'react-native-reanimated';
import type { IconName } from '@rwm/icons';
import { Icon } from '../src/Icon';
import { Button, PressableScale, T } from '../src/ui';
import { useStore } from '../src/store';
import { useColors } from '../src/ThemeProvider';

const SLIDES: { icon: IconName; title: string; body: string }[] = [
  { icon: 'car', title: 'Every way to get a car', body: 'Buy, rent, lease or bid at auction, all in one place.' },
  { icon: 'shield', title: 'Inspected and verified', body: 'Every listing carries a clear inspection report before you commit.' },
  { icon: 'wallet', title: 'Pay your way', body: 'Card, bank transfer or wallet. Track your order from payment to delivery.' },
];

function Dot({ i, x, w }: { i: number; x: SharedValue<number>; w: number }) {
  const colors = useColors();
  const a = useAnimatedStyle(() => ({
    width: interpolate(x.value, [(i - 1) * w, i * w, (i + 1) * w], [8, 28, 8], 'clamp'),
    opacity: interpolate(x.value, [(i - 1) * w, i * w, (i + 1) * w], [0.35, 1, 0.35], 'clamp'),
  }));
  return <Animated.View style={[{ height: 8, borderRadius: 4, backgroundColor: colors.orange500 }, a]} />;
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

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, paddingTop: insets.top, paddingBottom: insets.bottom + 16 }}>
      <View style={{ alignItems: 'flex-end', padding: 16 }}>
        <PressableScale onPress={done} accessibilityRole="button" accessibilityLabel="Skip"><T v="label" color={colors.text2}>Skip</T></PressableScale>
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
          <View style={{ width, paddingHorizontal: 32, alignItems: 'center', justifyContent: 'center', gap: 20 }}>
            <Animated.View key={`${i}-${index === i}`} entering={FadeInDown.springify()} style={{ alignItems: 'center', gap: 20 }}>
              <View style={{ width: 144, height: 144, borderRadius: 72, backgroundColor: colors.orangeTint, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={item.icon} size={64} color={colors.orange400} />
              </View>
              <T v="h1" style={{ textAlign: 'center' }}>{item.title}</T>
              <T color={colors.text2} style={{ textAlign: 'center' }}>{item.body}</T>
            </Animated.View>
          </View>
        )}
      />
      <View style={{ paddingHorizontal: 24, gap: 24 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6 }}>{SLIDES.map((_, i) => <Dot key={i} i={i} x={x} w={width} />)}</View>
        <Button label={last ? 'Get started' : 'Next'} onPress={() => { if (last) { done(); return; } ref.current?.scrollToIndex({ index: index + 1, animated: true }); setIndex(index + 1); }} />
      </View>
    </View>
  );
}
