import { useState, useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {
  APP_NAME,
  MOCK_VEHICLES,
  filterVehicles,
  formatPrice,
  getVehicleById,
  type ListingType,
  type Vehicle,
} from '@ridewithme/shared';

const FILTER_TABS: { label: string; value: ListingType | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Buy', value: 'buy' },
  { label: 'Rent', value: 'rent' },
  { label: 'Lease', value: 'lease' },
  { label: 'Auction', value: 'auction' },
];

const ACTION_LABEL: Record<ListingType, string> = {
  buy: 'Buy Now',
  rent: 'Rent This',
  lease: 'Lease This',
  auction: 'Place Bid',
};

function VehicleCard({ vehicle, onPress }: { vehicle: Vehicle; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Image source={{ uri: vehicle.imageUrl }} style={styles.cardImage} />
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>
          {vehicle.year} {vehicle.make} {vehicle.model}
        </Text>
        <Text style={styles.cardPrice}>{formatPrice(vehicle.price, vehicle.listingType)}</Text>
        <Text style={styles.cardMeta}>
          {vehicle.mileage.toLocaleString()} mi · {vehicle.location}
        </Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{vehicle.listingType}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function DetailScreen({ vehicle, onBack }: { vehicle: Vehicle; onBack: () => void }) {
  return (
    <ScrollView style={styles.safeArea} contentContainerStyle={{ paddingBottom: 32 }}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn}>
        <Text style={styles.backText}>← Back to marketplace</Text>
      </TouchableOpacity>
      <Image source={{ uri: vehicle.imageUrl }} style={styles.detailImage} />
      <View style={styles.detailBody}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{vehicle.listingType}</Text>
        </View>
        <Text style={styles.detailTitle}>
          {vehicle.year} {vehicle.make} {vehicle.model}
        </Text>
        <Text style={styles.detailPrice}>{formatPrice(vehicle.price, vehicle.listingType)}</Text>

        <View style={styles.specGrid}>
          <View style={styles.spec}>
            <Text style={styles.specLabel}>Mileage</Text>
            <Text style={styles.specValue}>{vehicle.mileage.toLocaleString()} mi</Text>
          </View>
          <View style={styles.spec}>
            <Text style={styles.specLabel}>Location</Text>
            <Text style={styles.specValue}>{vehicle.location}</Text>
          </View>
          <View style={styles.spec}>
            <Text style={styles.specLabel}>Year</Text>
            <Text style={styles.specValue}>{vehicle.year}</Text>
          </View>
          <View style={styles.spec}>
            <Text style={styles.specLabel}>Type</Text>
            <Text style={styles.specValue}>{vehicle.listingType}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionBtnText}>{ACTION_LABEL[vehicle.listingType]}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export default function App() {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<ListingType | 'all'>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const vehicles = useMemo(() => {
    return filterVehicles(MOCK_VEHICLES, {
      query: query || undefined,
      listingType: activeFilter === 'all' ? undefined : activeFilter,
    });
  }, [query, activeFilter]);

  const selectedVehicle = selectedId ? getVehicleById(MOCK_VEHICLES, selectedId) : undefined;

  if (selectedVehicle) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <DetailScreen vehicle={selectedVehicle} onBack={() => setSelectedId(null)} />
        <StatusBar style="light" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>{APP_NAME}</Text>
        <TextInput
          style={styles.search}
          placeholder="Search make, model, year..."
          placeholderTextColor="#888"
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <View style={styles.tabsRow}>
        {FILTER_TABS.map((tab) => (
          <TouchableOpacity
            key={tab.value}
            style={[styles.tab, activeFilter === tab.value && styles.tabActive]}
            onPress={() => setActiveFilter(tab.value)}
          >
            <Text style={[styles.tabText, activeFilter === tab.value && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={vehicles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <VehicleCard vehicle={item} onPress={() => setSelectedId(item.id)} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No vehicles match your search.</Text>}
      />
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f1115',
  },
  header: {
    padding: 16,
    gap: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#e63946',
  },
  search: {
    backgroundColor: '#1a1d23',
    borderWidth: 1,
    borderColor: '#2a2d34',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#f2f2f2',
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 12,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#2a2d34',
    backgroundColor: '#1a1d23',
  },
  tabActive: {
    backgroundColor: '#e63946',
    borderColor: '#e63946',
  },
  tabText: {
    color: '#ccc',
    fontSize: 13,
  },
  tabTextActive: {
    color: '#fff',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12,
  },
  card: {
    backgroundColor: '#1a1d23',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2a2d34',
    overflow: 'hidden',
    marginBottom: 12,
  },
  cardImage: {
    width: '100%',
    height: 160,
  },
  cardBody: {
    padding: 12,
  },
  cardTitle: {
    color: '#f2f2f2',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardPrice: {
    color: '#e63946',
    fontWeight: '600',
    marginBottom: 2,
  },
  cardMeta: {
    color: '#999',
    fontSize: 12,
    marginBottom: 8,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#2a2d34',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  badgeText: {
    color: '#ccc',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  empty: {
    color: '#888',
    textAlign: 'center',
    marginTop: 40,
  },
  backBtn: {
    padding: 16,
  },
  backText: {
    color: '#999',
    fontSize: 14,
  },
  detailImage: {
    width: '100%',
    height: 260,
  },
  detailBody: {
    padding: 16,
    gap: 6,
  },
  detailTitle: {
    color: '#f2f2f2',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 8,
  },
  detailPrice: {
    color: '#e63946',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  specGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  spec: {
    width: '47%',
    backgroundColor: '#1a1d23',
    borderWidth: 1,
    borderColor: '#2a2d34',
    borderRadius: 10,
    padding: 12,
    gap: 4,
  },
  specLabel: {
    color: '#999',
    fontSize: 11,
    textTransform: 'uppercase',
  },
  specValue: {
    color: '#f2f2f2',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  actionBtn: {
    backgroundColor: '#e63946',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
