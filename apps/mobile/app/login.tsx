import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { fieldErrors, loginSchema } from '@rwm/shared';
import { Button, Input, PressableScale, T, useShake } from '../src/ui';
import { Icon } from '../src/Icon';
import { useStore } from '../src/store';
import { useGoogleSignIn } from '../src/google';
import { useColors } from '../src/ThemeProvider';

export default function Login() {
  const colors = useColors();
  const router = useRouter();
  const { signIn } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const shake = useShake();
  const google = useGoogleSignIn(() => router.back());

  const submit = async () => {
    const r = loginSchema.safeParse({ email, password });
    if (!r.success) { setErrors(fieldErrors(r.error)); shake.trigger(); return; }
    setErrors({});
    setBusy(true);
    await new Promise((res) => setTimeout(res, 700));
    signIn(r.data.email);
    setBusy(false);
    router.back();
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 32, gap: 24 }} keyboardShouldPersistTaps="handled">
        <PressableScale onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Close" style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' }}><Icon name="close" size={20} /></PressableScale>
        <Animated.View entering={FadeInDown.springify()} style={{ gap: 8 }}>
          <T v="h1">Welcome</T>
          <T color={colors.text2}>Sign in or create an account to save vehicles and track orders.</T>
        </Animated.View>

        <View style={{ gap: 10 }}>
          <PressableScale
            onPress={google.start}
            disabled={google.busy}
            accessibilityRole="button"
            accessibilityLabel="Continue with Google"
            style={{ minHeight: 52, borderRadius: 26, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, paddingHorizontal: 24, opacity: google.busy ? 0.6 : 1 }}
          >
            {google.busy ? <ActivityIndicator color={colors.text} /> : (
              <>
                <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}><T v="title" color="#4285F4" style={{ lineHeight: 22 }}>G</T></View>
                <T v="title">Continue with Google</T>
              </>
            )}
          </PressableScale>
          <T v="caption" color={colors.text3} style={{ textAlign: 'center' }}>New here? Google creates your account the first time you sign in.</T>
          {!!google.error && <T v="caption" color={colors.danger} style={{ textAlign: 'center' }}>{google.error}</T>}
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: colors.border }} />
          <T v="caption" color={colors.text3}>or use your email</T>
          <View style={{ flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: colors.border }} />
        </View>

        <Animated.View style={[{ gap: 18 }, shake.style]}>
          <Input label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" autoComplete="email" error={errors.email} />
          <Input label="Password" value={password} onChangeText={setPassword} secureTextEntry autoComplete="password" error={errors.password} />
        </Animated.View>
        <Button label="Sign in" onPress={submit} loading={busy} />
        <View style={{ alignItems: 'center' }}><T v="caption" color={colors.text3}>Demo sign in: any valid email and an 8+ character password.</T></View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
