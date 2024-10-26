import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Navbar from '../components/Navbar';
import axios from 'axios';

export default function Home({ navigation }) {
  const [url, setUrl] = useState("");
  const [hlsLive, setHlsLive] = useState(false);
  const platform_url = Platform.OS === 'android' ? "http://10.0.2.2:5000/run-inference" : "http://localhost:5000/run-inference";
  const status_url = Platform.OS === 'android' ? "http://10.0.2.2:5000/stream-status" : "http://localhost:5000/stream-status";
  const isWeb = Platform.OS === 'web';

  async function uploadVideo() {
    const payload = {
      source: url,
      input_type: "yt_stream"
    };
    await axios.post(platform_url, payload);
    checkStreamStatus();
  }

  async function checkStreamStatus() {
    const interval = setInterval(async () => {
      const response = await axios.get(status_url);
      if (response.data.hls_live) {
        clearInterval(interval);
        setHlsLive(true);
        navigation.navigate('Live');
      }
    }, 1000);
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[
          styles.contentWrapper,
          isWeb && styles.webContentWrapper
        ]}>
          {!isWeb && (
            <View style={styles.containerLogo}>
              <Image 
                source={require('../assets/LogoComNomeCompletoEyeWay.png')} 
                style={styles.logo} 
              />
            </View>
          )}

          <View style={[
            styles.containerDescricao,
            isWeb && { width: '70%', marginTop: 40 }
          ]}>
            <Text style={styles.textoDescricao}>
              Lista de cameras já cadastradas
            </Text>
          </View>

          <View style={[
            styles.card,
            isWeb && { width: '80%' }
          ]}>
            <View style={styles.cardHeader}>
              <Ionicons name="camera" size={24} color="#FF9C11" style={styles.cameraIcon} />
              <Text style={styles.cameraId}>ID da Câmera: #</Text>
            </View>

            <Text style={styles.cameraType}>Tipo de Câmera: Segurança</Text>

            <Image
              source={require('../assets/carros.jpg')}
              style={styles.cameraImagem}
            />

            <Text style={styles.cameraLocalizacao}>Local da Câmera: TAMARANA RUA DOS BOBOS 23</Text>
            <Text style={styles.descricao}>
              Descrição: Esta câmera está localizada em uma área movimentada e monitora o tráfego.
            </Text>

            <TouchableOpacity 
            style={[
              styles.BotaoReproduzir,
              isWeb && styles.webBotaoEnviar
            ]} 
          >
            <Text style={styles.textoBotaoEnviar}>Reproduzir</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.BotaoExcluir,
              isWeb && styles.webBotaoEnviar
            ]} 
          >
            <Text style={styles.textoBotaoEnviar}>Excluir Camera</Text>
          </TouchableOpacity>
          </View>
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
  contentWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  webContentWrapper: {
    maxWidth: 800,
    width: '99%',
    paddingHorizontal: 0,
  },
  containerLogo: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
    width: '100%',
  },
  card: {
    backgroundColor: '#1E1E1E',
    padding: 20,
    borderRadius: 15,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  cameraIcon: {
    marginRight: 10,
  },
  cameraId: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  cameraType: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 15,
  },
  cameraImagem: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 15,
  },
  cameraLocalizacao: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  descricao: {
    fontSize: 14,
    color: '#AAAAAA',
    textAlign: 'center',
  },
  logo: {
    width: '80%',
    height: 120,
    resizeMode: 'contain',
  },
  containerDescricao: {
    backgroundColor: '#3E3C3C',
    padding: Platform.OS === 'web' ? 20 : 15,
    borderRadius: 10,
    marginBottom: Platform.OS === 'web' ? 20 : 15,
    width: '90%',
    maxWidth: 800,
  },
  textoDescricao: {
    color: '#FFFFFF',
    fontSize: Platform.OS === 'web' ? 20 : 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '85%',
    marginTop: 10,
  },
  BotaoReproduzir: {
    backgroundColor: '#FF9C11',
    borderRadius: 5,
    width: '100%',
    paddingVertical: 7,
    alignItems: 'center',
    marginTop: 10,
  },
  BotaoExcluir: {
    backgroundColor: '#e63946',
    borderRadius: 5,
    width: '100%',
    paddingVertical: 7,
    alignItems: 'center',
    marginTop: 10,
  },
  webBotaoEnviar: {
    width: '25%',
    paddingVertical: 15,
  },
  textoBotaoEnviar: {
    color: '#FFFFFF',
    fontSize: Platform.OS === 'web' ? 18 : 16,
    fontWeight: 'bold',
  },
});
