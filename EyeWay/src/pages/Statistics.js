import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { PieChart } from 'react-native-chart-kit'; // Importa o PieChart, forma o grafico de pizza
import Navbar from '../components/Navbar';
import { Dimensions } from 'react-native'; 
//tive que instalar no cmd:
//1 - react-native-chart-kit: Fornece vários tipos de gráficos, incluindo gráficos de pizza.
//2 - react-native-svg: É uma dependência necessária para renderizar gráficos baseados em SVG.

export default function Statistics({ navigation }) {
  // Dados para o gráfico de pizza
  const data = [
    //O gráfico recebe um array data porque essa é a maneira pela qual os dados a serem representados no gráfico são passados. 
    //Cada elemento do array representa uma fatia do gráfico de pizza, e o conteúdo do array determina as informações que serão exibidas.
    { name: 'Infração A', population: 45, color: '#FF6384', legendFontColor: '#FFFFFF', legendFontSize: 15 },
    { name: 'Infração B', population: 25, color: '#36A2EB', legendFontColor: '#FFFFFF', legendFontSize: 15 },
    { name: 'Infração C', population: 30, color: '#FFCE56', legendFontColor: '#FFFFFF', legendFontSize: 15 },
  ];

  // Largura da tela para ajustar o tamanho do gráfico
  const screenWidth = Dimensions.get('window').width;

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
          {/* Gráfico de Pizza */}
          <PieChart
            data={data}
            width={screenWidth - 40} // Defina a largura como a largura da tela menos margem
            height={220} // Altura do gráfico
            chartConfig={{
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            }}
            accessor={"population"} // Campo que será utilizado para o tamanho da fatia
            backgroundColor={"transparent"}
            paddingLeft={"15"}
            absolute // Mostra os valores absolutos no gráfico
          />
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
