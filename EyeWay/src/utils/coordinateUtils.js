export const coordinateUtils = (canvasRef, imageSize) => {
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
  
    return {
      canvasToImageCoordinates,
      imageToCanvasCoordinates
    };
  };