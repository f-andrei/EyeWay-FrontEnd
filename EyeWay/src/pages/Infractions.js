import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import Navbar from '../components/Navbar';

export default function Infractions({ navigation }) {
  return (
    <View style={estilos.container}>
      <ScrollView contentContainerStyle={estilos.scrollContent}>
        <View style={estilos.containerLogo}>
          <Image 
            source={require('../assets/LogoComNomeCompletoEyeWay.png')} 
            style={estilos.logo} 
          />
        </View>

        <View style={estilos.containerDescricao}>
          <Text style={estilos.textoTitulo}>Alertas de Infração</Text>
          <Text style={estilos.textoSubtitulo}>Imagens capturadas com possíveis infrações</Text>
        </View>

        <View style={estilos.containerImagens}>
          <View style={estilos.imagemWrapper}>
            {/*adicionar imagens capturadas ou algo do tipo aqui*/}
          </View>
        </View>
      </ScrollView>

      <Navbar navigation={navigation} />
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3E3C3C',
    justifyContent: 'space-between',
  },
  scrollContent: {
    flexGrow: 1, // ajusta o scrollView expandindo e preenchendo o espaço
    alignItems: 'center',
    paddingBottom: 70, 
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
  textoSubtitulo: {
    color: '#FFFFFF',
    fontSize: 18,
    marginTop: 5,
  },
  containerImagens: {
    width: '90%',
    alignItems: 'center',
  },
  imagemWrapper: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#000000',
  },
  imagem: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 10,
  },
});
