import React, { useState, useRef, useEffect } from 'react';
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
import Navbar from '../components/Navbar';
import axios from 'axios';

export default function CameraRegistration({ navigation, route}) {
    const camera_id = route.params?.camera_id;
    console.log(camera_id);
  const [cameraInfo, setCameraInfo] = useState({
    name: '',
    location: '',
    address: '',
    type: '',
    imageData: null  
  });
  
  const [mode, setMode] = useState('LINE');
  const [lineType, setLineType] = useState('Contagem');
  const [linePairs, setLinePairs] = useState([]);
  const [currentLinePair, setCurrentLinePair] = useState({ crossing: null, direction: null, type: null });
  const [rois, setRois] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const [currentShape, setCurrentShape] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const canvasRef = useRef(null);
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const isWeb = Platform.OS === 'web';
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const imageRef = useRef(null);
  const API_URL = Platform.OS === 'android' 
  ? "http://10.0.2.2:3000" 
  : "http://localhost:3000"

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

  const canvasToImageCoordinates = (point) => {
    if (!canvasRef.current || !imageSize.width || !imageSize.height) return point;
    
    const canvas = canvasRef.current;
    const scaleX = imageSize.width / canvas.width;
    const scaleY = imageSize.height / canvas.height;
    
    return {
      x: Math.round(point.x * scaleX),
      y: Math.round(point.y * scaleY)
    };
  };

  const imageToCanvasCoordinates = (point) => {
    if (!canvasRef.current || !imageSize.width || !imageSize.height) return point;
    
    const canvas = canvasRef.current;
    const scaleX = canvas.width / imageSize.width;
    const scaleY = canvas.height / imageSize.height;
    
    return {
      x: Math.round(point.x * scaleX),
      y: Math.round(point.y * scaleY)
    };
  };

  const getBase64FromUri = async (uri) => {
    if (Platform.OS === 'web') {
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
    } else {

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
    }
  };

  useEffect(() => {
    if (camera_id) {
        axios.get(`${API_URL}/cameras/${camera_id}`)
            .then(response => {
                setCameraInfo(response.data);
                setUploadedImage(response.data.imageData)
                setImageLoaded(true);
                setImageSize(response.data.imageSize);
            })
            .catch(error => {
                console.error("Erro ao buscar dados da camera:", error);
            });
    }
}, [camera_id]);

  useEffect(() => {
    if (canvasRef.current && isWeb && imageLoaded) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      linePairs.forEach(pair => {
        const crossingStart = imageToCanvasCoordinates(pair.crossing[0]);
        const crossingEnd = imageToCanvasCoordinates(pair.crossing[1]);
        const directionStart = imageToCanvasCoordinates(pair.direction[0]);
        const directionEnd = imageToCanvasCoordinates(pair.direction[1]);

        ctx.beginPath();
        ctx.moveTo(crossingStart.x, crossingStart.y);
        ctx.lineTo(crossingEnd.x, crossingEnd.y);
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(directionStart.x, directionStart.y);
        ctx.lineTo(directionEnd.x, directionEnd.y);
        ctx.strokeStyle = '#FFFF00';
        ctx.lineWidth = 3;
        ctx.stroke();

        const angle = Math.atan2(
          directionEnd.y - directionStart.y,
          directionEnd.x - directionStart.x
        );
        const arrowLength = 20;
        const arrowAngle = Math.PI / 6;

        ctx.beginPath();
        ctx.moveTo(directionEnd.x, directionEnd.y);
        ctx.lineTo(
          directionEnd.x - arrowLength * Math.cos(angle - arrowAngle),
          directionEnd.y - arrowLength * Math.sin(angle - arrowAngle)
        );
        ctx.moveTo(directionEnd.x, directionEnd.y);
        ctx.lineTo(
          directionEnd.x - arrowLength * Math.cos(angle + arrowAngle),
          directionEnd.y - arrowLength * Math.sin(angle + arrowAngle)
        );
        ctx.strokeStyle = '#FFFF00';
        ctx.stroke();
      });
      
      rois.forEach(roi => {
        const canvasRoi = roi.map(point => imageToCanvasCoordinates(point));
        ctx.beginPath();
        ctx.moveTo(canvasRoi[0].x, canvasRoi[0].y);
        canvasRoi.forEach(point => ctx.lineTo(point.x, point.y));
        ctx.closePath();
        ctx.strokeStyle = '#00FF00';
        ctx.lineWidth = 3;
        ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
        ctx.fill();
        ctx.stroke();
      });
      
      if (currentShape.length > 0) {
        const canvasShape = currentShape.map(point => imageToCanvasCoordinates(point));
        ctx.beginPath();
        ctx.moveTo(canvasShape[0].x, canvasShape[0].y);
        canvasShape.forEach(point => ctx.lineTo(point.x, point.y));
        if (mode === 'ROI') ctx.closePath();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
        ctx.stroke();
      }
    }
  }, [linePairs, currentLinePair, rois, currentShape, mode, imageLoaded]);
  const handleStartDrawing = (event) => {
    if (!drawing && uploadedImage) {
      if (mode === 'LINE' && !lineType) {
        if (isWeb) {
          window.alert("Por favor, selecione o tipo de linha antes de desenhar.");
        } else {
          Alert.alert(
            "Tipo de linha necessário",
            "Por favor, selecione o tipo de linha antes de desenhar."
          );
        }
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
        setCurrentShape([currentShape[0], imagePoint]);
      } else if (mode === 'ROI') {
        setCurrentShape([...currentShape, imagePoint]);
      }
    }
  };

  const handleSave = async () => {
    const isWeb = Platform.OS === 'web';
    
    if (!cameraInfo.name || !cameraInfo.location || !cameraInfo.address || !cameraInfo.type) {
      if (isWeb) {
        window.alert("Por favor, preencha todos os campos obrigatórios (nome, local, endereço e tipo).");
      } else {
        Alert.alert(
          "Campos obrigatórios",
          "Por favor, preencha todos os campos obrigatórios (nome, local, endereço e tipo)."
        );
      }
      return;
    }
  
    if (!uploadedImage || !imageSize.width || !imageSize.height || !cameraInfo.imageData) {
      if (isWeb) {
        window.alert("Por favor, faça upload de uma imagem antes de salvar.");
      } else {
        Alert.alert(
          "Imagem necessária",
          "Por favor, faça upload de uma imagem antes de salvar."
        );
      }
      return;
    }
  
    const typeMapping = {
      'YouTube Video': 'youtube_video',
      'YouTube Stream': 'youtube_stream',
      'IP Camera': 'ip_camera'
    };
  
    try {
      const response = await fetch(camera_id?`${API_URL}/cameras/${camera_id}`:`${API_URL}/cameras`,{
        method: camera_id?'PUT':'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
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
            type: pair.type 
          })),
          rois: rois
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao salvar a câmera');
      }
  
      const data = await response.json();
      
      if (isWeb) {
        if(camera_id){
            window.alert("Câmera atualizada com sucesso!");
        } else {
            window.alert("Câmera cadastrada com sucesso!");
        }
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
        navigation.navigate('Home');
      } else {
        Alert.alert(
          "Sucesso",
          "Câmera cadastrada com sucesso!",
          [
            {
              text: "OK",
              onPress: () => {
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
                navigation.navigate('Home');
              }
            }
          ]
        );
      }
  
    } catch (error) {
      if (isWeb) {
        window.alert(error.message || "Ocorreu um erro ao salvar a câmera. Tente novamente.");
      } else {
        Alert.alert(
          "Erro",
          error.message || "Ocorreu um erro ao salvar a câmera. Tente novamente.",
          [{ text: "OK" }]
        );
      }
    }
  };

  const handleEndDrawing = () => {
    if (drawing) {
      if (mode === 'LINE' && currentShape.length === 2) {
        if (!currentLinePair.crossing) {
          setCurrentLinePair({ ...currentLinePair, crossing: currentShape, type: lineType });
        } else {
          setLinePairs([...linePairs, {
            crossing: currentLinePair.crossing,
            direction: currentShape,
            type: currentLinePair.type
          }]);
          setCurrentLinePair({ crossing: null, direction: null });
        }
      } else if (mode === 'ROI' && currentShape.length >= 3) {
        setRois([...rois, currentShape]);
      }
      setCurrentShape([]);
      setDrawing(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
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
          }, (error) => {
            console.error('Error getting image size:', error);
            setImageLoaded(true);
          });
        }
      } catch (error) {
        Alert.alert(
          "Erro",
          "Não foi possível processar a imagem. Por favor, tente novamente.",
          [{ text: "OK" }]
        );
      }
    }
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

  const handleUndo = () => {
    if (mode === 'LINE') {
      if (currentLinePair.crossing) {
        setCurrentLinePair({ crossing: null, direction: null, type: null });
      } else if (linePairs.length > 0) {
        setLinePairs(linePairs.slice(0, -1));
      }
    } else if (mode === 'ROI' && rois.length > 0) {
      setRois(rois.slice(0, -1));
    }
  };

  const handleReset = () => {
    setLinePairs([]);
    setCurrentLinePair({ crossing: null, direction: null, type: null });
    setRois([]);
    setCurrentShape([]);
    setDrawing(false);
  };

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

  const renderImageSection = () => {
    const { width, height } = getCanvasDimensions();

    if (isWeb) {
      return (
        <View style={[styles.imageContainer, { width, height }]}>
          {uploadedImage ? (
            <>
              <Image
                source={{ uri: uploadedImage }}
                style={styles.image}
                onLoad={() => setImageLoaded(true)}
              />
              <canvas
                ref={canvasRef}
                width={width}
                height={height}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  cursor: 'crosshair',
                }}
                onMouseDown={handleStartDrawing}
                onMouseMove={handleDrawing}
                onMouseUp={handleEndDrawing}
                onMouseLeave={handleEndDrawing}
              />
            </>
          ) : (
            <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
              <Ionicons name="cloud-upload-outline" size={40} color="#FFFFFF" />
              <Text style={styles.uploadText}>Clique para enviar uma imagem de fundo</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    } else {
      return (
        <View style={[styles.imageContainer, { width, height }]}>
          <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
            {uploadedImage ? (
              <Image source={{ uri: uploadedImage }} style={styles.image} />
            ) : (
              <>
                <Ionicons name="cloud-upload-outline" size={40} color="#FFFFFF" />
                <Text style={styles.uploadText}>Tap to upload image</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      );
    }
  };

  const getInfoText = () => {
    if (mode === 'LINE') {
      if (!currentLinePair.crossing) {
        return 'Desenhe a linha de cruzamento (deve ser perpendicular à linha de direção)';
      }
      return 'Desenhe a linha de direção (deve ser paralela à linha de cruzamento)';
    }
    return 'Desenhe a região de interesse (clique para adicionar pontos e feche a forma)';
  };

  return (
    <View style={[styles.container, isWeb && styles.webContainer]}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          style={isWeb ? { height: 'calc(100vh - 60px)' } : { flex: 1 }} 
        >
        <View style={styles.form}>
          <View style={styles.headerContainer}>
            <Ionicons name="videocam-outline" size={32} color="#C26015" />
            <Text style={styles.title}>Atualizar Camera Cadastrada</Text>
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

          <Text style={styles.typeLabel}>Tipo de midia</Text>
          <View style={styles.toolbar}>
            <TouchableOpacity 
              style={[
                styles.toolButton,
                cameraInfo.type === 'YouTube Video' && styles.activeToolButton
              ]}
              onPress={() => setCameraInfo({ ...cameraInfo, type: 'YouTube Video' })}
            >
              <Text style={styles.toolButtonText}>YouTube Video</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.toolButton,
                cameraInfo.type === 'YouTube Stream' && styles.activeToolButton
              ]}
              onPress={() => setCameraInfo({ ...cameraInfo, type: 'YouTube Stream' })}
            >
              <Text style={styles.toolButtonText}>YouTube Stream</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.toolButton,
                cameraInfo.type === 'IP Camera' && styles.activeToolButton
              ]}
              onPress={() => setCameraInfo({ ...cameraInfo, type: 'IP Camera' })}
            >
              <Text style={styles.toolButtonText}>IP Camera</Text>
            </TouchableOpacity>
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
            <TouchableOpacity style={styles.toolButton} onPress={handleUndo}>
              <Text style={styles.toolButtonText}>Desfazer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.toolButton} onPress={handleReset}>
              <Text style={styles.toolButtonText}>Limpar</Text>
            </TouchableOpacity>
          </View>

          {mode === 'LINE' && (
            <>
              <Text style={styles.typeLabel}>
                {!lineType ? 'Selecione o tipo de ação que a linha irá realizar.' : 'Tipo de linha selecionado: ' + lineType}
              </Text>
              <View style={styles.toolbar}>
                <TouchableOpacity
                  style={[
                    styles.toolButton,
                    lineType === 'Contagem' && styles.activeToolButton
                  ]}
                  onPress={() => setLineType('Contagem')}
                >
                  <Text style={styles.toolButtonText}>Contagem</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.toolButton,
                    lineType === 'Conversão proibida' && styles.activeToolButton
                  ]}
                  onPress={() => setLineType('Conversão proibida')}
                >
                  <Text style={styles.toolButtonText}>Conversão proibida</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>{getInfoText()}</Text>
            <Text style={styles.infoText}>
              Pares de linhas criados: {linePairs.length} | Regiões de interesse criadas: {rois.length}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
          >
            <Ionicons name="save-outline" size={24} color="#FFFFFF" style={styles.buttonIcon} />
            <Text style={styles.saveButtonText}>Salvar configuração</Text>
          </TouchableOpacity>
          </View>
        </ScrollView>
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
    ...(Platform.OS === 'web' && {
      width: '100%',
    }),
  },
  form: {
    width: '90%',
    maxWidth: 800,
    alignItems: 'center',
    padding: 20,
    ...(Platform.OS === 'web' && {
      marginBottom: 60,  
    }),
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
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonIcon: {
    marginRight: 8,
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
});