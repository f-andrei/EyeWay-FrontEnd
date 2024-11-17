import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export const ROITypeSelector = ({ roiType, setRoiType }) => {
  return (
    <>
      <Text style={styles.typeLabel}>
        {!roiType 
          ? 'Selecione o tipo de região de interesse.' 
          : 'Tipo de região selecionado: ' + roiType}
      </Text>
      <View style={styles.toolbar}>
        <TouchableOpacity
          style={[styles.toolButton, roiType === 'Presença' && styles.activeToolButton]}
          onPress={() => setRoiType('Presença')}
        >
          <Text style={styles.toolButtonText}>Presença</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toolButton, roiType === 'Cruzamento' && styles.activeToolButton]}
          onPress={() => setRoiType('Cruzamento')}
        >
          <Text style={styles.toolButtonText}>Cruzamento</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  typeLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 10,
    alignSelf: 'center',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  toolbar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
    width: '100%',
    paddingHorizontal: 20,
  },
  toolButton: {
    backgroundColor: '#2A2A2A',
    padding: 10,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3E3E3E',
  },
  activeToolButton: {
    backgroundColor: '#4A90E2',
    borderColor: '#5C9EE6',
  },
  toolButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});