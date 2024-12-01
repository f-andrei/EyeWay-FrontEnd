import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { LineInputModal } from '../components/LineInputModal';
import { ROIInputModal } from '../components/ROIInputModal';
import { LineTypeSelector } from '../components/LineTypeSelector';
import { InfoSection } from '../components/InfoSection';
import { ROITypeSelector } from '../components/ROITypeSelector';
import { useCanvas } from '../hooks/useCanvas';
import Navbar from '../components/Navbar';

export default function CameraRegistration({ navigation, route }) {
  const camera_id = route.params?.camera_id;
  const [cameraInfo, setCameraInfo] = useState({
    id: null,
    name: '',
    location: '',
    address: '',
    type: '',
    imageData: null
  });

  // Drawing state
  const [mode, setMode] = useState('LINE');
  const [lineType, setLineType] = useState('Contagem');
  const [linePairs, setLinePairs] = useState([]);
  const [rois, setRois] = useState([]);
  const [currentShape, setCurrentShape] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const [currentLinePair, setCurrentLinePair] = useState({ crossing: null, direction: null, type: null });
  
  // ROI specific state
  const [roiType, setRoiType] = useState('Presença');
  const [isDrawingROI, setIsDrawingROI] = useState(false);
  const [roiPoints, setRoiPoints] = useState([]);
  const [tempROI, setTempROI] = useState(null);
  const [showRoiModal, setShowRoiModal] = useState(false);

  // Line modal state
  const [showLineModal, setShowLineModal] = useState(false);
  const [tempLine, setTempLine] = useState(null);

  // Image and canvas state
  const [imageLoaded, setImageLoaded] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const canvasRef = useRef(null);
  const isWeb = Platform.OS === 'web';

  const API_URL = Platform.OS === 'android' 
    ? "http://10.0.2.2:3000" 
    : "http://localhost:3000";

  // Handle window resizing
  useEffect(() => {
    if (isWeb) {
      const handleResize = () => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        });
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Handle canvas resizing
  useEffect(() => {
    if (canvasRef.current && isWeb && imageLoaded) {
      const { width, height } = getCanvasDimensions();
      canvasRef.current.width = width;
      canvasRef.current.height = height;
    }
  }, [dimensions, imageLoaded]);

  const backendToUIType = {
    'youtube_video': 'YouTube Video',
    'youtube_stream': 'YouTube Stream',
    'ip_camera': 'IP Camera'
  };

  // Load camera data if editing
  useEffect(() => {
      if (camera_id) {
        axios.get(`${API_URL}/cameras/${camera_id}`)
          .then(response => {
            console.log('Camera data:', response.data);
            // Transform the type from backend format to UI format
            const uiType = backendToUIType[response.data.type] || '';
            setCameraInfo({
              ...response.data,
              type: uiType  // Use the mapped UI type
            });
            setUploadedImage(response.data.imageData);
            setImageLoaded(true);
            setImageSize(response.data.imageSize);
            
            if (response.data.linePairs) {
              setLinePairs(response.data.linePairs);
            }
            
            if (response.data.rois) {
              setRois(response.data.rois);
            }
          })
          .catch(error => {
            console.error("Error fetching camera data:", error);
          });
      }
  }, [camera_id]);

  const handleSave = useCallback(async () => {
    if (!cameraInfo.name || !cameraInfo.location || !cameraInfo.address || !cameraInfo.type) {
      const message = "Por favor, preencha todos os campos obrigatórios (nome, local, endereço e tipo).";
      isWeb ? window.alert("Campos obrigatórios", message) : Alert.alert("Campos obrigatórios", message);
      return;
    }
  
    if (!uploadedImage || !imageSize.width || !imageSize.height || !cameraInfo.imageData) {
      const message = "Por favor, faça upload de uma imagem antes de salvar.";
      isWeb ? window.alert("Imagem necessária", message) : Alert.alert("Imagem necessária", message);
      return;
    }
  
    const typeMapping = {
      'YouTube Video': 'youtube_video',
      'YouTube Stream': 'youtube_stream',
      'IP Camera': 'ip_camera'
    };
  
    try {
      const cameraData = {
        id: cameraInfo.id,
        name: cameraInfo.name,
        location: cameraInfo.location,
        address: cameraInfo.address,
        type: typeMapping[cameraInfo.type],
        imageSize: {
          width: imageSize.width,
          height: imageSize.height
        },
        imageData: cameraInfo.imageData,
        linePairs: linePairs.map(pair => ({
          crossing: [
            { x: pair.crossing[0].x, y: pair.crossing[0].y },
            { x: pair.crossing[1].x, y: pair.crossing[1].y }
          ],
          direction: [
            { x: pair.direction[0].x, y: pair.direction[0].y },
            { x: pair.direction[1].x, y: pair.direction[1].y }
          ],
          type: pair.type || 'Contagem',
          name: pair.name // Make sure name exists
        })),
        rois: rois.map(roi => ({
          points: roi.points,
          name: roi.name,
          type: roi.type
        }))
      };
      
      await saveCameraData(cameraData);
      
      const successMessage = "Câmera cadastrada com sucesso!";
      const handleSuccess = () => {
        setCameraInfo({
          name: '',
          location: '',
          address: '',
          type: '',
          imageData: null
        });
        setLinePairs([]);
        setRois([]);
        setUploadedImage(null);
        setImageLoaded(false);
        setImageSize({ width: 0, height: 0 });
        navigation.navigate('CamerasList');
      };

      if (isWeb) {
        window.alert("Sucesso", successMessage);
        handleSuccess();
      } else {
        Alert.alert("Sucesso", successMessage, [{ text: "OK", onPress: handleSuccess }]);
      }
    } catch (error) {
      console.log(error);
      const errorMessage = error.message || "Ocorreu um erro ao salvar a câmera. Tente novamente.";
      isWeb ? window.alert("Erro aqui", errorMessage) : Alert.alert("Erro", errorMessage);
    }
  }, [
    cameraInfo, uploadedImage, imageSize, linePairs, rois,
    isWeb, navigation, setLinePairs, setRois, setUploadedImage, setImageLoaded
  ]);

  const getInfoText = useCallback(() => {
    if (mode === 'LINE') {
      if (!currentLinePair.crossing) {
        return 'Desenhe a linha de cruzamento (deve ser perpendicular à linha de direção)';
      }
      return 'Desenhe a linha de direção (deve ser paralela à linha de cruzamento)';
    }
    if (isDrawingROI) {
      return 'Clique para adicionar pontos ao polígono. Clique próximo ao ponto inicial para fechar.';
    }
    return 'Clique para começar a desenhar uma região de interesse';
  }, [mode, currentLinePair, isDrawingROI]);

  const imageToCanvasCoordinates = (point) => {
    if (!canvasRef.current || !imageSize.width || !imageSize.height) {
      console.log('Missing ref or dimensions:', { ref: !!canvasRef.current, imageSize });
      return point;
    }
    
    const canvas = canvasRef.current;
    const { width: canvasWidth, height: canvasHeight } = getCanvasDimensions();
    
    if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
    }
    
    const scaleX = canvasWidth / imageSize.width;
    const scaleY = canvasHeight / imageSize.height;
    
    return {
      x: Math.round(point.x * scaleX),
      y: Math.round(point.y * scaleY)
    };
  };

  const saveCameraData = async (cameraData) => {
    const response = await fetch(`${API_URL}/cameras/${cameraData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cameraData)
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao salvar a câmera');
    }
  
    return response.json();
  };

  const canvasToImageCoordinates = (point) => {
    if (!canvasRef.current || !imageSize.width || !imageSize.height) {
      console.log('Missing ref or dimensions:', { ref: !!canvasRef.current, imageSize });
      return point;
    }
    
    const canvas = canvasRef.current;
    const { width: canvasWidth, height: canvasHeight } = getCanvasDimensions();
    
    if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
    }
    
    const scaleX = imageSize.width / canvasWidth;
    const scaleY = imageSize.height / canvasHeight;
    
    return {
      x: Math.round(point.x * scaleX),
      y: Math.round(point.y * scaleY)
    };
  };

  // Drawing handlers
  const handleROIClick = (point) => {
    if (!isDrawingROI) {
      setIsDrawingROI(true);
      setRoiPoints([point]);
    } else {
      const startPoint = roiPoints[0];
      const distance = Math.sqrt(
        Math.pow(point.x - startPoint.x, 2) + 
        Math.pow(point.y - startPoint.y, 2)
      );

      if (distance < 20 && roiPoints.length >= 3) {
        setTempROI([...roiPoints]);
        setShowRoiModal(true);
        setRoiPoints([]);
        setIsDrawingROI(false);
      } else {
        setRoiPoints([...roiPoints, point]);
      }
    }
  };

  const handleStartDrawing = (event) => {
    if (!drawing && uploadedImage) {
      if (mode === 'LINE' && !lineType) {
        const message = "Por favor, selecione o tipo de linha antes de desenhar.";
        isWeb ? window.alert(message) : Alert.alert("Tipo de linha necessário", message);
        return;
      }
      const canvasPoint = getPointFromEvent(event);
      const imagePoint = canvasToImageCoordinates(canvasPoint);
      setCurrentShape([imagePoint]);
      setDrawing(true);
    }
  };

  const handleDrawing = (event) => {
    if (drawing) {
      const canvasPoint = getPointFromEvent(event);
      const imagePoint = canvasToImageCoordinates(canvasPoint);
      
      if (mode === 'LINE') {
        setCurrentShape(prevShape => prevShape.length > 0 ? [prevShape[0], imagePoint] : [imagePoint]);
      } else if (mode === 'ROI') {
        setCurrentShape(prevShape => [...prevShape, imagePoint]);
      }
    }
  };

  const handleEndDrawing = () => {
    if (drawing) {
      if (mode === 'LINE' && currentShape.length === 2) {
        if (!currentLinePair.crossing) {
          setCurrentLinePair({
            crossing: currentShape,
            direction: null,
            type: lineType
          });
        } else {
          setTempLine({
            crossing: currentLinePair.crossing,
            direction: currentShape,
            type: lineType
          });
          setShowLineModal(true);
        }
      }
      setCurrentShape([]);
      setDrawing(false);
    }
  };

  const handleLineSave = (data) => {
    if (tempLine && data.name) {
      setLinePairs([...linePairs, {
        ...tempLine,
        name: data.name,
        type: data.type || lineType
      }]);
      setTempLine(null);
      setCurrentLinePair({ crossing: null, direction: null, type: null });
    }
    setShowLineModal(false);
  };

  const handleROISave = (data) => {
    if (tempROI && data.name) {
      setRois([...rois, {
        points: tempROI,
        name: data.name,
        type: data.type || roiType
      }]);
      setTempROI(null);
    }
    setShowRoiModal(false);
  };

  const handleUndo = () => {
    if (mode === 'LINE') {
      if (currentLinePair.crossing) {
        setCurrentLinePair({ crossing: null, direction: null, type: null });
      } else if (linePairs.length > 0) {
        setLinePairs(prev => prev.slice(0, -1));
      }
    } else if (mode === 'ROI') {
      if (roiPoints.length > 0) {
        setRoiPoints(prev => prev.slice(0, -1));
        if (roiPoints.length === 1) {
          setIsDrawingROI(false);
        }
      } else if (rois.length > 0) {
        setRois(prev => prev.slice(0, -1));
      }
    }
    setCurrentShape([]);
  };

  const handleReset = () => {
    setLinePairs([]);
    setCurrentLinePair({ crossing: null, direction: null, type: null });
    setRois([]);
    setRoiPoints([]);
    setIsDrawingROI(false);
    setCurrentShape([]);
    setDrawing(false);
  };

  // Canvas and image handling
  useCanvas({
    canvasRef,
    linePairs,
    rois,
    currentShape,
    mode,
    imageLoaded,
    imageToCanvasCoordinates,
    roiPoints,
    isDrawingROI,
    currentLinePair
  });

  const getCanvasDimensions = () => {
    if (isWeb) {
      const maxWidth = Math.min(dimensions.width * 0.9, 800);
      const maxHeight = maxWidth * 9 / 16;
      return { width: maxWidth, height: maxHeight };
    }
    return {
      width: dimensions.width * 0.9,
      height: (dimensions.width * 0.9) * 9 / 16
    };
  };

  const getPointFromEvent = (event) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  };

  const handleCanvasClick = (event) => {
    if (mode === 'ROI') {
      const canvasPoint = getPointFromEvent(event);
      const imagePoint = canvasToImageCoordinates(canvasPoint);
      handleROIClick(imagePoint);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      try {
        const base64Image = await getBase64FromUri(result.assets[0].uri);
        setUploadedImage(result.assets[0].uri);
        setImageLoaded(false);
        
        setCameraInfo(prev => ({
          ...prev,
          imageData: base64Image
        }));

        if (Platform.OS === 'web') {
          const img = document.createElement('img');
          img.onload = () => {
            setImageSize({
              width: img.naturalWidth,
              height: img.naturalHeight
            });
            setImageLoaded(true);
          };
          img.src = result.assets[0].uri;
        } else {
          Image.getSize(result.assets[0].uri, (width, height) => {
            setImageSize({ width, height });
            setImageLoaded(true);
          });
        }
      } catch (error) {
        Alert.alert('Error', 'Could not process the image. Please try again.');
      }
    }
  };

  const getBase64FromUri = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting image to base64:', error);
      throw error;
    }
  };

  const renderImageSection = () => {
    const { width, height } = getCanvasDimensions();

    return (
      <View style={[styles.imageContainer, { width, height }]}>
        {uploadedImage ? (
          <View style={{ width: '100%', height: '100%', position: 'relative' }}>
            <Image
              source={{ uri: uploadedImage }}
              style={[styles.image]}
              onLoad={() => {
                console.log('Image loaded in view');
                setImageLoaded(true);
              }}
            />
            {isWeb && (
              <canvas
                ref={canvasRef}
                width={width}
                height={height}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  cursor: 'crosshair',
                  zIndex: 1,
                  background: 'transparent'
                }}
                onClick={handleCanvasClick}
                onMouseDown={handleStartDrawing}
                onMouseMove={handleDrawing}
                onMouseUp={handleEndDrawing}
                onMouseLeave={handleEndDrawing}
              />
            )}
          </View>
        ) : (
          <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
            <Ionicons name="cloud-upload-outline" size={40} color="#FFFFFF" />
            <Text style={styles.uploadText}>Clique para enviar uma imagem de fundo</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        style={isWeb ? { height: 'calc(100vh - 60px)' } : { flex: 1 }}
      >
        <View style={styles.form}>
          <View style={styles.headerContainer}>
            <Ionicons name="videocam-outline" size={32} color="#C26015" />
            <Text style={styles.title}>
              {camera_id ? 'Update Camera' : 'Register Camera'}
            </Text>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Camera Name"
            placeholderTextColor="#999"
            value={cameraInfo.name}
            onChangeText={(text) => setCameraInfo({ ...cameraInfo, name: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="Location"
            placeholderTextColor="#999"
            value={cameraInfo.location}
            onChangeText={(text) => setCameraInfo({ ...cameraInfo, location: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="Address (IP or URL)"
            placeholderTextColor="#999"
            value={cameraInfo.address}
            onChangeText={(text) => setCameraInfo({ ...cameraInfo, address: text })}
          />

          <Text style={styles.typeLabel}>Tipo de midia</Text>
          <View style={styles.toolbar}>
            {['YouTube Video', 'YouTube Stream', 'IP Camera'].map((type) => (
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

          {renderImageSection()}

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
            <TouchableOpacity 
              style={styles.toolButton} 
              onPress={handleUndo}
            >
              <Text style={styles.toolButtonText}>Desfazer</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.toolButton} 
              onPress={handleReset}
            >
              <Text style={styles.toolButtonText}>Limpar</Text>
            </TouchableOpacity>
          </View>

          {/* {mode === 'LINE' && (
            <LineTypeSelector lineType={lineType} setLineType={setLineType} />
          )}

          {mode === 'ROI' && (
            <ROITypeSelector roiType={roiType} setRoiType={setRoiType} />
          )} */}

          <InfoSection 
            mode={mode}
            currentLinePair={currentLinePair}
            linePairs={linePairs}
            rois={rois}
            isDrawingROI={isDrawingROI}
            roiPoints={roiPoints}
            infoText={getInfoText()}
          />
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
          >
            <Ionicons name="save-outline" size={24} color="#FFFFFF" />
            <Text style={styles.saveButtonText}>Salvar configuração</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <LineInputModal
        visible={showLineModal}
        onClose={() => {
          setShowLineModal(false);
          setTempLine(null);
          setCurrentLinePair({ crossing: null, direction: null, type: null });
        }}
        onSave={handleLineSave}
        initialType={lineType}
      />

      <ROIInputModal
        visible={showRoiModal}
        onClose={() => {
          setShowRoiModal(false);
          setTempROI(null);
        }}
        onSave={handleROISave}
        initialType={roiType}
      />

      <Navbar navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3E3C3C',
  },
  webContainer: {
    ...(Platform.OS === 'web' && {
      height: '100vh',
      overflow: 'hidden',
    }),
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 20,
    paddingBottom: 90,
  },
  form: {
    width: '90%',
    maxWidth: 800,
    alignItems: 'center',
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
  typeLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 10,
    alignSelf: 'center',
  },
  imageContainer: {
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
    top: 0,
    left: 0,
  },
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
    padding: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
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
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    }),
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
    ...(Platform.OS === 'web' && {
      userSelect: 'none',
    }),
  },
  infoContainer: {
    width: '100%',
    backgroundColor: '#2A2A2A',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 5,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    }),
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    ...(Platform.OS === 'web' && {
      userSelect: 'none',
    }),
  },
});

// Add web-specific hover styles
if (Platform.OS === 'web') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    .toolButton:hover {
      background-color: #3A3A3A;
      transform: translateY(-1px);
    }
    
    .activeToolButton:hover {
      background-color: #5C9EE6;
    }
    
    .saveButton:hover {
      background-color: #45A049;
      transform: translateY(-1px);
    }
  `;
  document.head.appendChild(styleSheet);
}