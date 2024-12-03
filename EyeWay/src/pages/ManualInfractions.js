import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, Alert, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import Navbar from '../components/Navbar';


const ManualInfractionsScreen = () => {
  const [infractions, setInfractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newInfraction, setNewInfraction] = useState({
    id: '',
    date: '',
    user: '',
    adress: '',
    image: '', // Base64
    text: '',
    status: '',
    vehicle_type: '',
    infraction_type: ''
  });

  const arrayBufferToBase64 = buffer => {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const InfractionItem = ({ id, image, date, user, adress, text, status, vehicle_type, infraction_type, onEdit }) => {
    return (
      <View style={styles.infractionContainer}>
        <Text style={styles.infractionTitle}>ID: {id}</Text>
        {image && (
          <Image source={{ uri: arrayBufferToBase64(image) }} style={styles.infractionImage} />
        )}
        <Text style={styles.infractionText}><Text style={styles.bold}>Data: </Text>{date}</Text>
        <Text style={styles.infractionText}><Text style={styles.bold}>Usuário: </Text>{user}</Text>
        <Text style={styles.infractionText}><Text style={styles.bold}>Endereço: </Text>{adress}</Text>
        <Text style={styles.infractionText}><Text style={styles.bold}>Texto: </Text>{text}</Text>
        <Text style={styles.infractionText}><Text style={styles.bold}>Status: </Text>{status}</Text>
        <Text style={styles.infractionText}><Text style={styles.bold}>Tipo de Veículo: </Text>{vehicle_type}</Text>
        <Text style={styles.infractionText}><Text style={styles.bold}>Tipo de Infração: </Text>{infraction_type}</Text>
        {id ? (
          <Button title="Editar" onPress={() => onEdit(id)} color="#4A90E2" />
        ) : (
          <Text style={styles.infractionText}>Infração sem ID. Não pode ser editada.</Text>
        )}
      </View>
    );
  };

  const fetchInfractions = async () => {
    try {
      const response = await axios.get('http://localhost:3000/manualInfractions');
      console.log('Dados recebidos:', response.data);
      setInfractions(response.data.results || []);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível buscar as infrações.');
    } finally {
      setLoading(false);
    }
  };

  const deleteAllInfractions = async () => {
    try {
      const response = await axios.delete('http://localhost:3000/manualInfractions');
      if (response.status === 200) {
        Alert.alert('Sucesso', 'Todas as infrações foram deletadas.');
        setInfractions([]);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível deletar as infrações.');
      console.error('Erro ao deletar infrações:', error);
    }
  };

  const editInfraction = async (id, updatedData) => {
    console.log('ID para atualização:', id);
    if (!id) {
      Alert.alert('Erro', 'ID inválido para atualização.');
      return;
    }
    if (!updatedData || Object.keys(updatedData).length === 0) {
      Alert.alert('Erro', 'Dados inválidos para atualização.');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:3000/manualInfractions/${id}`, updatedData);
      if (response.status === 200) {
        Alert.alert('Sucesso', 'Infração atualizada com sucesso.');
      } else {
        Alert.alert('Erro', 'Falha ao atualizar a infração.');
      }
    } catch (error) {
      console.error('Erro ao atualizar a infração:', error);
      Alert.alert('Erro', 'Não foi possível atualizar a infração.');
    }
  };

  useEffect(() => {
    fetchInfractions();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manual Infractions</Text>
      {loading ? (
        <Text style={styles.loadingText}>Carregando...</Text>
      ) : (
        <FlatList
          data={infractions}
          keyExtractor={(item, index) => (item?.id ? item.id.toString() : `default-key-${index}`)}
          renderItem={({ item }) => (
            <InfractionItem
              id={item?.id_manual}
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
        />
      )}
      <View style={styles.buttonsContainer}>
        <Button title="Deletar Todas as Infrações" onPress={deleteAllInfractions} color="#E94E77" />
      </View>
        <Navbar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
        backgroundColor: '#2E2D2D',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#C26015',
    marginBottom: 20,
  },
  loadingText: {
    color: '#ffffff',
    textAlign: 'center',
  },
  infractionContainer: {
    backgroundColor: '#333333',
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
  },
  infractionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  infractionText: {
    color: '#ffffff',
    fontSize: 14,
    marginVertical: 4,
  },
  bold: {
    fontWeight: 'bold',
  },
  infractionImage: {
    width: 100,
    height: 100,
    marginVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default ManualInfractionsScreen;
