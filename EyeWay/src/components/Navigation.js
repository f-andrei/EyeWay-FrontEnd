import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from '../pages/Home'; 
import Live from '../pages/Live'; 
import Infractions from '../pages/Infractions'; 
import Statistics from '../pages/Statistics'; 
import Login from '../pages/Login';
import { useStore } from '../store/globalStore';
import SignUp from '../pages/SignUp';
import CamerasList from '../pages/CamerasList'
import RegisterCamera from '../pages/RegisterCamera';
import HelpGuide from '../components/HelpGuide';
import Perfil from '../pages/Perfil';
import UpdateCamera from '../pages/UpdateCamera';
import UpdatePerfil from '../pages/UpdatePerfil';
import Operations from '../pages/Operations';
import ManualInfractionsScreen from '../pages/ManualInfractions';

const Stack = createStackNavigator();

export default function Navigation() {
  const { isAuthenticated  } = useStore();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isAuthenticated ? "Home" : "Login"}>
        {!isAuthenticated ? (
        <> 
        <Stack.Screen name='SignUp' component={SignUp} options={{ headerShown: false}} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        </>
        ) : (
        <>
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="Live" component={Live} options={{ headerShown: false }} />
        <Stack.Screen name="Infractions" component={Infractions} options={{ headerShown: false }} />
        <Stack.Screen name="Statistics" component={Statistics} options={{ headerShown: false }} />
        <Stack.Screen name="Perfil" component={Perfil} options={{ headerShown: false }} />
        <Stack.Screen name='RegisterCamera' component={RegisterCamera} options={{ headerShown: false }} />
        <Stack.Screen name='CamerasList' component={CamerasList} options={{ headerShown: false }} />
        <Stack.Screen name='HelpGuide' component={HelpGuide} options={{ headerShown: false }} />
        <Stack.Screen name='UpdateCamera' component={UpdateCamera} options={{ headerShown: false }} />
        <Stack.Screen name='UpdatePerfil' component={UpdatePerfil} options={{ headerShown: false }} />
        <Stack.Screen name='Operations' component={Operations} options={{ headerShown: false}} />
        <Stack.Screen name='ManualInfractions' component={ManualInfractionsScreen} options={{ headerShown: false}} />
        </>
        
    )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

