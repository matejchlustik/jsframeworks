import { StyleSheet, Text, View, Button } from 'react-native';
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import now from 'performance-now';

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let beforeModule = now();
      let before = performance.now();
      let location = await Location.getCurrentPositionAsync({});
      let after = performance.now();
      let afterModule = now();
      console.log(after - before, " miliseconds");
      console.log(afterModule - beforeModule, "module miliseconds");
      setLocation(location);
    })();
  }, []);

  const getloc = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }
    let beforeModule = now();
    let before = performance.now();
    let location = await Location.getCurrentPositionAsync({});
    let after = performance.now();
    let afterModule = now();
    console.log(after - before, " miliseconds");
    console.log(afterModule - beforeModule, "module miliseconds");
    setLocation(location);
  }


  return (
    <View style={styles.container}>
      {location ?
        <View>
          <Text style={styles.paragraph}>latitude: {location.coords.latitude}</Text>
          <Text style={styles.paragraph}>longitude: {location.coords.longitude}</Text>
          <Text style={styles.paragraph}>accuracy: {location.coords.accuracy}</Text>
          <Button title="retry" onPress={getloc} />
        </View>
        :
        errorMsg ?
          <Text>Permission not granted</Text>
          :
          <Text>Waiting...</Text>
      }
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
