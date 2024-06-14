import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import Exif from 'react-native-exif';

// Exif mapping:
// 1: 0 degrees, no rotation
// 2: 0 degrees, mirrored
// 3: 180 degrees, upside down
// 4: 180 degrees, upside down and mirrored
// 5: 90 degrees, mirrored and rotated to the right
// 6: 90 degrees, rotated to the right
// 7: 90 degrees, mirrored and rotated to the left
// 8: 90 degrees, rotated to the left

export default function App() {
  const device = useCameraDevice('front');
  const camera = useRef(null);

  const { hasPermission, requestPermission } = useCameraPermission();
  useEffect(() => {
    requestPermission();
  }, []);

  return (
    <View style={styles.container}>
      {hasPermission && device && (
        <Camera
          isActive
          device={device}
          photo
          ref={camera}
          style={StyleSheet.absoluteFill}
          outputOrientation="preview"
        ></Camera>
      )}
      <Button
        title="take picture"
        onPress={async () => {
          const photo = await camera.current.takePhoto();
          const exif = await Exif.getExif(photo.path);
          console.log(photo.orientation);
          console.log(exif.Orientation);
          // photo.orientation is portrait but exif.Orientation is 7 on Android. !!! Error !!!
          // on iOS it works fine: Photo.orientation is landscape-left and exif.Orientation is 5.
        }}
      ></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
