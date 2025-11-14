import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

export default function App() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    try {
      setLoading(true);
      setError(null);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Permiso a acceder ubicación denegado");
        setLoading(false);
        return;
      }
      let lastKnown = await Location.getLastKnownPositionAsync({});
      if (lastKnown) {
        setLocation(lastKnown.coords);
        setLoading(false);
        return;
      }
      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        maximumAge: 10000,
      });
      setLocation(currentLocation.coords);
      setLoading(false);
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>📍 Obteniendo ubicación...</Text>
      </View>
    );
  }
  if (error || !location) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error || "Error desconocido"}</Text>
        <TouchableOpacity onPress={getLocation} style={styles.button}>
          <Text style={styles.buttonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="Tu ubicación"
          description={`Lat: ${location.latitude.toFixed(
            6
          )}, Lon: ${location.longitude.toFixed(6)}`}
          pinColor="red"
        />
      </MapView>
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Tu ubicación 📍</Text>
        <Text style={styles.infoText}>
          {" "}
          Latitud: {location.latitude.toFixed(6)}
        </Text>
        <Text style={styles.infoText}>
          {" "}
          Longitud: {location.longitude.toFixed(6)}
        </Text>
      </View>
      <TouchableOpacity onPress={getLocation} style={styles.refreshButton}>
        <Text style={styles.buttonText}>Actualizar ubicación🔄</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  map: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  loadingText: {
    fontSize: 18,
    color: "#333",
    fontWeight: "600",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    marginBottom: 20,
  },
  infoContainer: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
    marginVertical: 2,
  },
  infoText: {
    fontSize: 14,
    color: "#555",
    marginVertical: 2,
  },
  refreshButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    backgroundColor: "#3498db",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});