import { FC } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { SectionHeader } from '../../components/SectionHeader';
import { colors } from '../../theme/colors';
import { TripRole } from '@myapp/shared';

type Collaborator = {
  id: string;
  name: string;
  contact: string;
  role: TripRole;
};

const collaborators: Collaborator[] = [
  { id: 'c1', name: 'Amani', contact: 'amani@example.com', role: 'owner' },
  { id: 'c2', name: 'Sasha', contact: '+1 555 123 9087', role: 'editor' },
];

export const PeopleScreen: FC = () => (
  <SafeAreaView style={styles.safe}>
    <View style={styles.container}>
      <SectionHeader subtitle="Control access by role">People</SectionHeader>
      <FlatList
        data={collaborators}
        keyExtractor={(person) => person.id}
        renderItem={({ item }) => (
          <View style={styles.personCard}>
            <Text style={styles.personName}>{item.name}</Text>
            <Text style={styles.contact}>{item.contact}</Text>
            <Text style={styles.role}>{item.role.toUpperCase()}</Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </View>
  </SafeAreaView>
);

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
  personCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(102, 228, 255, 0.15)',
  },
  personName: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
  contact: {
    color: colors.textSecondary,
    marginTop: 4,
  },
  role: {
    color: colors.accentSecondary,
    marginTop: 8,
    fontWeight: '600',
  },
});

