import { FC } from 'react';
import { FlatList, SafeAreaView, StyleSheet, View, Text, ActivityIndicator, RefreshControl } from 'react-native';
import { SpotCard, Spot } from '../../components/SpotCard';
import { SectionHeader } from '../../components/SectionHeader';
import { colors } from '../../theme/colors';
import { usePlacesQuery } from './api/usePlacesQuery';

export const ExploreScreen: FC = () => {
  const { data: places, isLoading, error, refetch, isRefetching } = usePlacesQuery();

  const spots: Spot[] =
    places?.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      location: [p.city, p.country].filter(Boolean).join(', ') || 'Unknown',
    })) ?? [];

  if (isLoading && !places) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <SectionHeader subtitle="Discover curated places">Explore</SectionHeader>
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.accent} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <SectionHeader subtitle="Discover curated places">Explore</SectionHeader>
          <View style={styles.center}>
            <Text style={styles.errorText}>Failed to load places</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <SectionHeader subtitle="Discover curated places">Explore</SectionHeader>
        {spots.length === 0 ? (
          <View style={styles.center}>
            <Text style={styles.emptyText}>No places found</Text>
          </View>
        ) : (
          <FlatList
            data={spots}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <SpotCard spot={item} />}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            contentContainerStyle={{ paddingBottom: 48 }}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.accent} />}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
});

