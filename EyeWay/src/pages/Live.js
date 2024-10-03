import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Video } from 'expo-av';
import Navbar from '../components/Navbar';

export default function Live({ navigation }) {
  const videoWidth = Dimensions.get('window').width * 0.9;
  const videoHeight = videoWidth * 9 / 16;
  const stream_url = "http://172.26.148.170:8085/stream/stream.m3u8";

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
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
            source={{ uri: stream_url }}
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
      </ScrollView>
      <Navbar navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3E3C3C',
  },
  scrollContainer: {
    flexGrow: 1, 
    alignItems: 'center',
    justifyContent: 'flex-start',  
    paddingVertical: 40,
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
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    backgroundColor: '#000',
    borderRadius: 10,
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: undefined,
    aspectRatio: 16 / 9,  
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
