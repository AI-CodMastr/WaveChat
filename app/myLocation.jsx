import { View, Text, TouchableOpacity, StatusBar, Alert, Dimensions } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import * as Location from 'expo-location';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.02;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function MyLocationScreen() {
  const { user, updateUserInContext } = useAuth();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      try {
        setLoading(true);
        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });
      } catch (error) {
        console.error('Error getting location:', error);
        setErrorMsg('Error getting location');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleUpdateLocation = async () => {
    if (!location) {
      Alert.alert('Error', 'Unable to get your location');
      return;
    }

    try {
      setLoading(true);
      // Update Firestore document
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          updatedAt: new Date().toISOString()
        }
      });

      // Update context
      updateUserInContext({
        ...user,
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          updatedAt: new Date().toISOString()
        }
      });

      Alert.alert('Success', 'Location updated successfully');
    } catch (error) {
      console.error('Update location error:', error);
      Alert.alert('Error', 'Failed to update location');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />
      
      {/* Header */}
      <View style={{ paddingTop: 20 }} className="flex-row justify-between items-center px-4 bg-blue-500 pb-5 rounded-b-3xl shadow">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={{ fontSize: 24 }} className="font-semibold text-white">My Location</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Map View */}
      <View style={{ flex: 1, overflow: 'hidden' }}>
        {location ? (
          <MapView
            provider={PROVIDER_GOOGLE}
            style={{ flex: 1, width: '100%', height: '100%' }}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title={user?.username || "Your Location"}
              description="Your current location"
            />
          </MapView>
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-gray-500">
              {errorMsg || (loading ? 'Getting location...' : 'No location available')}
            </Text>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View className="p-4 space-y-3">
        <TouchableOpacity 
          onPress={handleUpdateLocation}
          disabled={loading || !location}
          className={`flex-row items-center justify-center p-4 rounded-xl ${loading || !location ? 'bg-blue-300' : 'bg-blue-500'}`}
        >
          <Text className="text-white font-medium text-lg">
            {loading ? <Text>Updating Location...</Text> : <Text>Update My Location</Text>}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={async () => {
            try {
              setLoading(true);
              let currentLocation = await Location.getCurrentPositionAsync({});
              setLocation({
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
              });
            } catch (error) {
              Alert.alert('Error', 'Failed to refresh location');
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
          className="flex-row items-center justify-center p-4 bg-gray-100 rounded-xl"
        >
          <Ionicons name="refresh" size={24} color="#3B82F6" />
          <Text className="ml-2 text-blue-500 font-medium">Refresh Location</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
