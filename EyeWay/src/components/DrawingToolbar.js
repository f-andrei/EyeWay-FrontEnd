import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';


export const DrawingToolbar = ({ mode, setMode, handleUndo, handleReset }) => {
    return (
      <View style={styles.toolbar}>
        <TouchableOpacity
          style={[styles.toolButton, mode === 'LINE' && styles.activeToolButton]}
          onPress={() => setMode('LINE')}
        >
          <Text style={styles.toolButtonText}>Linha</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toolButton, mode === 'ROI' && styles.activeToolButton]}
          onPress={() => setMode('ROI')}
        >
          <Text style={styles.toolButtonText}>Região de interesse</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolButton} onPress={handleUndo}>
          <Text style={styles.toolButtonText}>Desfazer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolButton} onPress={handleReset}>
          <Text style={styles.toolButtonText}>Limpar</Text>
        </TouchableOpacity>
      </View>
    );
  };


const styles = StyleSheet.create({
    toolbar: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 20,
        width: '100%',
    },
    toolButton: {
        backgroundColor: '#2A2A2A',
        padding: 10,
        borderRadius: 8,
        minWidth: 100,
        alignItems: 'center',
    },
    activeToolButton: {
        backgroundColor: '#4A90E2',
    },
    toolButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
    }
});