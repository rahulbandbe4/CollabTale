import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen, LoginScreen, RegisterScreen, WelcomeScreen, ContributionScreen, ProfileScreen, SplashScreen } from './screens';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Icon from 'react-native-vector-icons/Ionicons'
import { Provider } from 'react-redux';
import Store from './redux-store/store';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MyTab = () => {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, size, color }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = focused
            ? 'home'
            : 'home-outline';
        } else if (route.name === 'Contribution') {
          iconName = focused ? 'add-circle' : 'add-circle-outline';
        }
        else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#FFA500',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: {
      },
    })}>
      <Tab.Screen name='Home' component={HomeScreen} />
      <Tab.Screen name='Contribution' component={ContributionScreen} />
      <Tab.Screen name='Profile' component={ProfileScreen} />
    </Tab.Navigator >
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Provider store={Store}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
          <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          <Stack.Screen name="HomeScreen" component={MyTab} />
        </Stack.Navigator>
      </Provider>
    </NavigationContainer>
  )
}

export default App