import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Platform,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
} from 'react-native';
import Navbar from '../components/Navbar';

export default function Infractions({ navigation }) {
  const [infractions, setInfractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const isWeb = Platform.OS === 'web';

  useEffect(() => {
    if (isWeb) {
      const handleResize = () => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        });
      };
      
      window.addEventListener('resize', handleResize);
      handleResize();
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const getImageDimensions = () => {
    if (isWeb) {
      const maxWidth = Math.min(dimensions.width * 0.99, 800);
      const maxHeight = dimensions.height * 0.85;
      const widthBasedHeight = maxWidth * 9 / 16;
      
      return {
        width: maxWidth,
        height: Math.min(widthBasedHeight, maxHeight)
      };
    }
    return {
      width: dimensions.width * 0.9,
      height: (dimensions.width * 0.9) * 9 / 16
    };
  };

  const { width: imageWidth, height: imageHeight } = getImageDimensions();

  const api_url = Platform.OS === 'android' 
    ? "http://10.0.2.2:3000/infractions" 
    : "http://localhost:3000/infractions";

  const fetchInfractions = async () => {
    try {
      const response = await fetch(api_url);
      if (!response.ok) {
        throw new Error('Failed to fetch infractions');
      }
      const data = await response.json();
      setInfractions(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching infractions:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchInfractions();
  }, []);

  useEffect(() => {
    fetchInfractions();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <View style={[
      styles.container,
      isWeb && styles.webContainer
    ]}>
      {isWeb ? (
        <div style={{
          height: '100vh',
          overflowY: 'auto',
          backgroundColor: '#3E3C3C',
          paddingBottom: '60px' 
        }}>
          <View style={[
            styles.scrollContent,
            styles.webScrollContent
          ]}>
            <View style={styles.containerDescricao}>
              <Text style={[
                styles.textoTitulo,
                styles.webTextoTitulo
              ]}>Alertas de Infração</Text>
              <Text style={[
                styles.textoSubtitulo,
                styles.webTextoSubtitulo
              ]}>Últimas 5 infrações detectadas</Text>
            </View>

            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                  Erro ao carregar infrações: {error}
                </Text>
              </View>
            ) : (
              <View style={[
                styles.containerImagens,
                { paddingBottom: 20 }
              ]}>
                {infractions.map((infraction, index) => (
                  <View 
                    key={index} 
                    style={[
                      styles.infractionCard,
                      { width: imageWidth }
                    ]}
                  >
                    <Image
                      source={{ uri: `data:image/jpeg;base64,${infraction.image_base64}` }}
                      style={[
                        styles.infractionImage,
                        { width: imageWidth, height: imageHeight }
                      ]}
                      defaultSource={require('../assets/placeholder.jpg')}
                    />
                    <View style={styles.infractionInfo}>
                      <Text style={[
                        styles.infractionType,
                        styles.webInfoTexto
                      ]}>
                        {infraction.infraction_type || 'Tipo não especificado'}
                      </Text>
                      <Text style={[
                        styles.infractionDetail,
                        styles.webInfoTexto
                      ]}>
                        Nome da câmera: {infraction.camera_name || 'Não especificado'}
                      </Text>
                      <Text style={[
                        styles.infractionDetail,
                        styles.webInfoTexto
                      ]}>
                        Tipo de Veículo: {infraction.vehicle_type || 'Não especificado'}
                      </Text>
                      <Text style={[
                        styles.infractionDetail,
                        styles.webInfoTexto
                      ]}>
                        Data: {formatDate(infraction.timestamp)}
                      </Text>
                      <Text style={[
                        styles.infractionDetail,
                        styles.webInfoTexto
                      ]}>
                        Local: {infraction.camera_location || 'Não especificado'}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </div>
      ) : (
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#FFFFFF"
            />
          }
        >
          <View style={styles.containerLogo}>
            <Image
              source={require('../assets/LogoComNomeCompletoEyeWay.png')}
              style={styles.logo}
            />
          </View>

          <View style={styles.containerDescricao}>
            <Text style={styles.textoTitulo}>Alertas de Infração</Text>
            <Text style={styles.textoSubtitulo}>
              Últimas 5 infrações detectadas
            </Text>
          </View>

          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                Erro ao carregar infrações: {error}
              </Text>
            </View>
          ) : (
            <View style={styles.containerImagens}>
              {infractions.map((infraction, index) => (
                <View 
                  key={index} 
                  style={styles.infractionCard}
                >
                  <Image
                    source={{ uri: `data:image/jpeg;base64,${infraction.image_base64}` }}
                    style={[
                      styles.infractionImage,
                      { width: '100%', height: imageHeight }
                    ]}
                    defaultSource={require('../assets/placeholder.jpg')}
                  />
                  <View style={styles.infractionInfo}>
                    <Text style={styles.infractionType}>
                      {infraction.infraction_type || 'Tipo não especificado'}
                    </Text>
                    <Text style={styles.infractionDetail}>
                      Câmera ID: {infraction.camera_id}
                    </Text>
                    <Text style={styles.infractionDetail}>
                      Tipo de Veículo: {infraction.vehicle_type || 'Não especificado'}
                    </Text>
                    <Text style={styles.infractionDetail}>
                      Data: {formatDate(infraction.timestamp)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}

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
  webContainer: {
    height: '100vh',
    position: 'relative',
  },
  webScrollView: {
    flex: 1,
    paddingBottom: 60,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#3E3C3C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 70,
  },
  webScrollContent: {
    paddingTop: 10,
    paddingBottom: 100,
    minHeight: '100%',
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
  webTextoTitulo: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 2,
  },
  textoSubtitulo: {
    color: '#FFFFFF',
    fontSize: 18,
    marginTop: 5,
  },
  webTextoSubtitulo: {
    fontSize: 10,
  },
  containerImagens: {
    width: '90%',
    alignItems: 'center',
  },
  infractionCard: {
    width: '100%',
    backgroundColor: '#2A2A2A',
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  infractionImage: {
    resizeMode: 'cover',
  },
  infractionInfo: {
    padding: 15,
  },
  infractionType: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infractionDetail: {
    color: '#CCCCCC',
    fontSize: 14,
    marginBottom: 4,
  },
  webInfoTexto: {
    fontSize: 12,
    marginBottom: 4,
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    textAlign: 'center',
  },
});