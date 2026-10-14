import { ActivityIndicator, View } from 'react-native';
import { PressableScale, T } from './ui';
import { useGoogleSignIn } from './google';
import { useColors } from './ThemeProvider';

/** "Continue with Google": signs in or creates the account in one step. */
export function GoogleButton({ onDone }: { onDone?: () => void }) {
  const colors = useColors();
  const google = useGoogleSignIn(onDone);
  return (
    <View style={{ gap: 8 }}>
      <PressableScale
        onPress={google.start}
        disabled={google.busy}
        accessibilityRole="button"
        accessibilityLabel="Continue with Google"
        style={{ minHeight: 56, borderRadius: 28, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, paddingHorizontal: 24, opacity: google.busy ? 0.6 : 1 }}
      >
        {google.busy ? <ActivityIndicator color={colors.text} /> : (
          <>
            <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}><T v="title" color="#4285F4" style={{ lineHeight: 24 }}>G</T></View>
            <T v="title">Continue with Google</T>
          </>
        )}
      </PressableScale>
      {!!google.error && <T v="caption" color={colors.danger} style={{ textAlign: 'center' }}>{google.error}</T>}
    </View>
  );
}
