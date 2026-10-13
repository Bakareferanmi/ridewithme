import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated from 'react-native-reanimated';
import { fieldErrors, profileSchema } from '@rwm/shared';
import { Avatar, Button, Input, ScreenHeader, T, useShake } from '../src/ui';
import { useStore } from '../src/store';
import { useColors } from '../src/ThemeProvider';

export default function EditProfile() {
  const colors = useColors();
  const router = useRouter();
  const { session, updateProfile } = useStore();
  const [form, setForm] = useState({ name: session?.name ?? '', email: session?.email ?? '', phone: session?.phone ?? '', city: session?.city ?? '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const shake = useShake();
  const googleManaged = session?.provider === 'google';
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  if (!session) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <ScreenHeader title="Edit profile" />
        <View style={{ padding: 20, gap: 12 }}>
          <T color={colors.text2}>Sign in to edit your profile.</T>
          <Button label="Sign in" onPress={() => router.replace('/login')} />
        </View>
      </View>
    );
  }

  const save = () => {
    const r = profileSchema.safeParse(form);
    if (!r.success) { setErrors(fieldErrors(r.error)); shake.trigger(); return; }
    setErrors({});
    updateProfile({ name: r.data.name, email: googleManaged ? session.email : r.data.email, phone: r.data.phone || undefined, city: r.data.city || undefined });
    router.back();
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScreenHeader title="Edit profile" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 40, gap: 24 }} keyboardShouldPersistTaps="handled">
        <View style={{ alignItems: 'center', gap: 8 }}>
          <Avatar name={form.name || session.name} photoUrl={session.photoUrl} size={88} />
          {googleManaged && <T v="caption" color={colors.text3}>Photo comes from your Google account.</T>}
        </View>
        <Animated.View style={[{ gap: 18 }, shake.style]}>
          <Input label="Full name" value={form.name} onChangeText={set('name')} autoComplete="name" error={errors.name} />
          <View style={{ gap: 6 }}>
            <Input label="Email" value={form.email} onChangeText={set('email')} editable={!googleManaged} autoCapitalize="none" keyboardType="email-address" autoComplete="email" error={errors.email} />
            {googleManaged && <T v="caption" color={colors.text3}>Email is managed by Google and can't be changed here.</T>}
          </View>
          <Input label="Phone (optional)" value={form.phone} onChangeText={set('phone')} keyboardType="phone-pad" autoComplete="tel" placeholder="0803 123 4567" error={errors.phone} />
          <Input label="City (optional)" value={form.city} onChangeText={set('city')} placeholder="Lagos" error={errors.city} />
        </Animated.View>
        <Button label="Save changes" onPress={save} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
