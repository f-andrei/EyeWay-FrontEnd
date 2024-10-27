import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HelpGuide({ navigation }) {
  const isWeb = Platform.OS === 'web';
  const windowWidth = Dimensions.get('window').width;

  const Content = () => (
    <>
      <View style={[styles.containerLogo, isWeb && styles.webContainerLogo]}>
        <TouchableOpacity 
          style={[styles.backButton, isWeb && styles.webBackButton]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        <Image 
          source={require('../assets/LogoComNomeCompletoEyeWay.png')} 
          style={[styles.logo, isWeb && styles.webLogo]} 
        />
      </View>

      <View style={[styles.section, isWeb && styles.webSection]}>
        <Text style={styles.sectionTitle}>Como cadastrar uma câmera</Text>
        
        <View style={[
          styles.topicsContainer,
          isWeb && windowWidth > 1200 && styles.webTopicsContainer
        ]}>
          <View style={[styles.topicContainer, isWeb && styles.webTopicContainer]}>
            <Text style={styles.topicTitle}>1. Informações Básicas</Text>
            <Text style={styles.text}>
              • Nome da câmera: Use um nome único e descritivo{'\n'}
              • Local: Indique a localização física da câmera{'\n'}
              • Endereço: Digite o IP da câmera ou URL do vídeo
            </Text>
          </View>

          <View style={[styles.topicContainer, isWeb && styles.webTopicContainer]}>
            <Text style={styles.topicTitle}>2. Tipo de Mídia</Text>
            <Text style={styles.text}>
              • YouTube Video: Para análise de vídeos gravados{'\n'}
              • YouTube Stream: Para transmissões ao vivo{'\n'}
              • IP Camera: Para câmeras RTSP/HTTP
            </Text>
          </View>

          <View style={[styles.topicContainer, isWeb && styles.webTopicContainer]}>
            <Text style={styles.topicTitle}>3. Imagem de Fundo</Text>
            <Text style={styles.text}>
              • Toque no botão de upload para selecionar uma imagem{'\n'}
              • Use um frame que represente bem a cena{'\n'}
              • A imagem deve ter boa visibilidade e contraste{'\n'}
              • Prefira imagens durante o dia ou com boa iluminação
            </Text>
          </View>

          <View style={[styles.topicContainer, isWeb && styles.webTopicContainer]}>
            <Text style={styles.topicTitle}>4. Linhas de Cruzamento</Text>
            <Text style={styles.text}>
              • Selecione o modo "Linha" no menu{'\n'}
              • Para cada par de linhas:{'\n'}
              • 1º - Desenhe a linha de cruzamento (VERMELHA):{'\n'}
              '  - Deve estar perpendicular à direção do tráfego{'\n'}
              '  - Posicione onde deseja detectar passagens{'\n'}
              • 2º - Desenhe a linha de direção (AMARELA):{'\n'}
              '  - Indica a direção do movimento{'\n'}
              '  - A seta mostra o sentido da contagem{'\n'}
              • Você pode adicionar vários pares de linhas{'\n'}
              • Use "Desfazer" para corrigir erros
            </Text>
          </View>

          <View style={[styles.topicContainer, isWeb && styles.webTopicContainer]}>
            <Text style={styles.topicTitle}>5. Regiões de Interesse (ROI)</Text>
            <Text style={styles.text}>
              • Selecione o modo "Região de interesse"{'\n'}
              • Toque para adicionar pontos do polígono{'\n'}
              • Delimite áreas onde deseja detectar movimento{'\n'}
              • A região ficará destacada em verde{'\n'}
              • Evite áreas com muito ruído visual{'\n'}
              • Você pode criar múltiplas regiões{'\n'}
              • Use "Limpar" para recomeçar
            </Text>
          </View>

          <View style={[styles.topicContainer, isWeb && styles.webTopicContainer]}>
            <Text style={styles.topicTitle}>6. Dicas Importantes</Text>
            <Text style={styles.text}>
              • Mantenha as linhas de cruzamento mais curtas possível{'\n'}
              • Evite áreas com sombras ou reflexos fortes{'\n'}
              • ROIs muito grandes podem afetar o desempenho{'\n'}
              • Teste diferentes posições para melhor detecção{'\n'}
              • Salve as configurações antes de sair
            </Text>
          </View>
        </View>
      </View>
    </>
  );

  if (isWeb) {
    return (
      <div style={{
        minHeight: '100vh',
        maxHeight: '100vh',
        backgroundColor: '#3E3C3C',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'auto',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '1200px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <Content />
        </div>
      </div>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        <Content />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3E3C3C',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  containerLogo: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
    width: '100%',
    position: 'relative',
  },
  webContainerLogo: {
    maxWidth: 1200,
    paddingHorizontal: 20,
    alignSelf: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 10,
    zIndex: 1,
  },
  webBackButton: {
    left: 0,
  },
  logo: {
    width: '80%',
    height: 120,
    resizeMode: 'contain',
  },
  webLogo: {
    width: 400,
    maxWidth: '100%',
  },
  section: {
    padding: 20,
    width: '100%',
    alignSelf: 'center',
  },
  webSection: {
    width: '100%',
    padding: '0 20px',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 30,
    textAlign: 'center',
  },
  topicsContainer: {
    width: '100%',
  },
  webTopicsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 24,
    width: '100%',
  },
  topicContainer: {
    marginBottom: 20,
    backgroundColor: '#2A2A2A',
    padding: 20,
    borderRadius: 8,
  },
  webTopicContainer: {
    marginBottom: 0,
    transition: 'all 0.3s ease',
    cursor: 'default',
    ':hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    },
  },
  topicTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#C26015',
    marginBottom: 12,
  },
  text: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 22,
  },

  '@media (min-width: 768px)': {
    webSection: {
      padding: '0 20px',
      width: '100%',
    },
    sectionTitle: {
      fontSize: 28,
    },
    text: {
      fontSize: 16,
      lineHeight: 24,
    },
    webTopicsContainer: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
  },

  '@media (min-width: 1024px)': {
    webSection: {
      padding: '0 40px',
    },
    webTopicsContainer: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
  },

  '@media (min-width: 1200px)': {
    webSection: {
      padding: '0 40px',
    },
    webTopicsContainer: {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
  },
});