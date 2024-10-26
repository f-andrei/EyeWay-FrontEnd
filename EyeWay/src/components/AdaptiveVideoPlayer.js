import React, { useEffect, useRef, useState } from 'react';
import { View, Platform, Dimensions } from 'react-native';
import { Video } from 'expo-av';
import Hls from 'hls.js';

const AdaptiveVideoPlayer = ({ 
  source, 
  style, 
  videoProps = {} 
}) => {
  const videoRef = useRef(null);
  const [dimensions, setDimensions] = useState({
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  });

  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleResize = () => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  useEffect(() => {
    if (Platform.OS === 'web') {
      const video = videoRef.current;
      if (!video) return;

      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90,
        });
        
        hls.loadSource(source.uri);
        hls.attachMedia(video);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(error => {
            console.warn("Playback failed:", error);
          });
        });

        return () => {
          hls.destroy();
        };
      } 
      else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source.uri;
        video.addEventListener('loadedmetadata', () => {
          video.play().catch(error => {
            console.warn("Playback failed:", error);
          });
        });
      }
    }
  }, [source.uri]);

  if (Platform.OS === 'web') {
    return (
      <video
        ref={videoRef}
        controls
        style={{
          ...style,
          objectFit: 'contain',
          backgroundColor: '#000',
        }}
        {...videoProps}
        playsInline
      />
    );
  }

  return (
    <Video
      ref={videoRef}
      source={source}
      rate={1.0}
      volume={1.0}
      isMuted={false}
      resizeMode="contain"
      shouldPlay
      isLooping
      useNativeControls
      style={style}
      {...videoProps}
    />
  );
};

export default AdaptiveVideoPlayer;