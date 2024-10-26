import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Navbar from '../components/Navbar';
import axios from 'axios';

export default function Home({ navigation }) {
  const [url, setUrl] = useState("");
  const [hlsLive, setHlsLive] = useState(false);
  const platform_url = Platform.OS === 'android' ? "http://10.0.2.2:5000/run-inference" : "http://localhost:5000/run-inference";
  const status_url = Platform.OS === 'android' ? "http://10.0.2.2:5000/stream-status" : "http://localhost:5000/stream-status";

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
    <View style={estilos.container}>
      <View style={estilos.contentContainer}>
        <View style={estilos.containerLogo}>
          <Image
            source={require('../assets/LogoComNomeCompletoEyeWay.png')}
            style={estilos.logo}
          />
        </View>

        <View style={estilos.containerDescricao}>
          <Text style={estilos.textoDescricao}>
            Envie o link do vídeo (ao vivo ou gravado) para processamento.
            O sistema detectará possíveis infrações e gerará alertas e estatísticas detalhadas para acompanhamento.
          </Text>
        </View>

        <View style={estilos.containerInputUrl}>
          <Text style={estilos.Url}>Envie aqui a URL do vídeo ⭣</Text>
          <Ionicons name="link-outline" size={24} color="#C26015" style={estilos.iconeUrl} />
        </View>

        <TextInput 
          style={estilos.textoBotaoInputUrl} 
          placeholder='www.youtube.com/seuvideo' 
          placeholderTextColor="#A9A9A9" 
          onChangeText={setUrl} 
          value={url} 
        />
        
        <TouchableOpacity style={estilos.botaoEnviar} onPress={uploadVideo}>
          <Text style={estilos.textoBotaoEnviar}>Enviar</Text>
        </TouchableOpacity>
      </View>

      <Navbar navigation={navigation} />
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3E3C3C',
    paddingTop: Platform.OS === 'web' ? 110 : 20,
    paddingBottom: Platform.OS === 'web' ? 110 : 20,
    paddingHorizontal: Platform.OS === 'web' ? 10 : 0,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: Platform.OS === 'web' ? 0 : 20,
  },
  containerLogo: {
    alignItems: 'center',
    marginBottom: Platform.OS === 'web' ? 40 : 15,
    width: '100%',
  },
  logo: {
    width: Platform.OS === 'web' ? '30%' : '70%',
    height: Platform.OS === 'web' ? 120 : 100,
    resizeMode: 'contain',
  },
  containerDescricao: {
    backgroundColor: '#3E3C3C',
    padding: Platform.OS === 'web' ? 20 : 15,
    borderRadius: 10,
    marginBottom: Platform.OS === 'web' ? 20 : 15,
    width: Platform.OS === 'web' ? '70%' : '90%',
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
    width: Platform.OS === 'web' ? '80%' : '95%',
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
    paddingVertical: Platform.OS === 'web' ? 10 : 10,
    paddingHorizontal: Platform.OS === 'web' ? 20 : 20,
    borderRadius: 5,
    flex: Platform.OS === 'web' ? 1 : undefined,
    fontSize: Platform.OS === 'web' ? 16 : 14,
    fontWeight: 'bold',
    textAlign: 'center',
    width: Platform.OS === 'web' ? '45%' : '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: Platform.OS === 'web' ? 15 : 15,
    height: Platform.OS === 'web' ? undefined : 40,
  },
  botaoEnviar: {
    backgroundColor: '#114354',
    paddingVertical: Platform.OS === 'web' ? 15 : 5,
    borderRadius: 5,
    alignItems: 'center',
    width: Platform.OS === 'web' ? '25%' : '40%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  textoBotaoEnviar: {
    color: '#FFFFFF',
    fontSize: Platform.OS === 'web' ? 18 : 16,
    fontWeight: 'bold',
  },
});