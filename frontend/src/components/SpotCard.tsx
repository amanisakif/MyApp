import { FC } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { colors } from '../theme/colors';

export type Spot = {
  id: string;
  name: string;
  category: string;
  location: string;
  isFavorite?: boolean;
};

type SpotCardProps = {
  spot: Spot;
};

export const SpotCard: FC<SpotCardProps> = ({ spot }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.category}>{spot.category.toUpperCase()}</Text>
      <Text style={styles.name}>{spot.name}</Text>
      <Text style={styles.location}>{spot.location}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(102, 228, 255, 0.15)',
  },
  category: {
    color: colors.accent,
    fontSize: 12,
    letterSpacing: 1,
  },
  name: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
  location: {
    color: colors.textSecondary,
    fontSize: 14,
  },
});

