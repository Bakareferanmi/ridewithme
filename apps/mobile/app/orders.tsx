import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { createApiClient, formatNaira, modeLabel, type Order, type OrderStatus } from '@rwm/shared';
import { Badge, Button, EmptyState, PressableScale, ScreenHeader, Skeleton, T } from '../src/ui';
import { Icon } from '../src/Icon';
import { useStore } from '../src/store';
import { layout } from '../src/theme';
import { useColors } from '../src/ThemeProvider';

const STATUS: Record<OrderStatus, { label: string; tone: 'orange' | 'success' | 'warning' | 'info' }> = {
  placed: { label: 'Order placed', tone: 'info' },
  paid: { label: 'Payment confirmed', tone: 'info' },
  inspection: { label: 'Final inspection', tone: 'warning' },
  delivery: { label: 'Out for delivery', tone: 'orange' },
  completed: { label: 'Completed', tone: 'success' },
};

const api = createApiClient();
const dateText = (iso: string) => new Date(iso).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });

export default function Orders() {
  const colors = useColors();
  const router = useRouter();
  const { session } = useStore();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!session) return;
    let live = true;
    setOrders(null);
    setFailed(false);
    api.orders.list().then((o) => { if (live) setOrders(o); }).catch(() => { if (live) setFailed(true); });
    return () => { live = false; };
  }, [session, attempt]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title="My orders" />
      {!session ? (
        <View style={{ padding: layout.gutter, gap: 16 }}>
          <EmptyState icon="package" title="Sign in to see your orders" body="Your purchases, rentals, leases and auction wins show up here." />
          <Button label="Sign in" onPress={() => router.replace('/login')} />
        </View>
      ) : failed ? (
        <View style={{ padding: layout.gutter, gap: 16 }}>
          <EmptyState icon="alert" title="Couldn't load orders" body="Check your connection and try again." />
          <Button label="Try again" onPress={() => setAttempt((n) => n + 1)} />
        </View>
      ) : !orders ? (
        <View style={{ padding: layout.gutter, gap: 16 }}>{[0, 1].map((i) => <Skeleton key={i} height={96} radius={20} />)}</View>
      ) : orders.length === 0 ? (
        <EmptyState icon="package" title="No orders yet" body="When you buy, rent or lease a vehicle it will show up here." />
      ) : (
        <ScrollView contentContainerStyle={{ padding: layout.gutter, gap: 16 }}>
          {orders.map((o) => (
            <PressableScale key={o.id} onPress={() => router.push({ pathname: '/vehicle/[id]', params: { id: o.vehicleId } })} accessibilityRole="button" accessibilityLabel={`${o.vehicleName}, ${STATUS[o.status].label}`} style={{ borderRadius: 24, backgroundColor: colors.surface1, padding: 20, gap: 14 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <T v="title" style={{ flex: 1 }} numberOfLines={1}>{o.vehicleName}</T>
                <Icon name="chevronRight" size={18} color={colors.text3} />
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Badge label={STATUS[o.status].label} tone={STATUS[o.status].tone} />
                <T v="title">{formatNaira(o.amount)}</T>
              </View>
              <T v="caption" color={colors.text3}>{o.id} · {modeLabel(o.mode)} · {dateText(o.createdAt)}</T>
            </PressableScale>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
