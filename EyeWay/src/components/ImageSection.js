// ImageSection.js
import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { UploadButton } from './UploadButton';

export const ImageSection = ({
  uploadedImage,
  canvasRef,
  handleStartDrawing,
  handleDrawing,
  handleEndDrawing,
  handleCanvasClick,
  mode,
  dimensions,
  isWeb,
  pickImage,
  imageLoaded,
  onImageLoad
}) => {
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

  const { width, height } = getCanvasDimensions();

  const handleImageLoad = () => {
    console.log('Image loaded in ImageSection');
    if (onImageLoad) {
      onImageLoad(true);
    }
  };

  const getCanvasProps = () => {
    const baseProps = {
      ref: canvasRef,
      width: width,
      height: height,
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        cursor: 'crosshair',
      },
      onClick: mode === 'ROI' ? handleCanvasClick : undefined,
    };

    if (mode === 'LINE') {
      return {
        ...baseProps,
        onMouseDown: handleStartDrawing,
        onMouseMove: handleDrawing,
        onMouseUp: handleEndDrawing,
        onMouseLeave: handleEndDrawing,
      };
    }

    return baseProps;
  };

  if (isWeb) {
    return (
      <View style={[styles.imageContainer, { width, height }]}>
        {uploadedImage ? (
          <>
            <Image
              source={{ uri: uploadedImage }}
              style={styles.image}
              onLoad={handleImageLoad}
              onError={(error) => {
                console.error('Image loading error:', error);
              }}
            />
            <canvas {...getCanvasProps()} />
          </>
        ) : (
          <UploadButton onPress={pickImage} />
        )}
      </View>
    );
  }

  return (
    <View style={[styles.imageContainer, { width, height }]}>
      {uploadedImage ? (
        <Image
          source={{ uri: uploadedImage }}
          style={styles.image}
          onLoad={handleImageLoad}
          onError={(error) => console.error('Image loading error:', error)}
        />
      ) : (
        <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
          <UploadButton onPress={pickImage} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
    position: 'relative',
  },
  uploadButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});