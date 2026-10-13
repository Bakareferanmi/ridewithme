import { StyleSheet, View } from 'react-native';
import type { PaymentMethod } from '@rwm/shared';
import type { IconName } from '@rwm/icons';
import { Icon } from '../src/Icon';
import { PressableScale, ScreenHeader, T } from '../src/ui';
import { useStore } from '../src/store';
import { useColors } from '../src/ThemeProvider';

const METHODS: { id: PaymentMethod; label: string; sub: string; icon: IconName }[] = [
  { id: 'card', label: 'Debit card', sub: 'Pay instantly. Card details are entered securely at checkout.', icon: 'payment' },
  { id: 'transfer', label: 'Bank transfer', sub: 'Confirm in 10 minutes', icon: 'wallet' },
  { id: 'wallet', label: 'RideWithMe wallet', sub: 'Use your balance', icon: 'shield' },
];

export default function PaymentMethods() {
  const colors = useColors();
  const { defaultPayment, setDefaultPayment } = useStore();
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title="Payment methods" />
      <View style={{ padding: 20, gap: 16 }}>
        <T color={colors.text2}>Choose the method we select first at checkout. You can still change it for any order.</T>
        <View style={{ borderRadius: 20, backgroundColor: colors.surface1, overflow: 'hidden' }}>
          {METHODS.map((m, i) => {
            const on = m.id === defaultPayment;
            return (
              <PressableScale key={m.id} onPress={() => setDefaultPayment(m.id)} accessibilityRole="radio" accessibilityState={{ selected: on }} accessibilityLabel={m.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 16, paddingHorizontal: 18, borderTopWidth: i ? StyleSheet.hairlineWidth : 0, borderTopColor: colors.border }}>
                <Icon name={m.icon} size={20} color={on ? colors.orange500 : colors.text2} />
                <View style={{ flex: 1 }}>
                  <T>{m.label}</T>
                  <T v="caption" color={colors.text3}>{m.sub}</T>
                </View>
                <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: on ? colors.orange500 : colors.text3, alignItems: 'center', justifyContent: 'center' }}>
                  {on && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: colors.orange500 }} />}
                </View>
              </PressableScale>
            );
          })}
        </View>
      </View>
    </View>
  );
}
