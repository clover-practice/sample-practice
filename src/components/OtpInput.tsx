import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  Keyboard,
  Platform,
} from 'react-native';

const OTP_LENGTH = 6;
const RESEND_TIME = 20;

type OtpInputProps = {
  value?: string;
  onChange?: (value: string) => void;
};

const OtpInput: React.FC<OtpInputProps> = ({value, onChange}) => {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [timer, setTimer] = useState(RESEND_TIME);
  const [resendVisible, setResendVisible] = useState(false);

  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setResendVisible(true);
    }
  }, [timer]);

  const handleChange = (text: string, index: number) => {
    if (!/^\d*$/.test(text)) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    const joinedOtp = newOtp.join('');
    onChange?.(joinedOtp);

    if (text && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (!text && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (index === OTP_LENGTH - 1 && text.length === 1) {
      Keyboard.dismiss();
    }
  };

  const handleResend = () => {
    setOtp(Array(OTP_LENGTH).fill(''));
    onChange?.('');
    setTimer(RESEND_TIME);
    setResendVisible(false);
    inputRefs.current[0]?.focus();

    // TODO: Trigger your resend OTP API here
    console.log('🔁 Resend OTP');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP</Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={ref => (inputRefs.current[index] = ref)}
            value={digit}
            onChangeText={text => handleChange(text, index)}
            keyboardType="numeric"
            maxLength={1}
            style={styles.otpBox}
            autoFocus={index === 0}
            textAlign="center"
            returnKeyType="done"
          />
        ))}
      </View>

      <View style={styles.timerContainer}>
        {!resendVisible ? (
          <Text style={[styles.timer, timer < 15 && {color: 'red'}]}>
            Resend OTP in {timer}s
          </Text>
        ) : (
          <TouchableOpacity onPress={handleResend}>
            <Text style={styles.resend}>Resend OTP</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default OtpInput;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: Platform.OS === 'android' ? 20 : 18,
    marginBottom: 20,
    fontWeight: '600',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  otpBox: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 10,
    fontSize: 20,
    color: '#000',
    backgroundColor: '#fff',
    textAlign: 'center',
  },
  timer: {
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
  resend: {
    marginTop: 20,
    fontSize: 16,
    color: 'dodgerblue',
    fontWeight: '600',
  },
  timerContainer: {
    alignSelf: 'flex-end',
    marginTop: 10,
    marginRight: 20,
  },
});
