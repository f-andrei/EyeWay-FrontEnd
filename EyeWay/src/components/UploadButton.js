
import { Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const UploadButton = ({ onPress }) => (
    <TouchableOpacity style={styles.uploadButton} onPress={onPress}>
      <Ionicons name="cloud-upload-outline" size={40} color="#FFFFFF" />
      <Text style={styles.uploadText}>
        {Platform.OS === 'web' ? 'Clique para enviar uma imagem de fundo' : 'Tap to upload image'}
      </Text>
    </TouchableOpacity>
  );


const styles = StyleSheet.create({
  uploadButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 10,
  },
});