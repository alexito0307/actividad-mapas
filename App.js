import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function App() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getLocation()
  }, [])

  async function getLocation() {
    try {
      setLoading(true);
      setError(null);
      let {status} = await Location.requestForegroundPermissionsAsync();
      if (status != 'granted') {
        setError('Permiso de ubicacion negado');
        setLoading(false);
        return
      }
      let lastKnown = await Location.getLastKnownPositionAsync({});
      if (lastKnown) {
        setLocation(lastKnown.coords);
        setLoading(false);
        return
      }
      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        maximumAge: 10000,
      });
      setLocation(currentLocation.coords);
      setLoading(false);
    } catch (err) {
      console.log('Error', err);
      setError(err.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  if (loading ) {
    return (
    <View style={styles.centerContainer}>
      <Text style={styles.loadingText}>📍 Obteniendo ubcacion</Text>
    </View>
  );
  }
  if (error || location) {
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
        <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} title='Tu ubicacion' description={`Lat: ${location.latitude.toFixed(6)}, Lon: ${location.longitude.toFixed(6)}`} pinColor='red'/> 
      </MapView>
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>📍 Tu ubicacion</Text>
        <Text style={styles.infoTitle}>Lon: {location.longitude.toFixed(6)}</Text>
        <Text style={styles.infoTitle}>Lat: {location.latitude.toFixed(6)}</Text>
      </View>
      <TouchableOpacity onPress={getLocation} style={styles.refreshButton}>
        <Text style={styles.buttonText}>🔄️ Actualizar Ubicacion</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  // Pantalla principal
  container: {
    flex: 1,
    backgroundColor: '#0F172A', // slate-900
  },

  // Map
  map: {
    flex: 1,
  },

  // Panel de info sobre el mapa
  infoContainer: {
    position: 'absolute',
    bottom: 90,
    left: 16,
    right: 16,
    padding: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(15, 23, 42, 0.85)', // fondo translúcido
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },

  infoTitle: {
    color: '#E2E8F0', // slate-200
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 4,
    fontWeight: '600',
  },

  // Botón flotante para refrescar
  refreshButton: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB', // azul principal
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },

  // Estados: cargando o error
  centerContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  loadingText: {
    color: '#E2E8F0',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },

  errorText: {
    color: '#FCA5A5', // rojo suave
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
  },

  // Botón genérico, para la vista de error
  button: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: '#334155', // slate-700
  },

  buttonText: {
    color: '#F8FAFC', // slate-50
    fontSize: 16,
    fontWeight: '600',
  },
});

