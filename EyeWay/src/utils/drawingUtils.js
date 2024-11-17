// drawingUtils.js
export const drawArrow = (ctx, start, end) => {
  const angle = Math.atan2(end.y - start.y, end.x - start.x);
  const arrowLength = 20;
  const arrowAngle = Math.PI / 6;

  ctx.beginPath();
  ctx.moveTo(end.x, end.y);
  ctx.lineTo(
    end.x - arrowLength * Math.cos(angle - arrowAngle),
    end.y - arrowLength * Math.sin(angle - arrowAngle)
  );
  ctx.moveTo(end.x, end.y);
  ctx.lineTo(
    end.x - arrowLength * Math.cos(angle + arrowAngle),
    end.y - arrowLength * Math.sin(angle + arrowAngle)
  );
  ctx.strokeStyle = '#FFFF00';
  ctx.stroke();
};

export const drawLinePair = (ctx, pair, imageToCanvasCoordinates) => {
  // Check if pair has the required properties and points
  if (!pair?.crossing?.length || !pair?.direction?.length) {
    return;
  }

  try {
    const crossingStart = imageToCanvasCoordinates(pair.crossing[0]);
    const crossingEnd = imageToCanvasCoordinates(pair.crossing[1]);
    const directionStart = imageToCanvasCoordinates(pair.direction[0]);
    const directionEnd = imageToCanvasCoordinates(pair.direction[1]);

    // Draw crossing line
    ctx.beginPath();
    ctx.moveTo(crossingStart.x, crossingStart.y);
    ctx.lineTo(crossingEnd.x, crossingEnd.y);
    ctx.strokeStyle = '#FF0000';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw direction line
    ctx.beginPath();
    ctx.moveTo(directionStart.x, directionStart.y);
    ctx.lineTo(directionEnd.x, directionEnd.y);
    ctx.strokeStyle = '#FFFF00';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw arrow
    drawArrow(ctx, directionStart, directionEnd);

    // Draw name if it exists
    if (pair.name) {
      const centerX = (crossingStart.x + crossingEnd.x) / 2;
      const centerY = (crossingStart.y + crossingEnd.y) / 2;
      ctx.font = '14px Arial';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.fillText(pair.name, centerX, centerY - 10);
    }
  } catch (error) {
    console.error('Error drawing line pair:', error);
  }
};

export const drawROI = (ctx, roi, imageToCanvasCoordinates) => {
  // Check if roi has points property
  const points = roi.points || roi;
  if (!Array.isArray(points) || points.length === 0) {
    return;
  }

  try {
    const canvasRoi = points.map(point => imageToCanvasCoordinates(point));
    ctx.beginPath();
    ctx.moveTo(canvasRoi[0].x, canvasRoi[0].y);
    canvasRoi.forEach(point => ctx.lineTo(point.x, point.y));
    ctx.closePath();
    ctx.strokeStyle = '#00FF00';
    ctx.lineWidth = 3;
    ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
    ctx.fill();
    ctx.stroke();

    // Draw name if it exists
    if (roi.name) {
      const centerX = canvasRoi.reduce((sum, point) => sum + point.x, 0) / canvasRoi.length;
      const centerY = canvasRoi.reduce((sum, point) => sum + point.y, 0) / canvasRoi.length;
      ctx.font = '14px Arial';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.fillText(roi.name, centerX, centerY);
    }
  } catch (error) {
    console.error('Error drawing ROI:', error);
  }
};

export const drawROIPoints = (ctx, points, imageToCanvasCoordinates) => {
  if (!Array.isArray(points) || points.length === 0) {
    return;
  }

  try {
    const canvasPoints = points.map(point => imageToCanvasCoordinates(point));
    
    // Draw lines between points
    if (canvasPoints.length > 0) {
      ctx.beginPath();
      ctx.moveTo(canvasPoints[0].x, canvasPoints[0].y);
      canvasPoints.forEach(point => ctx.lineTo(point.x, point.y));
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // Draw points
    canvasPoints.forEach(point => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  } catch (error) {
    console.error('Error drawing ROI points:', error);
  }
};

export const drawCurrentShape = (ctx, currentShape, mode, imageToCanvasCoordinates) => {
  if (!Array.isArray(currentShape) || currentShape.length === 0) {
    return;
  }

  try {
    const canvasShape = currentShape.map(point => imageToCanvasCoordinates(point));
    ctx.beginPath();
    ctx.moveTo(canvasShape[0].x, canvasShape[0].y);
    canvasShape.forEach(point => ctx.lineTo(point.x, point.y));
    if (mode === 'ROI') ctx.closePath();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.stroke();
  } catch (error) {
    console.error('Error drawing current shape:', error);
  }
};