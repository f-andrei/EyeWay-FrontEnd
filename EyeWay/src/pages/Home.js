import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Navbar from '../components/Navbar';
import axios from 'axios';

export default function Home({ navigation }) {
  const [url, setUrl] = useState();
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
      <View>
        <TextInput style={estilos.textoBotaoInputUrl} placeholder='www.youtube.com/seuvideo' placeholderTextColor="#A9A9A9" onChangeText={setUrl} value={url} />
      </View>
      <TouchableOpacity style={estilos.botaoEnviar} onPress={uploadVideo}>
        <Text style={estilos.textoBotaoEnviar}>Enviar</Text>
      </TouchableOpacity>

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
    backgroundColor: '#3E3C3C',
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
    width: '90%',
  },
  textoDescricao: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  containerInputUrl: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  Url: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  iconeUrl: {
    marginLeft: 5,
  },
  botaoInputUrl: {
    backgroundColor: '#114354',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '90%',
    marginBottom: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  textoBotaoInputUrl: {
    backgroundColor: '#114354',
    color: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 5,
    width: '100%',
    marginBottom: 40,
    fontSize: 14,
    fontWeight: 'bold',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  botaoEnviar: {
    backgroundColor: '#114354',
    paddingVertical: 15,
    borderRadius: 5,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 140,
  },
  textoBotaoEnviar: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
