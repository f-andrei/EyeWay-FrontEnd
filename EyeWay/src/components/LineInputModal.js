import { Modal, TextInput, TouchableOpacity, View, Text, StyleSheet, Platform } from 'react-native';
import { useState, useEffect } from 'react';

export const LineInputModal = ({ visible, onClose, onSave, initialType = 'Contagem' }) => {
    const [name, setName] = useState('');
    const [type, setType] = useState(initialType);
  
    useEffect(() => {
      if (visible) {
        setType(initialType);
        setName('');
      }
    }, [visible, initialType]);
  
    const handleSave = () => {
      console.log('Attempting to save:', { name, type });
      if (name.trim()) {
        onSave({ 
          name: name.trim(), 
          type: type || 'Contagem'
        });
      }
    };
  
    if (!visible) return null;
  
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, Platform.OS === 'web' && styles.modalContentWeb]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Configurar Linha de Análise</Text>
            </View>
  
            <View style={styles.modalBody}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Nome da linha *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Digite o nome da linha"
                  placeholderTextColor="#999"
                  value={name}
                  onChangeText={setName}
                  autoFocus={true}
                />
              </View>
  
              <View style={styles.typeContainer}>
                <Text style={styles.inputLabel}>Tipo de linha</Text>
                <View style={styles.typeSelector}>
                  <TouchableOpacity
                    style={[
                      styles.typeButton, 
                      type === 'Contagem' && styles.activeTypeButton
                    ]}
                    onPress={() => setType('Contagem')}
                  >
                    <Text style={[
                      styles.typeButtonText,
                      type === 'Contagem' && styles.activeTypeButtonText
                    ]}>
                      Contagem
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.typeButton, 
                      type === 'Conversão proibida' && styles.activeTypeButton
                    ]}
                    onPress={() => setType('Conversão proibida')}
                  >
                    <Text style={[
                      styles.typeButtonText,
                      type === 'Conversão proibida' && styles.activeTypeButtonText
                    ]}>
                      Conversão proibida
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
  
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button, 
                  styles.saveButton,
                  !name.trim() && styles.disabledButton
                ]}
                onPress={handleSave}
                disabled={!name.trim()}
              >
                <Text style={[
                  styles.buttonText,
                  !name.trim() && styles.disabledButtonText
                ]}>
                  Salvar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

const styles = StyleSheet.create({
    typeSelector: {
        flexDirection: 'column',
        gap: 8,
        marginTop: 8,
        },
        typeButton: {
        backgroundColor: '#1A1A1A',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#3E3E3E',
        ...(Platform.OS === 'web' && {
            cursor: 'pointer',
            transition: 'all 0.2s ease',
        }),
        },
        activeTypeButton: {
        backgroundColor: '#4A90E2',
        borderColor: '#5C9EE6',
        },
        typeButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        ...(Platform.OS === 'web' && {
            userSelect: 'none',
        }),
        },
        activeTypeButtonText: {
        fontWeight: 'bold',
        },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalContentWeb: {
    borderWidth: 1,
    borderColor: '#3E3E3E',
  },
  modalHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#3E3E3E',
    padding: 16,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalBody: {
    padding: 16,
    gap: 16,
  },
  inputContainer: {
    width: '100%',
  },
  inputLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#3E3E3E',
    fontSize: 14,
  },
  typeContainer: {
    width: '100%',
  },
  typeSelector: {
    flexDirection: 'column',
    gap: 8,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
  typeButton: {
    backgroundColor: '#1A1A1A',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3E3E3E',
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    }),
  },
  activeTypeButton: {
    backgroundColor: '#4A90E2',
    borderColor: '#5C9EE6',
  },
  typeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    ...(Platform.OS === 'web' && {
      userSelect: 'none',
    }),
  },
  activeTypeButtonText: {
    fontWeight: 'bold',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#3E3E3E',
    gap: 8,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    }),
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
  saveButton: {
    backgroundColor: '#34C759',
  },
  disabledButton: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#3E3E3E',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    ...(Platform.OS === 'web' && {
      userSelect: 'none',
    }),
  },
  disabledButtonText: {
    color: '#666666',
  },
});

// Add web-specific hover styles
if (Platform.OS === 'web') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    .typeButton:hover {
      background-color: #3A3A3A;
      transform: translateY(-1px);
    }
    
    .activeTypeButton:hover {
      background-color: #5C9EE6;
    }
    
    .cancelButton:hover {
      background-color: #FF4B40;
    }
    
    .saveButton:hover {
      background-color: #44D769;
    }
    
    .disabledButton:hover {
      background-color: #1A1A1A;
      transform: none;
    }
  `;
  document.head.appendChild(styleSheet);
}