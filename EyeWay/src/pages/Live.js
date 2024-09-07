import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { Video } from 'expo-av';
import Navbar from '../components/Navbar';

export default function Live({ navigation }) {
  const videoWidth = Dimensions.get('window').width * 0.9;
  const videoHeight = videoWidth * 9 / 16;

  return (
    <View style={styles.container}>
      <View style={styles.containerLogo}>
        <Image
          source={require('../assets/LogoComNomeCompletoEyeWay.png')}
          style={styles.logo}
        />
      </View>

      <View style={styles.containerDescricao}>
        <Text style={styles.textoTitulo}>AO VIVO</Text>
        <Text style={styles.textoSubtitulo}>Transmissão em tempo real</Text>
      </View>

      <View style={styles.containerVideo}>
        <Video
          source={{ uri: 'http://10.0.2.2:8085/stream.m3u8' }}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode="contain"
          shouldPlay
          isLooping
          useNativeControls
          style={{ width: videoWidth, height: videoHeight }}
        />
      </View>

      <View style={styles.containerInfo}>
        <Text style={styles.infoTexto}>ID da Câmera: 123456</Text>
        <Text style={styles.infoTexto}>Local: Rua Estados Unidos, 10</Text>
      </View>

      <Navbar navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
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
