// screens/CameraRegistration.js
import React, { useRef, useCallback, useState } from 'react';
import { View, ScrollView, Alert, Platform, StyleSheet } from 'react-native';
import { CameraForm } from '../components/CameraForm';
import { ImageSection } from '../components/ImageSection';
import { DrawingToolbar } from '../components/DrawingToolbar';
import { LineTypeSelector } from '../components/LineTypeSelector';
import { LineInputModal } from '../components/LineInputModal';
import { ROITypeSelector } from '../components/ROITypeSelector';
import { ROIInputModal } from '../components/ROIInputModal';
import { InfoSection } from '../components/InfoSection';
import { SaveButton } from '../components/SaveButton';
import { useImageHandler } from '../hooks/useImageHandler';
import { useDrawing } from '../hooks/useDrawing';
import { useCanvas } from '../hooks/useCanvas';
import { useDimensions } from '../hooks/useDimensions';
import { coordinateUtils } from '../utils/coordinateUtils';
import { saveCameraData } from '../services/cameraAPI';
import Navbar from '../components/Navbar';

export default function CameraRegistration({ navigation }) {
  const canvasRef = useRef(null);
  const { dimensions, isWeb } = useDimensions();
  
  // Initialize state for camera information
  const [cameraInfo, setCameraInfo] = useState({
    name: '',
    location: '',
    address: '',
    type: '',
    imageData: null
  });

  // Create a memoized version of setCameraInfo
  const memoizedSetCameraInfo = useCallback((updater) => {
    if (typeof updater === 'function') {
      setCameraInfo(prevState => updater(prevState));
    } else {
      setCameraInfo(updater);
    }
  }, []);

  const {
    uploadedImage,
    setUploadedImage,
    imageLoaded,
    imageSize,
    setImageLoaded,
    setImageSize,
    pickImage
  } = useImageHandler(memoizedSetCameraInfo);

  const {
    // Mode
    mode,
    setMode,
    
    // Line drawing
    lineType,
    setLineType,
    linePairs,                // Add this
    setLinePairs,            // Add this
    currentLinePair,         // Add this
    setCurrentLinePair,      // Add this
    showLineModal,
    handleLineSave,
    handleLineModalClose,
    handleLineComplete,
    
    // ROI drawing
    rois,                    // Add this
    setRois,                // Add this
    roiType,
    setRoiType,
    isDrawingROI,           // Add this
    roiPoints,              // Add this
    showRoiModal,
    handleROISave,
    handleRoiModalClose,
    
    // Drawing state
    drawing,                // Add this
    setDrawing,            // Add this
    currentShape,          // Add this
    setCurrentShape,       // Add this
    
    // Event handlers
    handleROIClick,         // Add this
    handleDrawingStart,
    handleDrawingMove,
    handleDrawingEnd,
    handleUndo,
    handleReset
  } = useDrawing();
  // Get coordinate conversion utilities
  const { canvasToImageCoordinates, imageToCanvasCoordinates } = coordinateUtils(canvasRef, imageSize);

  // Setup canvas drawing effect
  useCanvas({
    canvasRef,
    linePairs,
    rois,
    currentShape,
    mode,
    imageLoaded,
    imageToCanvasCoordinates,
    roiPoints,
    isDrawingROI
  });

  // Drawing handlers
  const getPointFromEvent = useCallback((event) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }, []);

  const handleCanvasClick = useCallback((event) => {
    if (mode === 'ROI') {
      const canvasPoint = getPointFromEvent(event);
      const imagePoint = canvasToImageCoordinates(canvasPoint);
      handleROIClick(imagePoint);
    }
  }, [mode, getPointFromEvent, canvasToImageCoordinates, handleROIClick]);

  const handleStartDrawing = useCallback((event) => {
    if (!drawing && uploadedImage) {
      const canvasPoint = getPointFromEvent(event);
      const imagePoint = canvasToImageCoordinates(canvasPoint);
      setCurrentShape([imagePoint]);
      setDrawing(true);
    }
  }, [drawing, uploadedImage, getPointFromEvent, canvasToImageCoordinates]);

  const handleDrawing = useCallback((event) => {
    if (drawing) {
      const canvasPoint = getPointFromEvent(event);
      const imagePoint = canvasToImageCoordinates(canvasPoint);
      
      if (mode === 'LINE') {
        setCurrentShape([currentShape[0], imagePoint]);
      } else if (mode === 'ROI') {
        setCurrentShape([...currentShape, imagePoint]);
      }
    }
  }, [drawing, mode, currentShape, getPointFromEvent, canvasToImageCoordinates]);

  const handleEndDrawing = useCallback((event) => {
    if (drawing) {
      if (mode === 'LINE' && currentShape.length >= 1) {
        const canvasPoint = getPointFromEvent(event);
        const imagePoint = canvasToImageCoordinates(canvasPoint);
        const linePoints = [...currentShape, imagePoint];
        
        if (!currentLinePair.crossing) {
          setCurrentLinePair({
            ...currentLinePair,
            crossing: linePoints,
            type: lineType
          });
        } else {
          handleLineComplete({
            crossing: currentLinePair.crossing,
            direction: linePoints,
            type: currentLinePair.type
          });
        }
      }
      setCurrentShape([]);
      setDrawing(false);
    }
  }, [drawing, mode, currentShape, currentLinePair, lineType, handleLineComplete, getPointFromEvent, canvasToImageCoordinates]);
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

  // Save handler
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

  return (
    <View style={[styles.container, isWeb && styles.webContainer]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        style={isWeb ? { height: 'calc(100vh - 60px)' } : { flex: 1 }} 
      >
        <View style={styles.form}>
          <CameraForm 
            cameraInfo={cameraInfo}
            setCameraInfo={setCameraInfo}
            navigation={navigation}
          />
          
          <ImageSection
            uploadedImage={uploadedImage}
            canvasRef={canvasRef}
            handleStartDrawing={handleStartDrawing}
            handleDrawing={handleDrawing}
            handleEndDrawing={handleEndDrawing}
            handleCanvasClick={handleCanvasClick}
            mode={mode}
            dimensions={dimensions}
            isWeb={isWeb}
            pickImage={pickImage}
            imageLoaded={imageLoaded}
            onImageLoad={setImageLoaded}
          />
          
          <DrawingToolbar 
            mode={mode}
            setMode={setMode}
            handleUndo={handleUndo}
            handleReset={handleReset}
          />
          
          {/* Remove these selectors
          {mode === 'LINE' ? (
            <LineTypeSelector 
              lineType={lineType}
              setLineType={setLineType}
            />
          ) : (
            <ROITypeSelector 
              roiType={roiType}
              setRoiType={setRoiType}
            />
          )}
          */}
          
          <LineInputModal
            visible={showLineModal}
            onClose={handleLineModalClose}
            onSave={handleLineSave}
            initialType={lineType}
          />
          
          <ROIInputModal
            visible={showRoiModal}
            onClose={handleRoiModalClose}
            onSave={handleROISave}
            initialType={roiType}
          />
          
          <InfoSection 
            mode={mode}
            currentLinePair={currentLinePair}
            linePairs={linePairs}
            rois={rois}
            isDrawingROI={isDrawingROI}
            roiPoints={roiPoints}
            infoText={getInfoText()}
          />
          
          <SaveButton onPress={handleSave} />
        </View>

      </ScrollView>

      <Navbar navigation={navigation} />
    </View>
  );
}

// Existing styles remain the same
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
  form: {
    width: '90%',
    maxWidth: 800,
    alignItems: 'center',
    padding: 20,
    ...(Platform.OS === 'web' && {
      marginBottom: 60,
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
});