import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const SaveButton = ({ onPress }) => (
    <TouchableOpacity style={styles.saveButton} onPress={onPress}>
      <Ionicons name="save-outline" size={24} color="#FFFFFF" style={styles.buttonIcon} />
      <Text style={styles.saveButtonText}>Salvar configuração</Text>
    </TouchableOpacity>
  );

const styles = StyleSheet.create({
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonIcon: {
    marginRight: 8,
  },
});