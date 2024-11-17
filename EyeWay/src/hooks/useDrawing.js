// useDrawing.js
import { useState, useCallback } from 'react';

export const useDrawing = () => {
  // Drawing mode state
  const [mode, setMode] = useState('LINE');
  
  // Line-related state
  const [lineType, setLineType] = useState('Contagem');
  const [linePairs, setLinePairs] = useState([]);
  const [currentLinePair, setCurrentLinePair] = useState({ 
    crossing: null, 
    direction: null, 
    type: null,
    name: null 
  });
  const [tempLine, setTempLine] = useState(null);
  const [showLineModal, setShowLineModal] = useState(false);
  
  // ROI-related state
  const [rois, setRois] = useState([]);
  const [roiType, setRoiType] = useState('Presença');
  const [isDrawingROI, setIsDrawingROI] = useState(false);
  const [roiPoints, setRoiPoints] = useState([]);
  const [tempROI, setTempROI] = useState(null);
  const [showRoiModal, setShowRoiModal] = useState(false);
  
  // General drawing state
  const [drawing, setDrawing] = useState(false);
  const [currentShape, setCurrentShape] = useState([]);

  // Line handlers
  const handleLineComplete = useCallback((points) => {
    console.log('Line complete:', points);
    if (points?.crossing && points?.direction) {
      const lineData = {
        crossing: points.crossing,
        direction: points.direction,
        type: lineType // Include the current lineType
      };
      console.log('Setting temp line:', lineData);
      setTempLine(lineData);
      setShowLineModal(true);
    }
  }, [lineType]); // Add lineType to dependencies

  const handleLineSave = useCallback(({ name, type }) => {
    console.log('Saving line:', { name, type, tempLine });
    if (tempLine && name) {
      const newLine = {
        crossing: tempLine.crossing,
        direction: tempLine.direction,
        type: type || 'Contagem',
        name: name.trim()
      };
      console.log('New line to add:', newLine);
      setLinePairs(prev => [...prev, newLine]);
      setTempLine(null);
    }
    setShowLineModal(false);
  }, [tempLine]);

  const handleLineModalClose = useCallback(() => {
    setShowLineModal(false);
    setTempLine(null);
    // Reset current line pair if user cancels
    if (currentLinePair.crossing && !currentLinePair.direction) {
      setCurrentLinePair({ crossing: null, direction: null, type: null, name: null });
    }
  }, [currentLinePair]);

  // ROI handlers
  const handleROIClick = useCallback((point) => {
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
  }, [isDrawingROI, roiPoints]);

  const handleROISave = useCallback(({ name, type }) => {
    if (tempROI) {
      const newROI = {
        points: tempROI,
        name,
        type,
        createdAt: new Date().toISOString()
      };
      setRois([...rois, newROI]);
      setTempROI(null);
    }
    setShowRoiModal(false);
  }, [tempROI, rois]);

  const handleRoiModalClose = useCallback(() => {
    setShowRoiModal(false);
    setTempROI(null);
  }, []);

  // Drawing handlers
  const handleDrawingMove = useCallback((point) => {
    if (drawing) {
      if (mode === 'LINE') {
        if (currentShape.length > 0) {
          setCurrentShape([currentShape[0], point]);
        }
      } else if (mode === 'ROI' && isDrawingROI) {
        // Show preview of ROI shape
        const previewPoints = [...roiPoints];
        if (previewPoints.length > 0) {
          setCurrentShape([...previewPoints, point]);
        }
      }
    }
  }, [drawing, mode, currentShape, isDrawingROI, roiPoints]);

  const handleDrawingStart = useCallback((point) => {
    if (!drawing) {
      setDrawing(true);
      if (mode === 'LINE') {
        setCurrentShape([point]);
      } else if (mode === 'ROI') {
        handleROIClick(point);
      }
    }
  }, [drawing, mode, handleROIClick]);

  const handleDrawingEnd = useCallback((point) => {
    if (drawing) {
      if (mode === 'LINE' && currentShape.length >= 1) {
        const linePoints = [...currentShape, point];
        console.log('Drawing end with points:', linePoints);
        
        if (!currentLinePair.crossing) {
          console.log('Setting crossing line');
          setCurrentLinePair({
            ...currentLinePair,
            crossing: linePoints,
            type: lineType
          });
        } else {
          console.log('Completing line pair');
          handleLineComplete({
            crossing: currentLinePair.crossing,
            direction: linePoints,
            type: lineType
          });
        }
      }
      setCurrentShape([]);
      setDrawing(false);
    }
  }, [drawing, mode, currentShape, currentLinePair, lineType, handleLineComplete]);

  // Handle undo action
  const handleUndo = useCallback(() => {
    if (mode === 'LINE') {
      if (currentLinePair.crossing) {
        setCurrentLinePair({ crossing: null, direction: null, type: null, name: null });
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
  }, [mode, currentLinePair, linePairs.length, roiPoints, rois.length]);

  // Handle reset/clear action
  const handleReset = useCallback(() => {
    setLinePairs([]);
    setCurrentLinePair({ crossing: null, direction: null, type: null, name: null });
    setTempLine(null);
    setShowLineModal(false);
    setRois([]);
    setRoiPoints([]);
    setIsDrawingROI(false);
    setTempROI(null);
    setShowRoiModal(false);
    setCurrentShape([]);
    setDrawing(false);
  }, []);

  // Mode change handler
  const handleModeChange = useCallback((newMode) => {
    if (newMode !== mode) {
      // Clean up current drawing state when switching modes
      setCurrentShape([]);
      setDrawing(false);
      if (mode === 'LINE' && currentLinePair.crossing) {
        setCurrentLinePair({ crossing: null, direction: null, type: null, name: null });
      } else if (mode === 'ROI') {
        setRoiPoints([]);
        setIsDrawingROI(false);
      }
      setMode(newMode);
    }
  }, [mode, currentLinePair]);

  return {
    // Mode
    mode,
    setMode: handleModeChange,
    
    // Line drawing
    lineType,
    setLineType,
    linePairs,
    setLinePairs,
    currentLinePair,
    setCurrentLinePair,
    showLineModal,
    handleLineSave,
    handleLineModalClose,
    handleLineComplete,
    
    // ROI drawing
    rois,
    setRois,
    roiType,
    setRoiType,
    isDrawingROI,
    setIsDrawingROI,
    roiPoints,
    setRoiPoints,
    showRoiModal,
    handleROISave,
    handleRoiModalClose,
    
    // General drawing
    drawing,
    setDrawing,
    currentShape,
    setCurrentShape,
    
    // Event handlers
    handleROIClick,
    handleDrawingMove,
    handleDrawingStart,
    handleDrawingEnd,
    handleUndo,
    handleReset
  };
};