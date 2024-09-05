import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import Navbar from '../components/Navbar';

export default function Statistics({ navigation }) {
  // adicionar dados para o gráfico
  const data = [
    // arrumar depois
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.containerLogo}>
          <Image 
            source={require('../assets/LogoComNomeCompletoEyeWay.png')} 
            style={styles.logo} 
          />
        </View>

        <View style={styles.containerDescricao}>
          <Text style={styles.textoTitulo}>Estatísticas</Text>
          <Text style={styles.textoSubtitulo}>Distribuição das Infrações</Text>
        </View>

        <View style={styles.containerGrafico}>
          {/* adicionar o gráfico */}
          <Text style={styles.textoInformativo}>Gráfico será exibido aqui.</Text>
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
  containerGrafico: {
    width: '90%',
    alignItems: 'center',
    marginBottom: 20,
  },
  textoInformativo: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
});
