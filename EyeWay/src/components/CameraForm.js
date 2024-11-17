import React from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CameraTypeSelector } from './CameraTypeSelector';

export const CameraForm = ({ cameraInfo, setCameraInfo, navigation }) => {
  return (
    <View>
      <View style={styles.headerContainer}>
        <Ionicons name="videocam-outline" size={32} color="#C26015" />
        <Text style={styles.title}>Cadastro de câmera</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.helpButton}
        onPress={() => navigation.navigate('HelpGuide')} 
      >
        <Ionicons name="help-circle-outline" size={24} color="#FFFFFF" />
        <Text style={styles.helpButtonText}>Ajuda</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Nome da câmera"
        placeholderTextColor="#999"
        value={cameraInfo.name}
        onChangeText={(text) => setCameraInfo({ ...cameraInfo, name: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Local"
        placeholderTextColor="#999"
        value={cameraInfo.location}
        onChangeText={(text) => setCameraInfo({ ...cameraInfo, location: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Endereço (IP ou URL)"
        placeholderTextColor="#999"
        value={cameraInfo.address}
        onChangeText={(text) => setCameraInfo({ ...cameraInfo, address: text })}
      />

      <CameraTypeSelector cameraInfo={cameraInfo} setCameraInfo={setCameraInfo} />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    gap: 10, //espaço entre os elementos
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    gap: 8,
  },
  helpButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  input: {
    width: '100%',
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    color: '#FFFFFF',
    fontSize: 16,
  },
});