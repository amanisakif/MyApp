import { FC, useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SectionHeader } from '../../components/SectionHeader';
import { colors } from '../../theme/colors';
import { useTripsQuery } from './api/useTripsQuery';

const formatDateRange = (start: string, end: string) => {
  const formatter = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' });
  return `${formatter.format(new Date(start))} → ${formatter.format(new Date(end))}`;
};

export const TripListScreen: FC = () => {
  const { data, isLoading, isRefetching, refetch, error } = useTripsQuery();

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <SectionHeader subtitle="Plan every detail">Trips</SectionHeader>

        {isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator color={colors.accent} />
            <Text style={styles.loadingText}>Synchronizing trips…</Text>
          </View>
        ) : error ? (
          <View style={styles.center}>
            <Text style={styles.errorText}>Could not load trips.</Text>
            <Text style={styles.errorSub}>Pull to retry.</Text>
          </View>
        ) : (
          <FlatList
            data={data ?? []}
            keyExtractor={(trip) => trip.id}
            renderItem={({ item }) => (
              <View style={styles.tripCard}>
                <Text style={styles.tripName}>{item.title}</Text>
                <Text style={styles.tripMeta}>{formatDateRange(item.startDate, item.endDate)}</Text>
                <Text style={styles.tripMeta}>
                  {item.dayCount} days · {item.memberCount} collaborators
                </Text>
              </View>
            )}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            refreshControl={
              <RefreshControl
                tintColor={colors.accent}
                refreshing={isRefetching}
                onRefresh={handleRefresh}
              />
            }
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={styles.empty}>Create your first trip to start planning.</Text>
            }
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
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loadingText: {
    color: colors.textSecondary,
  },
  errorText: {
    color: colors.accentSecondary,
    fontWeight: '600',
  },
  errorSub: {
    color: colors.textSecondary,
  },
  tripCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.2)',
  },
  tripName: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
  tripMeta: {
    color: colors.textSecondary,
    marginTop: 4,
  },
  empty: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 48,
  },
});

