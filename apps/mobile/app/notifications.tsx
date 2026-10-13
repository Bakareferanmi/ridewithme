import { StyleSheet, Switch, View } from 'react-native';
import { ScreenHeader, T } from '../src/ui';
import { useStore, type NotificationPrefs } from '../src/store';
import { useColors } from '../src/ThemeProvider';

const ITEMS: { key: keyof NotificationPrefs; label: string; sub: string }[] = [
  { key: 'orders', label: 'Order updates', sub: 'Payment, inspection and delivery progress' },
  { key: 'auctions', label: 'Auction alerts', sub: 'Outbid notices and auctions ending soon' },
  { key: 'priceDrops', label: 'Price drops', sub: 'When a saved vehicle gets cheaper' },
  { key: 'promos', label: 'Offers and news', sub: 'Deals and new listings' },
];

export default function Notifications() {
  const colors = useColors();
  const { notifications, setNotification } = useStore();
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title="Notifications" />
      <View style={{ padding: 20, gap: 16 }}>
        <View style={{ borderRadius: 20, backgroundColor: colors.surface1, overflow: 'hidden' }}>
          {ITEMS.map((it, i) => (
            <View key={it.key} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, paddingHorizontal: 18, borderTopWidth: i ? StyleSheet.hairlineWidth : 0, borderTopColor: colors.border }}>
              <View style={{ flex: 1 }}>
                <T>{it.label}</T>
                <T v="caption" color={colors.text3}>{it.sub}</T>
              </View>
              <Switch
                value={notifications[it.key]}
                onValueChange={(v) => setNotification(it.key, v)}
                accessibilityLabel={it.label}
                trackColor={{ false: colors.surface3, true: colors.orange500 }}
                thumbColor="#fff"
              />
            </View>
          ))}
        </View>
        <T v="caption" color={colors.text3}>Your choices are saved on this phone. Push delivery turns on once the notification service is connected.</T>
      </View>
    </View>
  );
}
