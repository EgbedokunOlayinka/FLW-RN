import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppContext } from '../context/AppContext';
import { StackParamList } from '../types/stack';
import React from 'react';
import LoginScreen from '../screens/Login.screen';
import HomeScreen from '../screens/Home.screen';
import EditScreen from '../screens/Edit.screen';
import CreateScreen from '../screens/Create.screen';

const Stack = createNativeStackNavigator<StackParamList>();

const AppNavigation = () => {
  const { user } = useAppContext();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={user ? 'Home' : 'Login'}
      >
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Edit" component={EditScreen} />
            <Stack.Screen name="Create" component={CreateScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
