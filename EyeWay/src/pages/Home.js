import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import Navbar from '../components/Navbar'; 

export default function Home({ navigation }) {
  return (
    <View style={estilos.container}>
      <View style={estilos.logoContainer}>
        <Image 
          source={require('../assets/LogoComNomeCompletoEyeWay.png')} 
          style={estilos.logo} 
        />
      </View>

      <View style={estilos.conteudo}>
        <View style={estilos.linkContainer}>
          <Text style={estilos.linkTexto}>Envie aqui a URL do vídeo</Text>
          <Ionicons name="link-outline" size={24} color="#C26015" /> 
        </View>

        <TouchableOpacity style={estilos.linkBotao}>
          <Text style={estilos.textoLinkBotao}>www.youtube.com/seuvideo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={estilos.botao}>
          <Text style={estilos.textoBotao}>Enviar</Text>
        </TouchableOpacity>
      </View>

      <Navbar navigation={navigation} />
    </View>
  );
}

// Pega a largura e altura da tela do dispositivo
// Agora você pode usar `width` e `height` para fazer o design do seu app se ajustar ao tamanho da tela
// Por exemplo, definir a largura de um botão com o (`width * 0.9`) faz com que ele ocupe 90% da largura da tela
const { width, height } = Dimensions.get('window');

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3E3C3C',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'flex-start', 
    alignItems: 'center',
    marginTop: 50,  
    width: '100%',
  },
  logo: {
    width: width * 0.8,
    height: height * 0.18, 
    resizeMode: 'contain',
  },
  conteudo: {
    flex: 2, 
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  linkTexto: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10, 
  },
  linkBotao: {
    backgroundColor: '#114354',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: width * 0.9, 
    marginBottom: 50, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  textoLinkBotao: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  botao: {
    backgroundColor: '#114354',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 5,
    width: width * 0.9, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 30, 
  },
  textoBotao: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
