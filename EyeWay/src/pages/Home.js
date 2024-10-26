import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput, ScrollView, Platform } from 'react-native';
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
              Envie o link do vídeo (ao vivo ou gravado) para processamento.
              O sistema detectará possíveis infrações e gerará alertas e estatísticas detalhadas para acompanhamento.
            </Text>
          </View>

          <View style={[
            styles.containerInputUrl,
            isWeb && { width: '80%' }
          ]}>
            <Text style={styles.Url}>Envie aqui a URL do vídeo ⭣</Text>
            <Ionicons name="link-outline" size={24} color="#C26015" style={styles.iconeUrl} />
          </View>

          <TextInput 
            style={[
              styles.textoBotaoInputUrl,
              isWeb && styles.webTextoBotaoInputUrl
            ]}
            placeholder='www.youtube.com/seuvideo' 
            placeholderTextColor="#A9A9A9" 
            onChangeText={setUrl} 
            value={url} 
          />
          
          <TouchableOpacity 
            style={[
              styles.botaoEnviar,
              isWeb && styles.webBotaoEnviar
            ]} 
            onPress={uploadVideo}
          >
            <Text style={styles.textoBotaoEnviar}>Enviar</Text>
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
  containerInputUrl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Platform.OS === 'web' ? 10 : 5,
    width: '95%',
    maxWidth: 1000,
  },
  Url: {
    color: '#FFFFFF',
    fontSize: Platform.OS === 'web' ? 20 : 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  iconeUrl: {
    marginLeft: 5,
  },
  textoBotaoInputUrl: {
    backgroundColor: '#114354',
    color: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 15,
    height: 40,
  },
  webTextoBotaoInputUrl: {
    width: '45%',
    flex: 1,
    fontSize: 16,
    height: 30,
    paddingVertical: 5,
  },
  botaoEnviar: {
    backgroundColor: '#114354',
    paddingVertical: 5,
    borderRadius: 5,
    alignItems: 'center',
    width: '40%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
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