import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Navbar({ navigation }) {
  return (
    <View style={estilos.navbar}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')} style={estilos.navItem}>
        <Ionicons name="home-outline" size={30} color="white" />
        <Text style={estilos.navTexto}>Início</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Live')} style={estilos.navItem}>
        <Ionicons name="videocam-outline" size={30} color="white" />
        <Text style={estilos.navTexto}>Ao Vivo</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Infractions')} style={estilos.navItem}>
        <Ionicons name="warning-outline" size={30} color="white" />
        <Text style={estilos.navTexto}>Alertas</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Statistics')} style={estilos.navItem}>
        <Ionicons name="stats-chart-outline" size={30} color="white" />
        <Text style={estilos.navTexto}>Estatísticas</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={estilos.navItem}>
        <Ionicons name="stats-chart-outline" size={30} color="white" />
        <Text style={estilos.navTexto}>Log</Text>
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#114354',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#FFFFFF',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  navItem: {
    alignItems: 'center',
  },
  navTexto: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
  },
});
