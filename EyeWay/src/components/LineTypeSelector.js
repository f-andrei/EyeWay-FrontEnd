import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';

export const LineTypeSelector = ({ lineType, setLineType }) => {
  const isWeb = Platform.OS === 'web';
  
  return (
    <View style={styles.container}>
      <Text style={styles.typeLabel}>
        {!lineType 
          ? 'Selecione o tipo de ação que a linha irá realizar.' 
          : 'Tipo de linha selecionado: ' + lineType}
      </Text>
      <View style={styles.toolbar}>
        <TouchableOpacity
          style={[
            styles.toolButton,
            lineType === 'Contagem' && styles.activeToolButton,
            isWeb && styles.toolButtonWeb
          ]}
          onPress={() => setLineType('Contagem')}
        >
          <Text style={[
            styles.toolButtonText,
            lineType === 'Contagem' && styles.activeToolButtonText
          ]}>
            Contagem
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toolButton,
            lineType === 'Conversão proibida' && styles.activeToolButton,
            isWeb && styles.toolButtonWeb
          ]}
          onPress={() => setLineType('Conversão proibida')}
        >
          <Text style={[
            styles.toolButtonText,
            lineType === 'Conversão proibida' && styles.activeToolButtonText
          ]}>
            Conversão proibida
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  typeLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
    paddingHorizontal: 20,
    ...(Platform.OS === 'web' && {
      cursor: 'default',
      userSelect: 'none',
    }),
  },
  toolbar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
    paddingHorizontal: 20,
  },
  toolButton: {
    backgroundColor: '#2A2A2A',
    padding: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#3E3E3E',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  toolButtonWeb: {
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: '#3A3A3A',
      borderColor: '#4E4E4E',
    },
  },
  activeToolButton: {
    backgroundColor: '#4A90E2',
    borderColor: '#5C9EE6',
    elevation: 3,
    shadowColor: '#4A90E2',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2.41,
  },
  toolButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    ...(Platform.OS === 'web' && {
      userSelect: 'none',
    }),
  },
  activeToolButtonText: {
    fontWeight: 'bold',
  },
  // Media query for web - ensure buttons stack properly on smaller screens
  '@media (max-width: 480px)': {
    toolbar: {
      flexDirection: 'column',
      alignItems: 'stretch',
    },
    toolButton: {
      width: '100%',
    },
  },
});

// Optional: Add hover effects for web platform
if (Platform.OS === 'web') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    .toolButton:hover {
      background-color: #3A3A3A;
      border-color: #4E4E4E;
      transform: translateY(-1px);
    }
    
    .activeToolButton:hover {
      background-color: #5C9EE6;
      border-color: #6CAEFC;
    }
  `;
  document.head.appendChild(styleSheet);
}