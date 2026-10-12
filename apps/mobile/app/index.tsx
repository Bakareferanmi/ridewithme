import { useEffect } from 'react';
import { Image, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInUp, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { useStore } from '../src/store';
import { T } from '../src/ui';
import { useColors } from '../src/ThemeProvider';

export default function Splash() {
  const colors = useColors();
  const router = useRouter();
  const { ready, onboarded } = useStore();
  const y = useSharedValue(0);
  useEffect(() => { y.value = withRepeat(withSequence(withTiming(-8, { duration: 1100 }), withTiming(0, { duration: 1100 })), -1); }, [y]);
  const a = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));

  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => router.replace(onboarded ? '/(tabs)' : '/onboarding'), 1400);
    return () => clearTimeout(t);
  }, [ready, onboarded, router]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <Animated.View entering={FadeIn.duration(600)} style={a}>
        <Image source={require('../assets/logo.png')} style={{ width: 112, height: 112 }} resizeMode="contain" />
      </Animated.View>
      <Animated.View entering={FadeInUp.delay(300).duration(600)}>
        <T v="h2">RideWithMe</T>
      </Animated.View>
    </View>
  );
}
