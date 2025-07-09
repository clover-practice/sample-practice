import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  Pressable,Platform
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface TopSearchBarProps {
  city: string;
  offerLabel: string;
  userInitial?: string;
  onPressAvatar?: () => void;
  onPressLocation?: () => void;
}

const TopSearchBar: React.FC<TopSearchBarProps> = ({
  city,
  offerLabel,
  userInitial = 'R',
  onPressAvatar,
  onPressLocation,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* Top row */}
      <View style={styles.topRow}>
        {/* Location */}
        <Pressable onPress={onPressLocation}>
          <View style={styles.locationContainer}>
            <Ionicons name="location-sharp" size={20} color="red" />
            <Text style={styles.cityText}>{city}</Text>
          </View>
        </Pressable>

        {/* Right side: offer + avatar */}
        <View style={styles.rightContainer}>
          <Pressable onPress={() => setModalVisible(true)}>
            <View style={styles.offerButton}>
              <Ionicons name="pricetag" size={14} color="#0f0" />
              <Text style={styles.offerText} numberOfLines={1}>
                {offerLabel}
              </Text>
            </View>
          </Pressable>

          <Pressable onPress={onPressAvatar}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{userInitial}</Text>
            </View>
          </Pressable>
        </View>
      </View>

      {/* Search bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          style={styles.input}
          placeholder="Search for salons or services"
          placeholderTextColor="#999"
        />
      </View>

      {/* Offer Modal */}
      <Modal
        transparent
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
              Offer Details
            </Text>
            <Text style={{ marginTop: 8 }}>{offerLabel}</Text>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default TopSearchBar;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cityText: {
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: Platform.OS==='android' ? 16 :13,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  offerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'dodgerblue',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginRight: 10,
    maxWidth: 120,
  },
  offerText: {
    marginLeft: 4,
    color: '#555',
    flexShrink: 1,
    maxWidth: 100,
  },
  avatar: {
    backgroundColor: 'dodgerblue',
    borderRadius: Platform.OS==='android'? 40/2 :35/2,
    width: Platform.OS==='android' ? 40 : 35,
    height: Platform.OS==='android' ? 40 : 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  searchBar: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
    borderRadius: 12,
    padding: 5,
    borderColor: '#f2f2f2',
    borderWidth: 2,
  },
  input: {
    marginLeft: 8,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '80%',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 5,
  },
});


