import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Constants from '../../constants/Constants';
import responsive from '../../utils/responsive';
import Colors from '../../constants/colors';
import ExpandableServiceItem from './ExpandableServiceItem';

const HaircutWasStyleComponent = ({title}: {title: string}) => {
  const [selectedGender, setSelectedGender] = useState('');
  return (
    <View style={styles.containerMain}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => setSelectedGender('MAN')}
          style={[
            styles.buttonGender,
            selectedGender === 'MAN' && styles.activeBacck,
          ]}>
          <View style={styles.buyNowContentGender}>
            <Ionicons
              name="man-outline"
              size={responsive.fontSize(16)}
              color={selectedGender === 'MAN' ? 'white' : 'red'}
              style={styles.buyNowIcon}
            />
            <Text
              style={[
                styles.manWomenText,
                selectedGender === 'MAN' && styles.activeManWomenText,
              ]}>
              {Constants.MAN}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectedGender('WOMAN')}
          style={[
            styles.buttonGender,
            selectedGender === 'WOMAN' && styles.activeBacck,
          ]}>
          <View style={styles.buyNowContentGender}>
            <Ionicons
              name="woman-outline"
              size={responsive.fontSize(16)}
              color={selectedGender === 'WOMAN' ? 'white' : 'red'}
              style={styles.buyNowIcon}
            />
            <Text
              style={[
                styles.manWomenText,
                selectedGender === 'WOMAN' && styles.activeManWomenText,
              ]}>
              {Constants.WOMAN}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <ExpandableServiceItem
        title={'Haircut'}
        count={3}
        dummyItems={[
          {id: '1', title: 'Basic Haircut', price: '150'},
          {id: '2', title: 'Advanced Haircut', price: '250'},
          {id: '3', title: 'Premium Haircut', price: '400'},
        ]}
      />
      <ExpandableServiceItem
        title="Wash OR Dry"
        count={4}
        dummyItems={[
          {id: '1', title: 'Hair Wash', price: '200'},
          {id: '2', title: 'Hair Wash', price: '100'},
          {id: '3', title: 'Hair Wash Regular', price: '250'},
          {id: '4', title: 'Hair Wash  Premium', price: '250'},
        ]}
      />
      <ExpandableServiceItem
        title="Styling"
        count={5}
        dummyItems={[
          {id: '1', title: 'Blow Dry', price: '350'},
          {id: '2', title: 'Ironing', price: '750'},
          {id: '3', title: 'Tongs', price: '250'},
          {id: '4', title: 'Hair Do', price: '1,250'},
          {id: '5', title: 'Hair Styling', price: '150'},
        ]}
      />
    </View>
  );
};

export default HaircutWasStyleComponent;

const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },

  buttonGender: {
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    width: '45%',
    borderColor: Colors.BORDER_COLOR,
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },

  buyNowContentGender: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buyNowIcon: {
    padding: 3,
  },
  manWomenText: {
    color: '#000',
    fontWeight: '300',
    fontSize: responsive.fontSize(14),
  },
  activeBacck: {
    backgroundColor: 'blue', // active state
  },
  activeManWomenText: {
    color: 'white', // active state
  },
});
