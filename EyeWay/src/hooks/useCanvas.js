import { useEffect } from 'react';
import { Platform } from 'react-native';
import { drawLinePair, drawROI, drawCurrentShape, drawROIPoints } from '../utils/drawingUtils';

export const useCanvas = ({
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
}) => {
  useEffect(() => {
    if (canvasRef.current && Platform.OS === 'web' && imageLoaded) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      // Draw completed line pairs
      if (Array.isArray(linePairs) && linePairs.length > 0) {
        linePairs.forEach(pair => {
          if (pair?.crossing && pair?.direction) {
            drawLinePair(ctx, pair, imageToCanvasCoordinates);
          }
        });
      }

      // Draw current line pair if it exists
      if (currentLinePair?.crossing) {
        drawLinePair(ctx, {
          crossing: currentLinePair.crossing,
          direction: currentShape.length === 2 ? currentShape : undefined,
          type: currentLinePair.type
        }, imageToCanvasCoordinates);
      }

      // Draw completed ROIs
      if (Array.isArray(rois) && rois.length > 0) {
        rois.forEach(roi => {
          if (roi?.points || Array.isArray(roi)) {
            drawROI(ctx, roi, imageToCanvasCoordinates);
          }
        });
      }

      // Draw current ROI points and preview
      if (mode === 'ROI') {
        if (Array.isArray(roiPoints) && roiPoints.length > 0) {
          drawROIPoints(ctx, roiPoints, imageToCanvasCoordinates);
        }
        if (Array.isArray(currentShape) && currentShape.length > 0) {
          drawCurrentShape(ctx, currentShape, mode, imageToCanvasCoordinates);
        }
      }
      
      // Draw current shape for line mode
      if (mode === 'LINE' && !currentLinePair?.crossing && Array.isArray(currentShape) && currentShape.length > 0) {
        drawCurrentShape(ctx, currentShape, mode, imageToCanvasCoordinates);
      }
    }
  }, [
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
  ]);
};