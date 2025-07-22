import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  ScrollView,
  Linking,
} from 'react-native';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  PermissionStatus,
  Permission,
} from 'react-native-permissions';
import { useNavigation, CommonActions } from '@react-navigation/native';

// --- Interfaces ---
interface PermissionItemProps {
  icon: string;
  title: string;
  description: string;
  status: PermissionStatus;
}

// --- Components ---
const PermissionItem: React.FC<PermissionItemProps> = ({ icon, title, description, status }) => {
  const isGranted = status === RESULTS.GRANTED;
  const statusColor = isGranted ? '#4CAF50' : '#FF5252'; // Green for granted, red for denied
  const statusText = isGranted ? 'PERMISSION GRANTED' : 'PERMISSION DENIED';

  return (
    <View style={styles.permissionItem}>
      <View style={styles.permissionIconContainer}>
        <Text style={styles.permissionIcon}>{icon}</Text>
      </View>
      <View style={styles.permissionDetails}>
        <Text style={styles.permissionTitle}>{title}</Text>
        <Text style={styles.permissionDescription}>{description}</Text>
      </View>
      <View style={[styles.permissionStatusTag, { backgroundColor: statusColor }]}>
        <Text style={styles.permissionStatusText}>{statusText}</Text>
      </View>
    </View>
  );
};

