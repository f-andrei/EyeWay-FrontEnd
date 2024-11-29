import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function Navbar({ navigation }) {
  const isWeb = Platform.OS === 'web';

  return (
    <View style={[
      estilos.navbar,
      isWeb ? estilos.webNavbar : estilos.mobileNavbar
    ]}>
      {isWeb && (
        <View style={estilos.logoContainer}>
          <Image
            source={require('../assets/LogoComNomeCompletoEyeWay.png')}
            style={estilos.webLogo}
          />
        </View>
      )}

      <TouchableOpacity
        onPress={() => navigation.navigate('Home')}
        style={[
          estilos.navItem,
          isWeb && estilos.webNavItem,
        ]}
      >
        <View style={estilos.webIconContainer}>
          <Ionicons
            name="home-outline"
            size={isWeb ? 21 : 30}
            color="white"
          />
        </View>
        <Text style={[
          estilos.navTexto,
          isWeb && estilos.webNavTexto
        ]}>Início</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Live')}
        style={[
          estilos.navItem,
          isWeb && estilos.webNavItem,
        ]}
      >
        <View style={estilos.webIconContainer}>
          <Ionicons
            name="videocam-outline"
            size={isWeb ? 21 : 30}
            color="white"
          />
        </View>
        <Text style={[
          estilos.navTexto,
          isWeb && estilos.webNavTexto
        ]}>Ao Vivo</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Infractions')}
        style={[
          estilos.navItem,
          isWeb && estilos.webNavItem,
        ]}
      >
        <View style={estilos.webIconContainer}>
          <Ionicons
            name="warning-outline"
            size={isWeb ? 21 : 30}
            color="white"
          />
        </View>
        <Text style={[
          estilos.navTexto,
          isWeb && estilos.webNavTexto
        ]}>Alertas</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Operations')}
        style={[
          estilos.navItem,
          isWeb && estilos.webNavItem,
        ]}
      >
        <View style={estilos.webIconContainer}>
        <AntDesign name="enviroment" size={isWeb ? 21:30} color="white" />
        </View>
        <Text style={[
          estilos.navTexto,
          isWeb && estilos.webNavTexto
        ]}>Operações</Text>
      </TouchableOpacity>


      <TouchableOpacity
        onPress={() => navigation.navigate('Statistics')}
        style={[
          estilos.navItem,
          isWeb && estilos.webNavItem,
        ]}
      >
        <View style={estilos.webIconContainer}>
          <Ionicons
            name="stats-chart-outline"
            size={isWeb ? 21 : 30}
            color="white"
          />
        </View>
        <Text style={[
          estilos.navTexto,
          isWeb && estilos.webNavTexto
        ]}>Estatísticas</Text>
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  navbar: {
    backgroundColor: '#114354',
    borderColor: '#FFFFFF',
    zIndex: 1000,
  },
  mobileNavbar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
  },
  webNavbar: {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRightWidth: 1,
    width: 190,
    minWidth: 130,
    overflowY: 'auto',
    overflowX: 'hidden',
    boxShadow: '2px 0 8px rgba(0, 0, 0, 0.2)',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  webLogo: {
    width: 170,
    height: 90,
    resizeMode: 'contain',
    backgroundColor: '#2C2F4D',
    borderRadius: 8,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
  },
  webIconContainer: {
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webNavItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    width: '100%',
    marginVertical: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    transition: 'transform 0.3s ease, background-color 0.3s ease',
  },
  navTexto: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
  },
  webNavTexto: {
    fontSize: 12,
    marginTop: 0,
    marginLeft: 10,
    letterSpacing: 0.5,
    fontWeight: '600',
  },
});