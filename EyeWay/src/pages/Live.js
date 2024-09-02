import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Navbar from '../components/Navbar';

export default function Live({ navigation }) {
  return (
    <View style={estilos.container}>
      <View style={estilos.containerLogo}>
        <Image 
          source={require('../assets/LogoComNomeCompletoEyeWay.png')} 
          style={estilos.logo} 
        />
      </View>

      <View style={estilos.containerDescricao}>
        <Text style={estilos.textoTitulo}>AO VIVO</Text>
        <Text style={estilos.textoSubtitulo}>Transmissão em tempo real</Text>
      </View>

      <View style={estilos.containerVideo}>
        <Text style={estilos.textoVideo}>Espaço para o vídeo da câmera</Text>
        <TouchableOpacity style={estilos.iconeRotacao}>
          <Ionicons name="rotate-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={estilos.containerInfo}>
        <Text style={estilos.infoTexto}>ID da Câmera: 123456</Text>
        <Text style={estilos.infoTexto}>Local: Rua Estados Unidos, 10</Text>
      </View>

      <Navbar navigation={navigation} />
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3E3C3C',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 40,
    paddingBottom: 70, 
  },
  containerLogo: {
    alignItems: 'center',
    marginBottom: 30,
    width: '100%',
  },
  logo: {
    width: '80%',
    height: 120, 
    resizeMode: 'contain',
  },
  containerDescricao: {
    marginBottom: 20,
    width: '90%',
    alignItems: 'center',
  },
  textoTitulo: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  textoSubtitulo: {
    color: '#FFFFFF',
    fontSize: 18,
    marginTop: 5,
  },
  containerVideo: {
    backgroundColor: '#000000',
    width: '90%',
    height: 200, 
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
    position: 'relative',
  },
  textoVideo: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconeRotacao: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#114354',
    borderRadius: 25,
    padding: 5,
  },
  containerInfo: {
    backgroundColor: '#3E3C3C',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    width: '90%',
    alignItems: 'center',
  },
  infoTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 10,
  },
});
