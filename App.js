
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from "expo-file-system"
import now from 'performance-now';
import { useState } from 'react';



export default function App() {

  const [image, setImage] = useState(null);
  const [showImage, setShowImage] = useState(null);
  const [status, requestPermission] = ImagePicker.useCameraPermissions();

  const launchCamera = async () => {
    if (status.granted) {
      let image = await ImagePicker.launchCameraAsync({
        quality: 1,
        base64: true,
      })
      setImage(image);
    }
    if (!status.granted) {
      requestPermission()
    }
  }

  const saveFile = async () => {
    if (image) {
      let before = now();
      let x = await FileSystem.writeAsStringAsync(FileSystem.documentDirectory + "myfile.jpg", image.assets[0].base64);
      let after = now();
      console.log(after - before, " miliseconds to save image");
    }
  }

  const readFile = async () => {
    if (image) {
      try {
        let before = now();
        let file = await FileSystem.readAsStringAsync(FileSystem.documentDirectory + "myfile.jpg");
        let after = now();
        console.log(after - before, " miliseconds to read image");
        setShowImage(file);
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.showCameraButton} activeOpacity={0.7} onPress={launchCamera}>
        <View style={styles.showCameraButtonInner}>
          <Text style={styles.buttonText}>Take a picture</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.showCameraButton} activeOpacity={0.7} onPress={saveFile}>
        <View style={styles.showCameraButtonInner}>
          <Text style={styles.buttonText}>Save image</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.showCameraButton} activeOpacity={0.7} onPress={readFile}>
        <View style={styles.showCameraButtonInner}>
          <Text style={styles.buttonText}>Retrieve image</Text>
        </View>
      </TouchableOpacity>
      {showImage ?
        <Image style={{ width: 200, height: 200 }} source={{ uri: `data:image/jpg;base64,${showImage}` }} />
        : null
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  showCameraButton: {
    backgroundColor: "#267aff",
    padding: 10,
    width: '50%',
    borderRadius: 10,
    alignSelf: 'center',
    margin: 10
  },
  showCameraButtonInner: {
    alignItems: 'center',
  },
  buttonText: {
    color: 'white'
  }
});
