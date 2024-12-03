import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Platform, TouchableOpacity, Image, FlatList, Alert } from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import Navbar from '../components/Navbar';

const ManualInfractionsScreen = ({ navigation }) => {
  const [infractions, setInfractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const isWeb = Platform.OS === 'web';
  const baseUrl = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

  const arrayBufferToBase64 = buffer => {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const showAlert = (title, message) => {
    if (isWeb) {
      window.alert(message);
    } else {
      Alert.alert(title, message);
    }
  };

  const fetchInfractions = async () => {
    try {
      const response = await axios.get(`${baseUrl}/manualInfractions`);
      console.log('Dados recebidos:', response.data);
      setInfractions(response.data.results || []);
    } catch (error) {
      console.error('Error fetching infractions:', error);
      showAlert('Erro', 'Não foi possível buscar as infrações.');
    } finally {
      setLoading(false);
    }
  };

  const deleteAllInfractions = async () => {
    const confirmDelete = isWeb 
      ? window.confirm('Tem certeza que deseja deletar todas as infrações?')
      : await new Promise((resolve) => {
          Alert.alert(
            'Confirmar',
            'Tem certeza que deseja deletar todas as infrações?',
            [
              { text: 'Cancelar', onPress: () => resolve(false), style: 'cancel' },
              { text: 'Deletar', onPress: () => resolve(true), style: 'destructive' }
            ]
          );
        });

    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`${baseUrl}/manualInfractions`);
      if (response.status === 200) {
        showAlert('Sucesso', 'Todas as infrações foram deletadas.');
        setInfractions([]);
      }
    } catch (error) {
      console.error('Error deleting infractions:', error);
      showAlert('Erro', 'Não foi possível deletar as infrações.');
    }
  };

  const editInfraction = async (id, updatedData) => {
    console.log('ID para atualização:', id);
    if (!id) {
      showAlert('Erro', 'ID inválido para atualização.');
      return;
    }
    if (!updatedData || Object.keys(updatedData).length === 0) {
      showAlert('Erro', 'Dados inválidos para atualização.');
      return;
    }

    try {
      const response = await axios.put(`${baseUrl}/manualInfractions/${id}`, updatedData);
      if (response.status === 200) {
        showAlert('Sucesso', 'Infração atualizada com sucesso.');
        await fetchInfractions(); // Refresh the list
      } else {
        showAlert('Erro', 'Falha ao atualizar a infração.');
      }
    } catch (error) {
      console.error('Error updating infraction:', error);
      showAlert('Erro', 'Não foi possível atualizar a infração.');
    }
  };

  const InfoRow = ({ label, value }) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}:</Text>
      <Text style={styles.infoValue}>{value || 'Não especificado'}</Text>
    </View>
  );

  const InfractionItem = ({ id, image, date, user, adress, text, status, vehicle_type, infraction_type, onEdit }) => {
    return (
      <View style={styles.infractionCard}>
        <View style={styles.cardHeader}>
          <Ionicons name="alert-circle" size={24} color="#FF9C11" />
          <Text style={styles.infractionId}>ID: {id}</Text>
        </View>

        {image && (
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: `data:image/jpeg;base64,${arrayBufferToBase64(image)}` }} 
              style={styles.infractionImage} 
            />
          </View>
        )}

        <View style={styles.infoContainer}>
          <InfoRow label="Data" value={date} />
          <InfoRow label="Usuário" value={user} />
          <InfoRow label="Endereço" value={adress} />
          <InfoRow label="Observações" value={text} />
          <InfoRow label="Status" value={status} />
          <InfoRow label="Tipo de Veículo" value={vehicle_type} />
          <InfoRow label="Tipo de Infração" value={infraction_type} />
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.updateButton}
            onPress={() => onEdit(id)}
          >
            <Ionicons name="create-outline" size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  useEffect(() => {
    fetchInfractions();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF9C11" />
        </View>
        <Navbar navigation={navigation} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerContainer}>
          <Ionicons name="document-text" size={32} color="#C26015" />
          <Text style={styles.headerTitle}>Manual Infractions</Text>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteAllButton]}
            onPress={deleteAllInfractions}
          >
            <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Deletar Todas</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={infractions}
          keyExtractor={(item, index) => (item?.id_manual?.toString() || `default-key-${index}`)}
          renderItem={({ item }) => (
            <InfractionItem
              id={item.id_manual}
              date={item.date}
              user={item.user}
              image={item.image.data}
              adress={item.adress}
              text={item.text}
              status={item.status}
              vehicle_type={item.vehicle_type}
              infraction_type={item.infraction_type}
              onEdit={(id) => editInfraction(id, item)}
            />
          )}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhuma infração encontrada</Text>
            </View>
          }
        />
      </View>
      <Navbar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3E3C3C',
  },
  content: {
    flex: 1,
    paddingBottom: Platform.OS === 'web' ? 20 : 80,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 10,
    gap: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  deleteAllButton: {
    backgroundColor: '#DC3545',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  listContainer: {
    padding: 20,
    gap: 20,
  },
  infractionCard: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: Platform.OS === 'web' ? '80%' : '100%',
    alignSelf: 'center',
    maxWidth: 800,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#3E3E3E',
    gap: 10,
  },
  infractionId: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#1E1E1E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infractionImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  infoContainer: {
    padding: 15,
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#3E3E3E',
  },
  infoLabel: {
    color: '#AAAAAA',
    fontSize: 14,
    width: 120,
  },
  infoValue: {
    color: '#FFFFFF',
    fontSize: 14,
    flex: 1,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#3E3E3E',
  },
  updateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#AAAAAA',
    fontSize: 16,
  }
});


export default ManualInfractionsScreen;
