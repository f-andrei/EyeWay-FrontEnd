// hooks/useImageHandler.js
import { useState, useCallback } from 'react';
import { Alert, Image, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export const useImageHandler = (onImageUpdate) => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

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

  const handleImageSize = async (imageUri) => {
    return new Promise((resolve, reject) => {
      if (Platform.OS === 'web') {
        const img = document.createElement('img');
        img.onload = () => {
          resolve({
            width: img.naturalWidth,
            height: img.naturalHeight
          });
        };
        img.onerror = reject;
        img.src = imageUri;
      } else {
        Image.getSize(
          imageUri,
          (width, height) => {
            resolve({ width, height });
          },
          (error) => {
            console.error('Error getting image size:', error);
            reject(error);
          }
        );
      }
    });
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        const message = 'Sorry, we need camera roll permissions to make this work!';
        Platform.OS === 'web'
          ? window.alert(message)
          : Alert.alert("Permission Required", message);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setUploadedImage(imageUri);
        setImageLoaded(false);

        try {
          // Get base64 data
          const base64Image = await getBase64FromUri(imageUri);
          
          // Update camera info if callback exists
          if (typeof onImageUpdate === 'function') {
            onImageUpdate(prev => ({
              ...prev,
              imageData: base64Image
            }));
          }

          // Get image dimensions
          const dimensions = await handleImageSize(imageUri);
          setImageSize(dimensions);
          setImageLoaded(true);

        } catch (error) {
          console.error('Error processing image:', error);
          setImageLoaded(true);
          Alert.alert(
            "Error",
            "Não foi possível processar a imagem. Por favor, tente novamente."
          );
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      const errorMessage = "Não foi possível processar a imagem. Por favor, tente novamente.";
      Platform.OS === 'web'
        ? window.alert("Erro", errorMessage)
        : Alert.alert("Erro", errorMessage);
    }
  };

  return {
    uploadedImage,
    setUploadedImage,
    imageLoaded,
    setImageLoaded,
    imageSize,
    setImageSize,
    pickImage
  };
};