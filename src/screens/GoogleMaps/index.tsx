// import { View, Text ,StyleSheet,Platform} from 'react-native'
// import React,{useState} from 'react'
// import MapView, { Region ,PROVIDER_GOOGLE, Marker} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps

// export default function GoogleMapScreen() {
//   const isAndroid =  Platform.OS === 'android';
//     const [region, setRegion] = useState<Region>({
//   latitude: 37.78825,
//   longitude: -122.4324,
//   latitudeDelta: 0.015,
//   longitudeDelta: 0.0121,
// });
//   return (
//     <View style={styles.container}>
//      <MapView
       
//      provider={isAndroid ? PROVIDER_GOOGLE : undefined}
  
//        style={styles.map}
//        initialRegion={{
//          latitude: 19.1699746,
//          longitude: 73.0013554,
//          latitudeDelta: 0.0922,
//          longitudeDelta: 0.0421,
//        }}
//         onRegionChange={data=>console.log(data)}
        
//       >
//         <Marker
//           coordinate={{
//             latitude: 19.1699746,
//             longitude: 73.0013554,
//             llatitudeDelta: 0.0922,
//             longitudeDelta: 0.0421,
          
//         }}
//         />
//      </MapView>
//    </View>
//   )
// }
// const styles = StyleSheet.create({
//  container: {
//    ...StyleSheet.absoluteFillObject, 
//    justifyContent: 'flex-end',
//    alignItems: 'center',
//  },
//  map: {
//    ...StyleSheet.absoluteFillObject,
//  },
// });


 