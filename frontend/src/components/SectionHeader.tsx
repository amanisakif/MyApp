import { FC, PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

type SectionHeaderProps = PropsWithChildren<{
  subtitle?: string;
}>;

export const SectionHeader: FC<SectionHeaderProps> = ({ children, subtitle }) => (
  <View style={styles.container}>
    <Text style={styles.title}>{children}</Text>
    {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '600',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
  },
});

