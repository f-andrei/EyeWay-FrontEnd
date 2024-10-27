import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  ScrollView, 
  Platform,
  Alert,
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Navbar from '../components/Navbar';
import axios from 'axios';

export default function Home({ navigation }) {
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingCamera, setProcessingCamera] = useState(null);
  const isWeb = Platform.OS === 'web';
  const API_URL = Platform.OS === 'android' 
    ? "http://10.0.2.2:3000" 
    : "http://localhost:3000";

  const INFERENCE_URL = Platform.OS === 'android' 
    ? "http://10.0.2.2:5000" 
    : "http://localhost:5000";

  useEffect(() => {
    fetchCameras();
  }, []);

  const fetchCameras = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/cameras`);
      setCameras(response.data);
    } catch (err) {
      setError('Erro ao carregar as câmeras');
      Alert.alert(
        "Erro",
        "Não foi possível carregar a lista de câmeras.",
        [{ text: "OK" }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (cameraName) => {
    const isWeb = Platform.OS === 'web';
    
    if (isWeb) {
      const confirmed = window.confirm(`Deseja realmente excluir a câmera "${cameraName}"?`);
      if (confirmed) {
        try {
          const encodedCameraName = encodeURIComponent(cameraName);
          const response = await axios.delete(`${API_URL}/cameras/${encodedCameraName}`);
          
          if (response.status === 200) {
            window.alert('Câmera excluída com sucesso!');
            fetchCameras();
          }
        } catch (err) {
          console.error('Delete error:', err);
          window.alert('Não foi possível excluir a câmera. ' + 
            (err.response?.data?.message || err.message || 'Erro desconhecido'));
        }
      }
    } else {
      Alert.alert(
        "Confirmar exclusão",
        `Deseja realmente excluir a câmera "${cameraName}"?`,
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Excluir",
            style: "destructive",
            onPress: async () => {
              try {
                const encodedCameraName = encodeURIComponent(cameraName);
                const response = await axios.delete(`${API_URL}/cameras/${encodedCameraName}`);
                
                if (response.status === 200) {
                  Alert.alert("Sucesso", "Câmera excluída com sucesso!");
                  fetchCameras(); 
                }
              } catch (err) {
                console.error('Delete error:', err);
                Alert.alert(
                  "Erro",
                  `Não foi possível excluir a câmera. ${
                    err.response?.data?.message || 
                    err.message || 
                    'Verifique a conexão com o servidor.'
                  }`,
                  [{ text: "OK" }]
                );
              }
            }
          }
        ]
      );
    }
  };

  const handlePlayCamera = async (camera) => {
    try {
      setProcessingCamera(camera.name); 
  
      const response = await axios.post(`${INFERENCE_URL}/run-inference`, {
        camera_name: camera.name,
        source: camera.address,
        input_type: camera.type
      });
  
      const checkStatus = async () => {
        try {
          const statusResponse = await axios.get(`${INFERENCE_URL}/stream-status`);
          if (statusResponse.data.hls_live) {
            setProcessingCamera(null);
            navigation.navigate('Live', { camera: camera });
          } else {
            setTimeout(checkStatus, 1000);
          }
        } catch (error) {
          console.error('Error checking stream status:', error);
          Alert.alert(
            "Erro",
            "Erro ao verificar status do stream.",
            [{ text: "OK" }]
          );
          setProcessingCamera(null);
        }
      };
      checkStatus();
  
    } catch (error) {
      console.error('Error starting inference:', error);
      Alert.alert(
        "Erro",
        "Não foi possível iniciar o processamento da câmera.",
        [{ text: "OK" }]
      );
      setProcessingCamera(null);
    }
  };

  const getTypeDisplay = (type) => {
    const typeMapping = {
      'youtube_video': 'YouTube Video',
      'youtube_stream': 'YouTube Stream',
      'ip_camera': 'IP Camera'
    };
    return typeMapping[type] || type;
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#FF9C11" />
        <Text style={styles.loadingText}>Carregando câmeras...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        style={Platform.OS === 'web' ? {
          height: 'calc(100vh - 60px)',
          width: '100%',
        } : { flex: 1 }}
      >
        <View style={[styles.contentWrapper, isWeb && styles.webContentWrapper]}>
          {!isWeb && (
            <View style={styles.containerLogo}>
              <Image 
                source={require('../assets/LogoComNomeCompletoEyeWay.png')} 
                style={styles.logo} 
              />
            </View>
          )}

          <View style={[styles.containerDescricao, isWeb && { width: '70%', marginTop: 40 }]}>
            <Text style={styles.textoDescricao}>
              Lista de câmeras cadastradas
            </Text>
          </View>

          {cameras.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="videocam-off-outline" size={48} color="#666666" />
              <Text style={styles.emptyStateText}>Nenhuma câmera cadastrada</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('RegisterCamera')}
              >
                <Text style={styles.addButtonText}>Adicionar Câmera</Text>
              </TouchableOpacity>
            </View>
          ) : (
            cameras.map((camera) => (
              <View key={camera.name} style={[styles.card, isWeb && { width: '80%' }]}>
                <View style={styles.cardHeader}>
                  <Ionicons name="camera" size={24} color="#FF9C11" style={styles.cameraIcon} />
                  <Text style={styles.cameraId}>{camera.name}</Text>
                </View>

                <Text style={styles.cameraType}>
                  Tipo: {getTypeDisplay(camera.type)}
                </Text>

                {camera.image_data && (
                  <Image
                    source={{ uri: camera.image_data }}
                    style={styles.cameraImagem}
                    resizeMode="cover"
                  />
                )}

                <Text style={styles.cameraLocalizacao}>
                  Local: {camera.location}
                </Text>
                
                <Text style={styles.cameraAddress}>
                  URL/IP: {camera.address}
                </Text>

                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={[
                      styles.BotaoReproduzir, 
                      isWeb && styles.webBotaoEnviar,
                      processingCamera === camera.name && styles.buttonProcessing 
                    ]}
                    onPress={() => handlePlayCamera(camera)}
                    disabled={processingCamera === camera.name} 
                  >
                    {processingCamera === camera.name ? (
                      <View style={styles.buttonContent}>
                        <ActivityIndicator size="small" color="#FFFFFF" />
                        <Text style={styles.textoBotaoEnviar}>Processando...</Text>
                      </View>
                    ) : (
                      <Text style={styles.textoBotaoEnviar}>Reproduzir</Text>
                    )}
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.BotaoExcluir, isWeb && styles.webBotaoEnviar]}
                    onPress={() => handleDelete(camera.name)}
                  >
                    <Text style={styles.textoBotaoEnviar}>Excluir Camera</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
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
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 10,
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
    width: '100%',
  },
  cameraIcon: {
    marginRight: 10,
  },
  cameraId: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
    flex: 1,
  },
  cameraType: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 15,
    width: '100%',
  },
  cameraImagem: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#2A2A2A',
  },
  cameraLocalizacao: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 10,
    width: '100%',
  },
  cameraAddress: {
    fontSize: 14,
    color: '#AAAAAA',
    marginBottom: 15,
    width: '100%',
  },
  actionButtons: {
    width: '100%',
    gap: 10,
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
  BotaoReproduzir: {
    backgroundColor: '#FF9C11',
    borderRadius: 5,
    width: '100%',
    paddingVertical: 10,
    alignItems: 'center',
  },
  BotaoExcluir: {
    backgroundColor: '#e63946',
    borderRadius: 5,
    width: '100%',
    paddingVertical: 10,
    alignItems: 'center',
  },
  webBotaoEnviar: {
    width: '100%',
    paddingVertical: 12,
  },
  textoBotaoEnviar: {
    color: '#FFFFFF',
    fontSize: Platform.OS === 'web' ? 16 : 14,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 40,
  },
  emptyStateText: {
    color: '#666666',
    fontSize: 18,
    marginTop: 10,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#FF9C11',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  buttonProcessing: {
    opacity: 0.7,
  },
});