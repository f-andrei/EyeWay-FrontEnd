import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from '../pages/Home'; 
import Live from '../pages/Live'; 
import Infractions from '../pages/Infractions'; 
import Statistics from '../pages/Statistics'; 

const Stack = createStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="Live" component={Live} options={{ headerShown: false }} />
        <Stack.Screen name="Infractions" component={Infractions} options={{ headerShown: false }} />
        <Stack.Screen name="Statistics" component={Statistics} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

