// useCanvas.js
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
  isDrawingROI
}) => {
  useEffect(() => {
    if (canvasRef.current && Platform.OS === 'web' && imageLoaded) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      // Draw line pairs
      if (Array.isArray(linePairs) && linePairs.length > 0) {
        linePairs.forEach(pair => {
          if (pair?.crossing && pair?.direction) {
            drawLinePair(ctx, pair, imageToCanvasCoordinates);
          }
        });
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
      if (mode === 'ROI' && Array.isArray(roiPoints) && roiPoints.length > 0) {
        drawROIPoints(ctx, roiPoints, imageToCanvasCoordinates);
      }

      // Draw current shape (for line drawing mode)
      if (Array.isArray(currentShape) && currentShape.length > 0) {
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
    isDrawingROI
  ]);
};