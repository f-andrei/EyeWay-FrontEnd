import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import Navbar from '../components/Navbar';
import AdaptiveVideoPlayer from '../components/AdaptiveVideoPlayer';

export default function Live({ navigation }) {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const isWeb = Platform.OS === 'web';
  
  useEffect(() => {
    if (isWeb) {
      const handleResize = () => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        });
      };
      
      window.addEventListener('resize', handleResize);
      handleResize();
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const getVideoDimensions = () => {
    if (isWeb) {
      const maxWidth = Math.min(dimensions.width * 0.99, 750); 
      const maxHeight = dimensions.height * 0.55; 
      const widthBasedHeight = maxWidth * 9 / 16;
      
      return {
        width: maxWidth,
        height: Math.min(widthBasedHeight, maxHeight)
      };
    }
    return {
      width: dimensions.width * 0.9,
      height: (dimensions.width * 0.9) * 9 / 16
    };
  };

  const platform_url = Platform.OS === 'android' ? "http://10.0.2.2:5000/stop-inference" : "http://localhost:5000/stop-inference";

  async function stopTransmission() {
    try {
      await axios.post(platform_url);
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error stopping transmission:', error);
    }
  }

  function goToCamerasList() {
    navigation.navigate('CamerasList');
  }

  const { width: videoWidth, height: videoHeight } = getVideoDimensions();
  const stream_url = "http://172.26.148.170:8085/stream/stream.m3u8";

  return (
    <View style={[
      styles.container,
      isWeb && { minHeight: '100vh' }
    ]}>
      <ScrollView contentContainerStyle={[
        styles.scrollContent,
        isWeb && styles.webScrollContent
      ]}>
        {!isWeb && (
          <View style={styles.containerLogo}>
            <Image 
              source={require('../assets/LogoComNomeCompletoEyeWay.png')} 
              style={styles.logo} 
            />
          </View>
        )}

        <View style={styles.containerDescricao}>
          <Text style={[
            styles.textoTitulo,
            isWeb && styles.webTextoTitulo
          ]}>AO VIVO</Text>
          <Text style={[
            styles.textoSubtitulo,
            isWeb && styles.webTextoSubtitulo
          ]}>Transmissão em tempo real</Text>
        </View>

        <View style={[
          styles.containerVideo,
          isWeb && styles.webContainerVideo,
          { width: videoWidth }
        ]}>
          <AdaptiveVideoPlayer
            source={{ uri: stream_url }}
            style={{
              width: videoWidth,
              height: videoHeight,
              borderRadius: isWeb ? 24 : 10,
            }}
          />
        </View>

        <View style={[
          styles.containerInfo,
          isWeb && styles.webContainerInfo,
          { maxWidth: videoWidth }
        ]}>
          <Text style={[
            styles.infoTexto,
            isWeb && styles.webInfoTexto
          ]}>ID da Câmera: 123456</Text>
          <Text style={[
            styles.infoTexto,
            isWeb && styles.webInfoTexto
          ]}>Local: Rua Estados Unidos, 10</Text>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={[
              styles.botao,
              isWeb && styles.webBotao,
              styles.stopButton
            ]} 
            onPress={stopTransmission}
          >
            <Ionicons name="stop-circle-outline" size={24} color="#FFFFFF" style={styles.buttonIcon} />
            <Text style={styles.textoBotao}>Parar transmissão</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.botao,
              isWeb && styles.webBotao
            ]} 
            onPress={goToCamerasList}
          >
            <Ionicons name="list-outline" size={24} color="#FFFFFF" style={styles.buttonIcon} />
            <Text style={styles.textoBotao}>Lista de câmeras</Text>
          </TouchableOpacity>
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
    justifyContent: 'space-between',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 70,
  },
  webScrollContent: {
    paddingTop: 5,
    paddingBottom: 20,
  },
  containerLogo: {
    alignItems: 'center',
    marginTop: 40,
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
  webTextoTitulo: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 2,
  },
  textoSubtitulo: {
    color: '#FFFFFF',
    fontSize: 18,
    marginTop: 5,
  },
  webTextoSubtitulo: {
    fontSize: 10,
  },
  containerVideo: {
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    borderRadius: 10,
    overflow: 'hidden',
  },
  webContainerVideo: {
    borderRadius: 12,
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)',
    marginBottom: 10,
  },
  containerInfo: {
    backgroundColor: '#2A2A2A',
    padding: 15,
    borderRadius: 10,
    marginBottom: 3,  
    width: '90%',
    alignItems: 'center',
  },
  webContainerInfo: {
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#333',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    marginBottom: 3,
  },
  infoTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 3, 
  },
  webInfoTexto: {
    fontSize: 12,
    marginBottom: 2,  
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 0,  
  },
  botao: {
    backgroundColor: '#114354',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    width: '40%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 4,  
    flexDirection: 'row',
    justifyContent: 'center',
  },
  webBotao: {
    width: '25%',
    paddingVertical: 15,
    marginBottom: 10,
  },
  buttonIcon: {
    marginRight: 8,
  },
  stopButton: {
    backgroundColor: '#8B0000',
  },
  textoBotao: {
    color: '#FFFFFF',
    fontSize: Platform.OS === 'web' ? 18 : 16,
    fontWeight: 'bold',
  },
});