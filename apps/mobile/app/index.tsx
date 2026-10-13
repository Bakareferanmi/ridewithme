import { useEffect } from 'react';
import { Image, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useStore } from '../src/store';
import { useColors } from '../src/ThemeProvider';

/** Logo on a clean background, then straight into the app or the welcome flow. */
export default function Splash() {
  const colors = useColors();
  const router = useRouter();
  const { ready, onboarded } = useStore();

  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => router.replace(onboarded ? '/(tabs)' : '/onboarding'), 1200);
    return () => clearTimeout(t);
  }, [ready, onboarded, router]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View entering={FadeIn.duration(700)}>
        <Image source={require('../assets/logo.png')} style={{ width: 104, height: 104 }} resizeMode="contain" accessibilityLabel="RideWithMe" />
      </Animated.View>
    </View>
  );
}
