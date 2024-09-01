import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from '../pages/Home'; 
import Live from '../pages/Live'; 

const Stack = createStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="Live" component={Live} options={{ headerShown: false }} />
        {/*adicionar outras telas aqui quando criar, seguindo o modelo acima*/}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
