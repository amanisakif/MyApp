import { FC } from 'react';
import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native';
import { SpotCard, Spot } from '../../components/SpotCard';
import { SectionHeader } from '../../components/SectionHeader';
import { colors } from '../../theme/colors';

const mockSpots: Spot[] = [
  { id: '1', name: 'Skyline Rooftop', category: 'Coffee', location: 'Bangkok' },
  { id: '2', name: 'Lotus Night Market', category: 'Attraction', location: 'Chiang Mai' },
  { id: '3', name: 'Azure Bay Hotel', category: 'Hotel', location: 'Phuket' },
];

export const ExploreScreen: FC = () => {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <SectionHeader subtitle="Discover curated places">Explore</SectionHeader>
        <FlatList
          data={mockSpots}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <SpotCard spot={item} />}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          contentContainerStyle={{ paddingBottom: 48 }}
          showsVerticalScrollIndicator={false}
        />
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
});

