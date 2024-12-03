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
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Navbar from '../components/Navbar';

export default function CombinedInfractions({ navigation }) {
  const [infractions, setInfractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  const baseUrl = Platform.OS === 'android'
    ? 'http://10.0.2.2:3000'
    : 'http://localhost:3000';

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

  const handleDeleteAllAutomated = async () => {
    const performDeleteAll = async () => {
      try {
        const response = await fetch(`${baseUrl}/deleteAll`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete infractions');
        }
        
        showAlert('Sucesso', 'Infrações automáticas deletadas com sucesso');
        fetchAllInfractions();
      } catch (error) {
        console.error('Delete error:', error);
        showAlert('Erro', 'Falha ao deletar as infrações');
      }
    };
  
    if (Platform.OS === 'web') {
      if (window.confirm('Tem certeza que deseja deletar todas as infrações automáticas?')) {
        await performDeleteAll();
      }
    } else {
      Alert.alert(
        'Confirmar Exclusão',
        'Tem certeza que deseja deletar todas as infrações automáticas?',
        [
          {
            text: 'Cancelar',
            style: 'cancel'
          },
          {
            text: 'Deletar',
            onPress: performDeleteAll,
            style: 'destructive'
          }
        ]
      );
    }
  };

  const handleDeleteInfraction = async (infractionId) => {
    const performDelete = async () => {
      try {
        const numericId = infractionId.replace('manual-', '');
        const response = await fetch(`${baseUrl}/manualInfractions/${numericId}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete infraction');
        }
        
        showAlert('Sucesso', 'Infração deletada com sucesso');
        fetchAllInfractions();
      } catch (error) {
        console.error('Delete error:', error);
        showAlert('Erro', 'Falha ao deletar a infração');
      }
    };
  
    if (Platform.OS === 'web') {
      if (window.confirm('Tem certeza que deseja deletar esta infração?')) {
        await performDelete();
      }
    } else {
      Alert.alert(
        'Confirmar Exclusão',
        'Tem certeza que deseja deletar esta infração?',
        [
          {
            text: 'Cancelar',
            style: 'cancel'
          },
          {
            text: 'Deletar',
            onPress: performDelete,
            style: 'destructive'
          }
        ]
      );
    }
  };

  const handleUpdateInfraction = (infraction) => {
    const numericId = infraction.id.replace('manual-', '');
    navigation.navigate('UpdateManualInfraction', {
      infractionId: numericId,
      infractionData: infraction
    });
  };

  const showAlert = (title, message) => {
    if (Platform.OS === 'web') {
      window.alert(message);
    } else {
      Alert.alert(title, message);
    }
  };

  const fetchAllInfractions = async () => {
    setLoading(true);
    try {
      const [automatedResponse, manualResponse] = await Promise.all([
        fetch(`${baseUrl}/infractions`),
        fetch(`${baseUrl}/manualInfractions`)
      ]);

      if (!automatedResponse.ok) {
        throw new Error('Não foi possível carregar as infrações');
      }

      const automatedData = await automatedResponse.json();
      let formattedManualData = [];

      try {
        if (manualResponse.ok) {
          const manualData = await manualResponse.json();
          
          if (manualData.results && manualData.results.length > 0) {
            formattedManualData = manualData.results.map(manual => {
              let imageBase64 = null;
              if (manual.image && manual.image.data) {
                const bytes = new Uint8Array(manual.image.data);
                let binary = '';
                for (let i = 0; i < bytes.byteLength; i++) {
                  binary += String.fromCharCode(bytes[i]);
                }
                imageBase64 = window.btoa(binary);
              }

              return {
                id: `manual-${manual.id_manual}`,
                camera_id: manual.camera_id,
                vehicle_type: manual.vehicle_type,
                infraction_type: manual.infraction_type,
                status: manual.status,
                timestamp: new Date(manual.date).getTime(),
                image_base64: imageBase64,
                camera_name: 'Inserido manualmente',
                isManual: true,
                user: manual.user,
                address: manual.adress,
                additionalText: manual.text
              };
            });
          }
        }
      } catch (manualError) {
        console.error('Error fetching manual infractions:', manualError);
      }

      const combinedInfractions = [...automatedData, ...formattedManualData]
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      setInfractions(combinedInfractions);
      setError(null);

      if (combinedInfractions.length === 0) {
        setError('Não há nenhuma infração no momento');
      }

    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
      setInfractions([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchAllInfractions().then(() => setRefreshing(false));
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchAllInfractions();
    }, [])
  );

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
                onPress={handleDeleteAllAutomated}
              >
                <Text style={styles.deleteAllButtonText}>Deletar Infrações Automáticas</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.refreshButton}
                onPress={onRefresh}
              >
                <Text style={styles.refreshButtonText}>Atualizar</Text>
              </TouchableOpacity>
            </View>
          </View>

          {error ? (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>{error}</Text>
            </View>
          ) : infractions.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>Não há nenhuma infração no momento</Text>
            </View>
          ) : (
            infractions.map((infraction) => (
              <View key={infraction.id} style={[
                styles.infractionCard,
                infraction.isManual && styles.manualInfractionCard
              ]}>
                {infraction.isManual && (
                  <View style={styles.manualBadge}>
                    <Text style={styles.manualBadgeText}>Manual</Text>
                  </View>
                )}
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
                  {infraction.isManual && (
                    <>
                      <Text style={styles.infractionDetail}>
                        Usuário: {infraction.user}
                      </Text>
                      <Text style={styles.infractionDetail}>
                        Endereço: {infraction.address}
                      </Text>
                      <Text style={styles.infractionDetail}>
                        Observações: {infraction.additionalText}
                      </Text>
                    </>
                  )}
                  <View style={styles.statusButtonsContainer}>
                    {infraction.isManual ? (
                      <>
                        <TouchableOpacity
                          style={[styles.actionButton, styles.updateButton]}
                          onPress={() => handleUpdateInfraction(infraction)}
                        >
                          <Text style={styles.actionButtonText}>Atualizar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.actionButton, styles.deleteButton]}
                          onPress={() => handleDeleteInfraction(infraction.id)}
                        >
                          <Text style={styles.actionButtonText}>Deletar</Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <>
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
                      </>
                    )}
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
    marginBottom: 20,
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
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: '#c82333',
      },
    }),
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
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: '#357abd',
      },
    }),
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
  manualInfractionCard: {
    borderWidth: 2,
    borderColor: '#4A90E2',
    position: 'relative',
  },
  manualBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#4A90E2',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    zIndex: 1,
  },
  manualBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
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
  actionButton: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    minWidth: 100,
    borderWidth: 1,
  },
  updateButton: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  deleteButton: {
    backgroundColor: '#DC3545',
    borderColor: '#DC3545',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    color: '#AAAAAA',
    fontSize: 16,
    textAlign: 'center',
  },
});