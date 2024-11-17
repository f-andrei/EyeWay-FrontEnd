import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export const CameraTypeSelector = ({ cameraInfo, setCameraInfo }) => {
    const cameraTypes = ['YouTube Video', 'YouTube Stream', 'IP Camera'];
    
    return (
      <View>
        <Text style={styles.typeLabel}>Tipo de midia</Text>
        <View style={styles.toolbar}>
          {cameraTypes.map(type => (
            <TouchableOpacity 
              key={type}
              style={[
                styles.toolButton,
                cameraInfo.type === type && styles.activeToolButton
              ]}
              onPress={() => setCameraInfo({ ...cameraInfo, type })}
            >
              <Text style={styles.toolButtonText}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

const styles = StyleSheet.create({
    typeLabel: {
        color: '#FFFFFF',
        fontSize: 16,
        marginBottom: 10,
        alignSelf: 'center',
    },
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