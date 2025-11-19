import { NavigationContainer, DefaultTheme, Theme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ExploreScreen } from '../features/explore/ExploreScreen';
import { TripListScreen } from '../features/trips/TripListScreen';
import { FavoritesScreen } from '../features/favorites/FavoritesScreen';
import { PeopleScreen } from '../features/people/PeopleScreen';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();

const futuristicTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    primary: colors.accent,
    card: colors.card,
    text: colors.textPrimary,
    border: 'rgba(255,255,255,0.1)',
    notification: colors.accentSecondary,
  },
};

const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
  Explore: 'planet-outline',
  Trips: 'calendar-outline',
  Favorites: 'heart-outline',
  People: 'people-outline',
};

export const AppNavigator = () => (
  <NavigationContainer theme={futuristicTheme}>
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: 'rgba(255,255,255,0.05)',
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarIcon: ({ color, size }) => {
          const iconName = iconMap[route.name] ?? 'ellipse-outline';
          return <Ionicons name={iconName} color={color} size={size} />;
        },
      })}
    >
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Trips" component={TripListScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="People" component={PeopleScreen} />
    </Tab.Navigator>
  </NavigationContainer>
);

