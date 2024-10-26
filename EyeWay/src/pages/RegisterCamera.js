import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import Navbar from '../components/Navbar';

export default function CameraRegistration({ navigation }) {
  const [cameraInfo, setCameraInfo] = useState({
    id: '',
    location: '',
    description: '',
  });
  
  const [mode, setMode] = useState('LINE');
  const [lines, setLines] = useState([]);
  const [rois, setRois] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const [currentShape, setCurrentShape] = useState([]);
  const canvasRef = useRef(null);
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const isWeb = Platform.OS === 'web';
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

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

  useEffect(() => {
    if (canvasRef.current && isWeb && imageLoaded) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      
      lines.forEach(line => {
        ctx.beginPath();
        ctx.moveTo(line[0].x, line[0].y);
        ctx.lineTo(line[1].x, line[1].y);
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 3;
        ctx.stroke();
      });
      
      rois.forEach(roi => {
        ctx.beginPath();
        ctx.moveTo(roi[0].x, roi[0].y);
        roi.forEach(point => ctx.lineTo(point.x, point.y));
        ctx.closePath();
        ctx.strokeStyle = '#00FF00';
        ctx.lineWidth = 3;
        ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
        ctx.fill();
        ctx.stroke();
      });
      
      if (currentShape.length > 0) {
        ctx.beginPath();
        ctx.moveTo(currentShape[0].x, currentShape[0].y);
        currentShape.forEach(point => ctx.lineTo(point.x, point.y));
        if (mode === 'ROI') ctx.closePath();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
        ctx.stroke();
      }
    }
  }, [lines, rois, currentShape, mode, imageLoaded]);

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

  const handleStartDrawing = (event) => {
    if (!drawing) {
      const point = getPointFromEvent(event);
      setCurrentShape([point]);
      setDrawing(true);
    }
  };

  const handleDrawing = (event) => {
    if (drawing) {
      const point = getPointFromEvent(event);
      if (mode === 'LINE') {
        setCurrentShape([currentShape[0], point]);
      } else if (mode === 'ROI') {
        setCurrentShape([...currentShape, point]);
      }
    }
  };

  const handleEndDrawing = () => {
    if (drawing) {
      if (mode === 'LINE' && currentShape.length === 2) {
        setLines([...lines, currentShape]);
      } else if (mode === 'ROI' && currentShape.length >= 3) {
        setRois([...rois, currentShape]);
      }
      setCurrentShape([]);
      setDrawing(false);
    }
  };

  const getPointFromEvent = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  };

  const handleUndo = () => {
    if (mode === 'LINE' && lines.length > 0) {
      setLines(lines.slice(0, -1));
    } else if (mode === 'ROI' && rois.length > 0) {
      setRois(rois.slice(0, -1));
    }
  };

  const handleReset = () => {
    setLines([]);
    setRois([]);
    setCurrentShape([]);
    setDrawing(false);
  };

  const renderCanvas = () => {
    if (!isWeb) return null;

    const { width, height } = getCanvasDimensions();
    const containerStyle = {
      position: 'relative',
      width,
      height,
      marginBottom: 20,
      border: '2px solid #666',
      borderRadius: 8,
      overflow: 'hidden',
    };

    return (
      <div style={containerStyle}>
        {imageError ? (
          <div style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#2A2A2A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
          }}>
            <Text>No camera feed available</Text>
          </div>
        ) : (
          <img
            src="https://i.imgur.com/0h8Ned9.jpeg" 
            alt="Camera View"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              backgroundColor: '#2A2A2A',
            }}
            onLoad={() => {
              setImageLoaded(true);
              setImageError(false);
            }}
            onError={() => {
              console.error('Error loading image');
              setImageError(true);
              setImageLoaded(true);  
            }}
          />
        )}
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            cursor: mode === 'SELECT' ? 'pointer' : 'crosshair',
          }}
          onMouseDown={handleStartDrawing}
          onMouseMove={handleDrawing}
          onMouseUp={handleEndDrawing}
          onMouseLeave={handleEndDrawing}
        />
      </div>
    );
  };

  const renderToolbar = () => (
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
        <Text style={styles.toolButtonText}>ROI</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.toolButton, mode === 'SELECT' && styles.activeToolButton]}
        onPress={() => setMode('SELECT')}
      >
        <Text style={styles.toolButtonText}>Selecionar</Text>
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
  );

  const renderDrawingInfo = () => (
    <View style={styles.infoContainer}>
      <Text style={styles.infoText}>
        {mode === 'LINE' ? 
          'Clique e arraste para desenhar uma linha de cruzamento' :
          mode === 'ROI' ? 
          'Clique para adicionar pontos ao ROI, termine clicando próximo ao ponto inicial' :
          'Selecione uma forma para editar'}
      </Text>
      <Text style={styles.infoText}>
        Linhas: {lines.length} | ROIs: {rois.length}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, isWeb && styles.webContainer]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        style={isWeb && { height: '100vh' }}
      >
        <View style={styles.form}>
          <Text style={styles.title}>Registrar Câmera</Text>
          
          <TextInput
            style={styles.input}
            placeholder="ID da Câmera"
            placeholderTextColor="#999"
            value={cameraInfo.id}
            onChangeText={(text) => setCameraInfo({ ...cameraInfo, id: text })}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Localização"
            placeholderTextColor="#999"
            value={cameraInfo.location}
            onChangeText={(text) => setCameraInfo({ ...cameraInfo, location: text })}
          />
          
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Descrição"
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            value={cameraInfo.description}
            onChangeText={(text) => setCameraInfo({ ...cameraInfo, description: text })}
          />

          {renderToolbar()}
          {renderDrawingInfo()}
          {renderCanvas()}

          <TouchableOpacity 
            style={styles.saveButton}
            onPress={() => {
              console.log('Saving camera configuration:', {
                ...cameraInfo,
                lines,
                rois
              });
            }}
          >
            <Text style={styles.saveButtonText}>Salvar Configuração</Text>
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
    minHeight: '100vh',
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
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
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});