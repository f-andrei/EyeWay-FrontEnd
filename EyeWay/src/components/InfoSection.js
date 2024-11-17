import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const InfoSection = ({
  mode,
  currentLinePair,
  linePairs,
  rois,
  isDrawingROI,
  roiPoints,
  infoText
}) => {
  return (
    <View style={styles.infoContainer}>
      <Text style={styles.infoText}>{infoText}</Text>
      <Text style={styles.infoText}>
        Pares de linhas criados: {linePairs.length}
        {mode === 'ROI' && ` | Regiões de interesse criadas: ${rois.length}`}
        {isDrawingROI && ` | Pontos no polígono atual: ${roiPoints.length}`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
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
});