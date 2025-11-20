import { FC } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View, ActivityIndicator, RefreshControl } from 'react-native';
import { SpotCard, Spot } from '../../components/SpotCard';
import { SectionHeader } from '../../components/SectionHeader';
import { colors } from '../../theme/colors';
import { useFavoritesQuery } from './api/useFavoritesQuery';

export const FavoritesScreen: FC = () => {
  const { data: favorites, isLoading, error, refetch, isRefetching } = useFavoritesQuery();

  const spots: Spot[] =
    favorites?.map((f) => ({
      id: f.place.id,
      name: f.place.name,
      category: f.place.category,
      location: [f.place.city, f.place.country].filter(Boolean).join(', ') || 'Unknown',
      isFavorite: true,
    })) ?? [];

  if (isLoading && !favorites) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <SectionHeader subtitle="Quick drop for your obsessions">Favorites</SectionHeader>
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
          <SectionHeader subtitle="Quick drop for your obsessions">Favorites</SectionHeader>
          <View style={styles.center}>
            <Text style={styles.errorText}>Failed to load favorites</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <SectionHeader subtitle="Quick drop for your obsessions">Favorites</SectionHeader>
        {spots.length === 0 ? (
          <View style={styles.center}>
            <Text style={styles.empty}>Save a spot to see it here.</Text>
          </View>
        ) : (
          <FlatList
            data={spots}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <SpotCard spot={item} />}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
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
  empty: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 32,
  },
  errorText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
});

