import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, ScrollView, Platform } from 'react-native';
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
      const maxWidth = Math.min(dimensions.width * 0.99, 800); 
      const maxHeight = dimensions.height * 0.85;
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
    paddingTop: 10,
    paddingBottom: 30,
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
    marginBottom: 20,
  },
  containerInfo: {
    backgroundColor: '#3E3C3C',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    width: '90%',
    alignItems: 'center',
  },
  webContainerInfo: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#333',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
  infoTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 10,
  },
  webInfoTexto: {
    fontSize: 12,
    marginBottom: 4,
  },
});