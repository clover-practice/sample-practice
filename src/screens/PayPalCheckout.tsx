import React, {useState} from 'react';
import {View, Button, ActivityIndicator, Alert} from 'react-native';
import WebView from 'react-native-webview';

const SERVER_URL = 'http://localhost:3000/api/paypal'; // replace with your backend URL

const PayPalCheckout: React.FC = () => {
  const [approvalUrl, setApprovalUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 1️⃣ Create Order on PayPal via Backend
  const createPayPalOrder = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${SERVER_URL}/create-order`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({amount: '10.00'}), // example amount
      });
      const data = await res.json();

      if (data.links) {
        const approvalLink = data.links.find(
          (link: any) => link.rel === 'approve',
        );
        setApprovalUrl(approvalLink?.href || null);
      } else {
        Alert.alert('Error', 'No PayPal approval link found.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create PayPal order');
    } finally {
      setLoading(false);
    }
  };

  // 2️⃣ Capture Order after WebView approval
  const capturePayPalOrder = async (orderID: string) => {
    try {
      const res = await fetch(`${SERVER_URL}/capture-order`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({orderID}),
      });
      const data = await res.json();

      if (data.status === 'COMPLETED') {
        Alert.alert(
          'Payment Success',
          'Your payment was completed successfully!',
        );
      } else {
        Alert.alert('Payment Failed', 'Something went wrong.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to capture PayPal order');
    }
  };

  // 3️⃣ Handle WebView URL changes
  const handleWebViewNavigation = (navState: any) => {
    const {url} = navState;

    if (url.includes('paypal-success')) {
      // Extract token (orderID) from URL query params
      const orderID = url.split('token=')[1];
      setApprovalUrl(null);
      capturePayPalOrder(orderID);
    }

    if (url.includes('paypal-cancel')) {
      setApprovalUrl(null);
      Alert.alert('Payment Cancelled');
    }
  };

  return (
    <View style={{flex: 1}}>
      {loading && <ActivityIndicator size="large" style={{marginTop: 20}} />}

      {!approvalUrl ? (
        <Button title="Pay with PayPal" onPress={createPayPalOrder} />
      ) : (
        <WebView
          source={{uri: approvalUrl}}
          onNavigationStateChange={handleWebViewNavigation}
          startInLoadingState
        />
      )}
    </View>
  );
};

export default PayPalCheckout;
