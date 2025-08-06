import React, {ReactNode} from 'react';
import {View, SafeAreaView, StatusBar} from 'react-native';
import Colors from '../constants/colors'; 
import { moderateScale } from '../styles/responsiveSize';

const WraperContainer: React.FC<{children: ReactNode}> = ({children}) => {
  return (
    <SafeAreaView style={{backgroundColor: Colors.WHITE, flex: 1}}>
      <StatusBar backgroundColor={Colors.STATUS_BAR} />
      <View style={{flex: 1, marginHorizontal: moderateScale(2)}}>
        {children}
      </View>
    </SafeAreaView>
  );
};

export default WraperContainer;