// --- Main Permission Screen Component ---
const PermissionScreen: React.FC = () => {
  const navigation = useNavigation();

  // --- State Variables for Permission Status ---
  const [cameraStatus, setCameraStatus] = useState<PermissionStatus>(RESULTS.DENIED);
  const [locationStatus, setLocationStatus] = useState<PermissionStatus>(RESULTS.DENIED);
  const [smsStatus, setSmsStatus] = useState<PermissionStatus>(RESULTS.DENIED);
  const [phoneStatus, setPhoneStatus] = useState<PermissionStatus>(RESULTS.DENIED); // This will hold contacts status on iOS

  // --- Permission Mapping for Different Platforms ---
  const permissionMap = {
    camera: Platform.select({
      ios: PERMISSIONS.IOS.CAMERA,
      android: PERMISSIONS.ANDROID.CAMERA,
    }),
    location: Platform.select({
      ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    }),
    sms: Platform.select({
      ios: null, // iOS does not have a direct SMS read permission like Android
      android: PERMISSIONS.ANDROID.READ_SMS,
    }),
    phone: Platform.select({
      ios: PERMISSIONS.IOS.CONTACTS, // On iOS, 'phone' permission often relates to Contacts access
      android: PERMISSIONS.ANDROID.READ_PHONE_STATE,
    }),
  };

  // --- List of Required Permissions (for checking and display) ---
  // This array is dynamic based on the platform to ensure only relevant permissions are listed/checked.
  const requiredPermissions = [
    { name: 'Camera', permission: permissionMap.camera, setStatus: setCameraStatus, currentStatus: cameraStatus },
    { name: 'Location', permission: permissionMap.location, setStatus: setLocationStatus, currentStatus: locationStatus },
    // Conditionally add SMS and Phone/Contacts based on platform
    ...(Platform.OS === 'android' ? [
        { name: 'SMS', permission: permissionMap.sms, setStatus: setSmsStatus, currentStatus: smsStatus },
        { name: 'Phone', permission: permissionMap.phone, setStatus: setPhoneStatus, currentStatus: phoneStatus },
      ] : Platform.OS === 'ios' ? [
        // For iOS, if 'phone' maps to Contacts and you want to request/show it
        { name: 'Contacts', permission: permissionMap.phone, setStatus: setPhoneStatus, currentStatus: phoneStatus },
      ] : []), // Empty array if platform is neither Android nor iOS (e.g., web)
  ];

  // --- Helper Function to Request a Single Permission ---
  // This function now robustly handles both `Permission` type and `null`.
  const requestPermission = async (
    permission: Permission | null | undefined, // Added undefined for stricter typing from Platform.select
    setStatus: React.Dispatch<React.SetStateAction<PermissionStatus>>,
    permissionName: string
  ) => {
    if (permission) {
      const result = await request(permission);
      setStatus(result); // Update status immediately after request
      if (result === RESULTS.GRANTED) {
        // No alert here, success is handled by checkAndNavigateIfGranted
      } else if (result === RESULTS.DENIED || result === RESULTS.BLOCKED) {
        Alert.alert(
          'Permission Denied',
          `${permissionName} permission was denied. Please enable it in your device settings if you wish to proceed.`,
          [
            { text: 'OK' },
            { text: 'Go to Settings', onPress: () => Linking.openSettings() },
          ]
        );
      }
    } else {
      // Permission not applicable or not defined for the current platform
      Alert.alert('Permission Not Applicable', `${permissionName} permission is not applicable for this device's operating system.`);
      setStatus(RESULTS.UNAVAILABLE);
    }
  };

  // --- Function to Check All Required Permissions and Navigate ---
  const checkAndNavigateIfGranted = useCallback(async () => {
    let allGranted = true;
    const currentPermissionStates: { [key: string]: PermissionStatus } = {};

    // First, update all relevant permission states
    for (const perm of requiredPermissions) {
      if (perm.permission) { // Ensure permission is defined for the platform
        const result = await check(perm.permission);
        perm.setStatus(result); // Update the state for the individual permission
        currentPermissionStates[perm.name] = result; // Keep track for final check
      } else {
        perm.setStatus(RESULTS.UNAVAILABLE); // Mark as unavailable if not defined
        currentPermissionStates[perm.name] = RESULTS.UNAVAILABLE;
      }
    }

    // Now, check if all truly *required* permissions are granted
    // We only consider permissions required if they are defined for the platform and not UNAVAILABLE.
    for (const perm of requiredPermissions) {
      // If a permission is applicable to the platform AND it's not granted, then not all are granted.
      // SMS for iOS, for example, will be UNAVAILABLE, which is acceptable and won't block navigation.
      if (perm.permission && currentPermissionStates[perm.name] !== RESULTS.GRANTED) {
        allGranted = false;
        break;
      }
    }

    if (allGranted) {
      Alert.alert('Success!', 'All required permissions granted.');
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        })
      );
    }
  }, [navigation, requiredPermissions]); // Dependencies for useCallback

  // --- Effect Hook for Initial Permission Check ---
  useEffect(() => {
    // Initial check on component mount to set current statuses
    checkAndNavigateIfGranted();
  }, [checkAndNavigateIfGranted]); // Dependency for useEffect

  // --- Handler for "Give Permissions" Button ---
  const handleGivePermissions = async () => {
    // Request permissions one by one in sequence
    await requestPermission(permissionMap.camera, setCameraStatus, 'Camera');
    await requestPermission(permissionMap.location, setLocationStatus, 'Location');

    if (Platform.OS === 'android') {
      // Android-specific permissions. Use '!' as we've confirmed platform.
      await requestPermission(permissionMap.sms!, setSmsStatus, 'SMS');
      await requestPermission(permissionMap.phone!, setPhoneStatus, 'Phone');
    } else if (Platform.OS === 'ios') {
      // iOS-specific permissions
      // SMS is not applicable on iOS, so directly set its status for UI consistency
      setSmsStatus(RESULTS.UNAVAILABLE);

      // Request Contacts permission for iOS
      // No '!' needed here because permissionMap.phone is specifically defined for iOS
      await requestPermission(permissionMap.phone, setPhoneStatus, 'Contacts');
    }

    // After attempting to request all permissions, re-check their status and navigate if all granted.
    checkAndNavigateIfGranted();
  };

  // --- Render Method ---
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.header}>We need these permissions...</Text>

        <View style={styles.permissionList}>
          <PermissionItem
            icon="📷"
            title="Camera"
            description="To capture your selfie, auto-fill the data and for KYC verification."
            status={cameraStatus}
          />
          <PermissionItem
            icon="📍"
            title="Location"
            description="To check the company's service availability in your area"
            status={locationStatus}
          />

          {Platform.OS === 'android' && (
            <>
              <PermissionItem
                icon="💬"
                title="SMS"
                description="To collect and monitor SMS such as OTPs and other financial messages for personalization."
                status={smsStatus}
              />
              <PermissionItem
                icon="📞"
                title="Phone"
                description="To fetch the mobile number for OTP verification."
                status={phoneStatus}
              />
            </>
          )}

          {Platform.OS === 'ios' && (
            <>
              <PermissionItem
                icon="💬"
                title="SMS"
                description="SMS features are not applicable on iOS for direct access. Status will be 'Unavailable'."
                status={smsStatus}
              />
              <PermissionItem
                icon="👥" // Using a more appropriate icon for contacts
                title="Contacts"
                description="To access your contacts for simplified communication or friend recommendations."
                status={phoneStatus} // phoneStatus holds Contacts status on iOS
              />
            </>
          )}

        </View>
      </ScrollView>

      <TouchableOpacity style={styles.givePermissionButton} onPress={handleGivePermissions}>
        <Text style={styles.buttonText}>Give Permissions</Text>
      </TouchableOpacity>
    </View>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    paddingTop: 80, // Adjust for status bar
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  permissionList: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  permissionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0f7fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  permissionIcon: {
    fontSize: 22,
  },
  permissionDetails: {
    flex: 1,
    marginRight: 10,
  },
  permissionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  permissionDescription: {
    fontSize: 14,
    color: '#666',
  },
  permissionStatusTag: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  permissionStatusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  givePermissionButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PermissionScreen;