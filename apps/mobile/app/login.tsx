import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { fieldErrors, loginSchema } from '@rwm/shared';
import { Button, Input, PressableScale, T, useShake } from '../src/ui';
import { Icon } from '../src/Icon';
import { useStore } from '../src/store';
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
      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 32, gap: 28 }} keyboardShouldPersistTaps="handled">
        <PressableScale onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Close" style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' }}><Icon name="close" size={20} /></PressableScale>
        <Animated.View entering={FadeInDown.springify()} style={{ gap: 8 }}>
          <T v="h1">Welcome back</T>
          <T color={colors.text2}>Sign in to save vehicles and track orders.</T>
        </Animated.View>
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
