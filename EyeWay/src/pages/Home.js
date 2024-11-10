import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Navbar from '../components/Navbar';
import Perfil from './Perfil';

export default function Home({ navigation }) {
  const isWeb = Platform.OS === 'web';

  function CamerasListPage(){
    navigation.navigate('CamerasList');
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
            styles.welcomeContainer,
            isWeb && { width: '70%', marginTop: 40 }
          ]}>
            <Text style={styles.welcomeTitle}>Bem-vindo ao EyeWay</Text>
            <Text style={styles.welcomeSubtitle}>Sistema de Monitoramento Inteligente</Text>
          </View>

          <View style={styles.featuresContainer}>
            <View style={styles.featureCard}>
              <Ionicons name="videocam-outline" size={32} color="#C26015" />
              <Text style={styles.featureTitle}>Monitoramento em Tempo Real</Text>
              <Text style={styles.featureDescription}>
                Visualize todas as câmeras cadastradas em tempo real com detecção inteligente.
              </Text>
            </View>

            <View style={styles.featureCard}>
              <Ionicons name="alert-circle-outline" size={32} color="#C26015" />
              <Text style={styles.featureTitle}>Capturas de Infrações</Text>
              <Text style={styles.featureDescription}>
                Visualize os veículos infratores, local e horário da ocorrência.
              </Text>
            </View>

            <View style={styles.featureCard}>
              <Ionicons name="analytics-outline" size={32} color="#C26015" />
              <Text style={styles.featureTitle}>Análise Estatística</Text>
              <Text style={styles.featureDescription}>
                Acesse relatórios detalhados e estatísticas sobre as ocorrências registradas.
              </Text>
            </View>
          </View>

          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={[
                styles.botaoAcao,
                isWeb && styles.webBotaoAcao
              ]} 
              onPress={() => navigation.navigate('RegisterCamera')}
            >
              <Ionicons name="add-circle-outline" size={24} color="#FFFFFF" style={styles.buttonIcon} />
              <Text style={styles.textoBotaoAcao}>Cadastrar câmera</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.botaoAcao,
                isWeb && styles.webBotaoAcao
              ]} 
              onPress={CamerasListPage}
            >
              <Ionicons name="list-outline" size={24} color="#FFFFFF" style={styles.buttonIcon} />
              <Text style={styles.textoBotaoAcao}>Lista de câmeras</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.botaoAcao,
                isWeb && styles.webBotaoAcao
              ]} 
              onPress={() => navigation.navigate('Perfil')}
            >
              <Ionicons name="person-circle-outline" size={24} color="#FFFFFF" style={styles.buttonIcon} />
              <Text style={styles.textoBotaoAcao}>Meu Perfil</Text>
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
    paddingRight: Platform.OS === 'web' ? 0 : 8,
  },
  contentWrapper: {
    width: Platform.OS === 'web' ? '100%' : '95%', 
    alignItems: 'center',
  },
  webContentWrapper: {
    maxWidth: 1000,
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
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeTitle: {
    color: '#FFFFFF',
    fontSize: Platform.OS === 'web' ? 32 : 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  welcomeSubtitle: {
    color: '#C26015',
    fontSize: Platform.OS === 'web' ? 20 : 16,
    fontWeight: '500',
  },
  featuresContainer: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '90%',
    marginBottom: 40,
    gap: 20,
  },
  featureCard: {
    backgroundColor: '#2A2A2A',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    width: Platform.OS === 'web' ? '30%' : '100%', 
    minWidth: Platform.OS === 'web' ? 280 : 'auto', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  featureTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    color: '#CCCCCC',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  actionsContainer: {
    width: '90%',
    maxWidth: 800,
    gap: 15,
    alignItems: 'center',
    marginBottom: Platform.OS === 'web' ? 30 : 20, 
  },
  botaoAcao: {
    backgroundColor: '#114354',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    width: '40%',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  webBotaoAcao: {
    width: '30%',
    paddingVertical: 15,
  },
  buttonIcon: {
    marginRight: 8,
  },
  textoBotaoAcao: {
    color: '#FFFFFF',
    fontSize: Platform.OS === 'web' ? 18 : 16,
    fontWeight: 'bold',
  },
});