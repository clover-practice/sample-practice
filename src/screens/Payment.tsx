import React from 'react';
import {View, Dimensions, Image} from 'react-native';
import {WebView, WebViewNavigation} from 'react-native-webview';
import {useRoute, RouteProp, useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';

type RootStackParamList = {
  Payment: {amt: string};
  Success: {payId: string; token: string; payerId: string};
};

type PaymentRouteProp = RouteProp<RootStackParamList, 'Payment'>;
type NavigationProp = StackNavigationProp<RootStackParamList, 'Payment'>;

const {width, height} = Dimensions.get('screen');

export default function Payment() {
  const route = useRoute<PaymentRouteProp>();
  const navigation = useNavigation<NavigationProp>();

  const stateChng = (navState: WebViewNavigation) => {
    const {url, title} = navState;

    // Detect PayPal success
    console.log('URL ', url);
    if (title === 'PayPal Success' && url.includes('paymentId')) {
      const splitUrl = url.split('?');
      if (splitUrl.length > 1) {
        const params = new URLSearchParams(splitUrl[1]);
        const paymentId = params.get('paymentId') || '';
        const token = params.get('token') || '';
        const payerId = params.get('PayerID') || '';
        console.log('paymentId ', paymentId);
        console.log('token ', token);
        console.log('payerId ', payerId);

        navigation.navigate('Success', {
          payId: paymentId,
          token: token,
          payerId: payerId,
        });
      }
    }
  };

  return (
    <WebView
      startInLoadingState={true}
      onNavigationStateChange={stateChng}
      renderLoading={() => <Loading />}
      source={{
        uri: `http://127.0.0.1:3000/api/paypal/${route.params.amt}`,
      }}
    />
  );
}

const Loading: React.FC = () => {
  return (
    <View
      style={{
        height: height,
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
      }}>
      <Image
        source={require('../assets/images/paypal.png')}
        style={{width: 250, height: 100, resizeMode: 'contain'}}
      />
    </View>
  );
};
