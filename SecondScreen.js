import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Geolocation from "react-native-geolocation-service";
import { check, PERMISSIONS, request } from "react-native-permissions";
export default function SecondScreen() {
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const status = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      console.log('status',status);
      if (status === "granted") {
        getCurrentLocation();
      } else {
        const result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        if (result === "granted") {
          getCurrentLocation();
        } else {
          console.warn("Location permission denied.");
        }
      }
    } catch (error) {
      console.error("Error checking or requesting location permission:", error);
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setRegion({
          ...region,
          latitude,
          longitude,
        });

        fetchNearbyHospitals({ latitude, longitude });
      },
      (error) => {
        console.error(error);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };
  const fetchNearbyHospitals = async ({ latitude, longitude }) => {
    try {
      const apiKey = "AIzaSyBWzvrDMpv2AwE7YLWLW6b-J4UyOLHjuOE";
      const radius = 5000; // in meters

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&types=hospital&key=${apiKey}`
      );
     
      console.log("response",response);

      const data = await response.json();
      console.log("data",data);

      if (data.results) {
        const hospitalMarkers = data.results.map((hospital) => ({
          coordinate: {
            latitude: hospital.geometry.location.lat,
            longitude: hospital.geometry.location.lng,
          },
          title: hospital.name,
          description: hospital.vicinity,
        }));

        setMarkers(hospitalMarkers);
      }
    } catch (error) {
      console.error("Error fetching nearby hospitals:", error);
    }
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region}>
        {markers.map((marker, index) => (
          <Marker key={index} coordinate={marker.coordinate} title={marker.title} description={marker.description} />
        ))}
      </MapView>
    </View>
  );
}

//create our styling code:
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1, //the container will fill the whole screen.
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});