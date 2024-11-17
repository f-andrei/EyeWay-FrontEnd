import { Platform } from 'react-native';

const API_URL = Platform.OS === 'android' ? "http://10.0.2.2:3000" : "http://localhost:3000";

export const saveCameraData = async (cameraData) => {
  console.log(cameraData);
  const response = await fetch(`${API_URL}/cameras`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cameraData)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Erro ao salvar a câmera');
  }

  return response.json();
};