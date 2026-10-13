import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { bodyTypes, filterVehicles, listingModes, vehicles, type BodyType, type ListingMode } from '@rwm/shared';
import { Chip, EmptyState, Input, Segmented, Skeleton, T } from '../../src/ui';
import { VehicleCard } from '../../src/VehicleCard';
import { useSimulatedLoad } from '../../src/hooks';
import { layout } from '../../src/theme';
import { useColors } from '../../src/ThemeProvider';

type ModeOpt = ListingMode | 'all';

export default function Explore() {
  const colors = useColors();
  const params = useLocalSearchParams<{ mode?: string }>();
  const insets = useSafeAreaInsets();
  const [q, setQ] = useState('');
  const [mode, setMode] = useState<ModeOpt>((['buy', 'rent', 'lease', 'auction'] as string[]).includes(params.mode ?? '') ? (params.mode as ListingMode) : 'all');
  const [body, setBody] = useState<BodyType[]>([]);
  const results = useMemo(() => filterVehicles(vehicles, { search: q, mode: mode === 'all' ? undefined : mode, body: body.length ? body : undefined }), [q, mode, body]);
  const loading = useSimulatedLoad(`${mode}|${body.join()}`, 450);

  const toggle = (b: BodyType) => setBody((cur) => (cur.includes(b) ? cur.filter((x) => x !== b) : [...cur, b]));
  const options = [{ id: 'all' as ModeOpt, label: 'All' }, ...listingModes.map((m) => ({ id: m.id as ModeOpt, label: m.label }))];

  return (
    <Animated.FlatList
      data={loading ? [] : results}
      keyExtractor={(v) => v.id}
      contentContainerStyle={{ paddingTop: insets.top + layout.top, paddingHorizontal: layout.gutter, paddingBottom: layout.tabBar, gap: layout.item }}
      keyboardShouldPersistTaps="handled"
      itemLayoutAnimation={LinearTransition.springify()}
      ListHeaderComponent={
        <View style={{ gap: layout.item, marginBottom: 4 }}>
          <T v="h1">Explore</T>
          <Input label="Search" hideLabel value={q} onChangeText={setQ} placeholder="Make, model or city" returnKeyType="search" />
          <Segmented options={options} value={mode} onChange={setMode} />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{bodyTypes.map((b) => <Chip key={b} label={b} active={body.includes(b)} onPress={() => toggle(b)} />)}</View>
          {!loading && <T v="label" color={colors.text2}>{results.length} vehicle{results.length === 1 ? '' : 's'}</T>}
          {loading && [0, 1].map((i) => <Skeleton key={i} height={250} radius={20} />)}
        </View>
      }
      renderItem={({ item, index }) => <VehicleCard vehicle={item} mode={mode === 'all' ? undefined : mode} index={index} />}
      ListEmptyComponent={loading ? null : <EmptyState icon="search" title="No vehicles found" body="Try a different search or clear a filter." />}
    />
  );
}
