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
  TouchableOpacity,
  Alert
} from 'react-native';
import Navbar from '../components/Navbar';

export default function Infractions({ navigation }) {
  const [infractions, setInfractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const isWeb = Platform.OS === 'web';

  const baseUrl = Platform.OS === 'android'
    ? 'http://10.0.2.2:3000'
    : 'http://localhost:3000';
  
  const api_url = `${baseUrl}/infractions`;

  useEffect(() => {
    const testApi = async () => {
      try {
        const response = await fetch(api_url);
        console.log('API test response:', response.status);
      } catch (err) {
        console.error('API test failed:', err);
      }
    };
    testApi();
  }, []);
  
  useEffect(() => {
    const handleDimensionChange = () => {
      setDimensions(Dimensions.get('window'));
    };

    Dimensions.addEventListener('change', handleDimensionChange);
    return () => {
      if (Dimensions.removeEventListener) {
        Dimensions.removeEventListener('change', handleDimensionChange);
      }
    };
  }, []);

  const showConfirmDialog = (title, message, onConfirm) => {
    if (Platform.OS === 'web') {
      const result = window.confirm(message);
      if (result) {
        onConfirm();
      }
    } else {
      Alert.alert(
        title,
        message,
        [
          {
            text: 'Cancelar',
            style: 'cancel'
          },
          {
            text: 'Deletar',
            onPress: onConfirm,
            style: 'destructive'
          }
        ],
        { cancelable: true }
      );
    }
  };

  const showAlert = (title, message) => {
    if (Platform.OS === 'web') {
      window.alert(message);
    } else {
      Alert.alert(title, message);
    }
  };

  const fetchInfractions = async () => {
    console.log('Fetching infractions...');
    try {
      const response = await fetch(api_url);
      console.log('Fetch response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch infractions');
      }
      const data = await response.json();
      console.log('Fetched infractions count:', data.length);
      setInfractions(data);
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
      setInfractions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshPress = async () => {
    setLoading(true);
    try {
      await fetchInfractions();
      showAlert('Sucesso', 'Lista atualizada com sucesso!');
    } catch (error) {
      console.error('Refresh error:', error);
      showAlert('Erro', 'Falha ao atualizar a lista');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePress = () => {
    console.log('Delete button pressed');
    showConfirmDialog(
      'Confirmação',
      'Tem certeza que deseja deletar todas as infrações?',
      deleteAllInfractions
    );
  };

  const deleteAllInfractions = async () => {
    console.log('Delete confirmation accepted');
    setLoading(true);
    try {
      const deleteUrl = `${baseUrl}/deleteAll`;
      console.log('Attempting to delete at URL:', deleteUrl);
      
      const response = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Delete response status:', response.status);

      const responseText = await response.text();
      console.log('Raw response:', responseText);

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        console.log('Response is not JSON:', e);
        throw new Error('Invalid server response');
      }

      if (!response.ok) {
        throw new Error(result.message || `Server returned ${response.status}`);
      }

      setInfractions([]);
      showAlert(
        'Sucesso',
        `Todas as infrações foram deletadas com sucesso. ${result.deletedCount || 0} registros removidos.`
      );

    } catch (err) {
      console.error('Delete error:', err);
      showAlert(
        'Erro',
        'Falha ao deletar infrações: ' + (err.message || 'Erro desconhecido')
      );
      setError(err.message || 'Erro desconhecido');
    } finally {
      setLoading(false);
      await fetchInfractions();
    }
  };

  const updateInfractionStatus = async (infractionId, status) => {
    setLoading(true);
    try {
      const response = await fetch(`${api_url}/${infractionId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      await fetchInfractions();
      showAlert('Sucesso', 'Status atualizado com sucesso');
    } catch (err) {
      showAlert('Erro', 'Falha ao atualizar o status: ' + err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfractions();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchInfractions().then(() => setRefreshing(false));
  }, []);

  const getImageDimensions = () => {
    const isDesktop = dimensions.width > 768;
    const maxWidth = isDesktop ? Math.min(800, dimensions.width * 0.6) : dimensions.width * 0.9;
    const maxHeight = dimensions.height * 0.85;
    const widthBasedHeight = (maxWidth * 9) / 16;

    return {
      width: maxWidth,
      height: Math.min(widthBasedHeight, maxHeight),
    };
  };

  const getContainerWidth = () => {
    const isDesktop = dimensions.width > 768;
    return isDesktop ? Math.min(1000, dimensions.width * 0.7) : dimensions.width;
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const StatusButton = ({ label, onPress, status, currentStatus }) => (
    <TouchableOpacity
      style={[
        styles.statusButton,
        currentStatus === status && styles.statusButtonActive
      ]}
      onPress={onPress}
    >
      <Text style={[
        styles.statusButtonText,
        currentStatus === status && styles.statusButtonTextActive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  console.log("Component rendered");

  if (loading) {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.navbarContainer}>
          <Navbar navigation={navigation} />
        </View>
        <View style={[styles.loadingContainer, { width: getContainerWidth() }]}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.navbarContainer}>
        <Navbar navigation={navigation} />
      </View>
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.contentContainer,
            { maxWidth: getContainerWidth() }
          ]}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFFFFF" />
          }
        >
          <View style={styles.headerContainer}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.deleteAllButton}
                onPress={handleDeletePress}
                activeOpacity={0.7}
              >
                <Text style={styles.deleteAllButtonText}>
                  Deletar Todas as Infrações
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.refreshButton}
                onPress={handleRefreshPress}
                activeOpacity={0.7}
              >
                <Text style={styles.refreshButtonText}>
                  Atualizar
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {error ? (
            <Text style={styles.errorText}>Erro: {error}</Text>
          ) : infractions.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>Nenhuma infração encontrada</Text>
            </View>
          ) : (
            infractions.map((infraction) => (
              <View key={infraction.id} style={styles.infractionCard}>
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: `data:image/jpeg;base64,${infraction.image_base64}` }}
                    style={[styles.image, getImageDimensions()]}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.infoContainer}>
                  <Text style={styles.infractionType}>
                    {infraction.infraction_type || 'Tipo não especificado'}
                  </Text>
                  <Text style={styles.infractionDetail}>
                    Câmera: {infraction.camera_name || 'Não especificado'}
                  </Text>
                  <Text style={styles.infractionDetail}>
                    Data: {formatDate(infraction.timestamp)}
                  </Text>
                  <Text style={styles.infractionDetail}>
                    Status atual: {infraction.status || 'Pendente'}
                  </Text>
                  <View style={styles.statusButtonsContainer}>
                    <StatusButton
                      label="Confirmar"
                      status="Verificado"
                      currentStatus={infraction.status}
                      onPress={() => updateInfractionStatus(infraction.id, 'Verificado')}
                    />
                    <StatusButton
                      label="Alerta falso"
                      status="Alerta falso"
                      currentStatus={infraction.status}
                      onPress={() => updateInfractionStatus(infraction.id, 'Alerta falso')}
                    />
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#3E3C3C',
    height: Platform.OS === 'web' ? '100vh' : '100%',
    overflow: Platform.OS === 'web' ? 'hidden' : 'visible',
  },
  navbarContainer: {
    width: Platform.OS === 'web' ? 200 : '100%',
    backgroundColor: '#1B2B3A',
    ...Platform.select({
      web: {
        height: '100vh',
        position: 'sticky',
        top: 0,
        left: 0,
      },
      default: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1,
      },
    }),
  },
  container: {
    flex: 1,
    backgroundColor: '#3E3C3C',
    ...(Platform.OS === 'web' && {
      height: '100vh',
      overflow: 'hidden',
    }),
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#3E3C3C',
    ...(Platform.OS === 'web' && {
      height: '100vh',
      overflow: 'auto',
    }),
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    paddingBottom: Platform.OS === 'web' ? 20 : 80,
    ...(Platform.OS === 'web' && {
      minHeight: '100%',
    }),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3E3C3C',
  },
  infractionCard: {
    backgroundColor: '#2A2A2A',
    borderRadius: 10,
    marginBottom: 20,
    padding: 20,
    width: '100%',
    maxWidth: '100%',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
  },
  image: {
    borderRadius: 10,
    width: '100%',
  },
  infoContainer: {
    width: '100%',
  },
  infractionType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 10,
    textAlign: 'center',
  },
  infractionDetail: {
    fontSize: 14,
    color: '#AAAAAA',
    marginTop: 5,
    textAlign: 'center',
  },
  statusButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    gap: 10,
  },
  statusButton: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#2A2A2A',
    borderWidth: 1,
    borderColor: '#4A4A4A',
    alignItems: 'center',
    minWidth: 100,
  },
  statusButtonActive: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  statusButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  statusButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#AAAAAA',
    marginBottom: 20,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
  },
  headerContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20,
  },
  deleteAllButton: {
    backgroundColor: '#DC3545',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  refreshButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  deleteAllButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40
  },
  emptyStateText: {
    color: '#AAAAAA',
    fontSize: 16,
    textAlign: 'center'
  }
});