import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { vehicles } from '@rwm/shared';
import { Button, EmptyState, T } from '../../src/ui';
import { VehicleCard } from '../../src/VehicleCard';
import { useStore } from '../../src/store';
import { layout } from '../../src/theme';

export default function Saved() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { favorites } = useStore();
  const list = vehicles.filter((v) => favorites.includes(v.id));
  return (
    <Animated.FlatList
      data={list}
      keyExtractor={(v) => v.id}
      contentContainerStyle={{ paddingTop: insets.top + layout.top, paddingHorizontal: layout.gutter, paddingBottom: layout.tabBar, gap: layout.item, flexGrow: 1 }}
      itemLayoutAnimation={LinearTransition.springify()}
      ListHeaderComponent={<T v="h1" style={{ marginBottom: 8 }}>Saved</T>}
      renderItem={({ item, index }) => <VehicleCard vehicle={item} index={index} />}
      ListEmptyComponent={<><EmptyState icon="heart" title="Nothing saved yet" body="Tap the heart on any vehicle to keep it here." /><Button label="Browse vehicles" variant="secondary" onPress={() => router.push('/explore')} /></>}
    />
  );
}
