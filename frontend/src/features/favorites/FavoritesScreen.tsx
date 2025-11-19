import { FC } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { SpotCard, Spot } from '../../components/SpotCard';
import { SectionHeader } from '../../components/SectionHeader';
import { colors } from '../../theme/colors';

const favorites: Spot[] = [
  { id: 'f1', name: 'Botanical Sphere', category: 'Attraction', location: 'Singapore' },
  { id: 'f2', name: 'Noir Coffee Lab', category: 'Coffee', location: 'Seoul' },
];

export const FavoritesScreen: FC = () => {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <SectionHeader subtitle="Quick drop for your obsessions">Favorites</SectionHeader>
        {favorites.length === 0 ? (
          <Text style={styles.empty}>Save a spot to see it here.</Text>
        ) : (
          <FlatList
            data={favorites}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <SpotCard spot={item} />}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            showsVerticalScrollIndicator={false}
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
  empty: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 32,
  },
});

