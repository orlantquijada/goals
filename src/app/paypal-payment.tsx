import { useAppDispatch } from '@/stores/store';
import { setPaymentResult, subscribe } from '@/stores/subscription-store';
import { useRouter } from 'expo-router';
import { ArrowLeft, Lock } from 'lucide-react-native';
import { useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from 'react-native';

// PayPal colors
const PAYPAL_BLUE = '#0070BA';
const PAYPAL_GOLD = '#FFC439';
const PAYPAL_DARK_BLUE = '#003087';
const PAYPAL_LIGHT_GRAY = '#F5F7FA';
const PAYPAL_BORDER = '#CBD2D6';

type PaymentState = 'form' | 'processing';

export default function PayPalPayment() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [email, setEmail] = useState('');
  const [paymentState, setPaymentState] = useState<PaymentState>('form');
  const [errors, setErrors] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    email: '',
  });

  // Validation functions
  const validateCardNumber = (number: string) => {
    const cleaned = number.replace(/\s/g, '');
    if (!cleaned) return 'Card number is required';
    if (!/^\d+$/.test(cleaned)) return 'Card number must contain only digits';
    if (cleaned.length < 13) return 'Card number must be at least 13 digits';
    if (cleaned.length > 19)
      return 'Card number must be no more than 19 digits';
    return '';
  };

  const validateExpiryDate = (date: string) => {
    if (!date) return 'Expiry date is required';
    if (!/^\d{2}\/\d{2}$/.test(date)) return 'Use MM/YY format';

    const [month, year] = date.split('/').map((num) => Number.parseInt(num));
    if (month < 1 || month > 12) return 'Invalid month';

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return 'Card is expired';
    }
    return '';
  };

  const validateCVV = (cvv: string) => {
    if (!cvv) return 'CVV is required';
    if (!/^\d{3,4}$/.test(cvv)) return 'CVV must be 3-4 digits';
    return '';
  };

  const validateCardholderName = (name: string) => {
    if (!name.trim()) return 'Cardholder name is required';
    if (!/^[a-zA-Z\s]+$/.test(name))
      return 'Name must contain only letters and spaces';
    if (name.trim().length < 2) return 'Name must be at least 2 characters';
    return '';
  };

  const validateEmail = (email: string) => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const match = cleaned.match(/.{1,4}/g);
    return match ? match.join(' ') : cleaned;
  };

  // Format expiry date
  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const handlePayment = async () => {
    // Validate all fields
    const newErrors = {
      cardNumber: validateCardNumber(cardNumber),
      expiryDate: validateExpiryDate(expiryDate),
      cvv: validateCVV(cvv),
      cardholderName: validateCardholderName(cardholderName),
      email: validateEmail(email),
    };

    setErrors(newErrors);

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some((error) => error !== '');
    if (hasErrors) {
      return;
    }

    setPaymentState('processing');

    // Simulate payment processing with 90% success rate
    setTimeout(() => {
      const isSuccess = Math.random() > 0.1; // 90% success rate

      if (isSuccess) {
        dispatch(subscribe());
        dispatch(setPaymentResult('success'));
        router.dismissTo('/');
      } else {
        dispatch(setPaymentResult('error'));
        router.dismissTo('/settings'); // Go back to settings for error handling
      }
    }, 2500);
  };

  const renderPaymentForm = () => (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4">
        <Pressable
          className="h-10 w-10 items-center justify-center rounded-full transition-all active:scale-95"
          onPress={() => router.back()}
          style={{ backgroundColor: PAYPAL_LIGHT_GRAY }}
        >
          <ArrowLeft color={PAYPAL_DARK_BLUE} size={20} />
        </Pressable>

        <View className="flex-row items-center">
          <Text className="font-bold text-2xl" style={{ color: PAYPAL_BLUE }}>
            Pay
          </Text>
          <Text className="font-bold text-2xl" style={{ color: PAYPAL_GOLD }}>
            Pal
          </Text>
        </View>

        <View className="w-10" />
      </View>

      <View className="flex-1 px-6">
        {/* Payment form */}
        <Text
          className="mb-6 text-center font-semibold text-xl"
          style={{ color: PAYPAL_DARK_BLUE }}
        >
          Pay with card
        </Text>

        <View className="mb-4">
          <Text
            className="mb-2 font-medium text-sm"
            style={{ color: PAYPAL_DARK_BLUE }}
          >
            Card Number *
          </Text>
          <TextInput
            className="rounded-lg border p-4 font-medium text-base"
            keyboardType="numeric"
            maxLength={23} // Increased to allow for spaces
            onBlur={() => {
              const error = validateCardNumber(cardNumber);
              setErrors((prev) => ({ ...prev, cardNumber: error }));
            }}
            onChangeText={(text) => {
              const formatted = formatCardNumber(text);
              setCardNumber(formatted);
              // Clear error when user starts typing
              if (errors.cardNumber) {
                setErrors((prev) => ({ ...prev, cardNumber: '' }));
              }
            }}
            placeholder="1234 5678 9012 3456"
            placeholderTextColor="#8E9AAF"
            style={{
              borderColor: errors.cardNumber ? '#EF4444' : PAYPAL_BORDER,
              backgroundColor: '#FFFFFF',
              color: PAYPAL_DARK_BLUE,
            }}
            value={cardNumber}
          />
          {errors.cardNumber ? (
            <Text className="mt-1 text-xs" style={{ color: '#EF4444' }}>
              {errors.cardNumber}
            </Text>
          ) : null}
        </View>

        <View className="mb-4 flex-row gap-4">
          <View className="flex-1">
            <Text
              className="mb-2 font-medium text-sm"
              style={{ color: PAYPAL_DARK_BLUE }}
            >
              Expiry Date *
            </Text>
            <TextInput
              className="rounded-lg border p-4 font-medium text-base"
              keyboardType="numeric"
              maxLength={5}
              onBlur={() => {
                const error = validateExpiryDate(expiryDate);
                setErrors((prev) => ({ ...prev, expiryDate: error }));
              }}
              onChangeText={(text) => {
                const formatted = formatExpiryDate(text);
                setExpiryDate(formatted);
                // Clear error when user starts typing
                if (errors.expiryDate) {
                  setErrors((prev) => ({ ...prev, expiryDate: '' }));
                }
              }}
              placeholder="MM/YY"
              placeholderTextColor="#8E9AAF"
              style={{
                borderColor: errors.expiryDate ? '#EF4444' : PAYPAL_BORDER,
                backgroundColor: '#FFFFFF',
                color: PAYPAL_DARK_BLUE,
              }}
              value={expiryDate}
            />
            {errors.expiryDate ? (
              <Text className="mt-1 text-xs" style={{ color: '#EF4444' }}>
                {errors.expiryDate}
              </Text>
            ) : null}
          </View>
          <View className="flex-1">
            <Text
              className="mb-2 font-medium text-sm"
              style={{ color: PAYPAL_DARK_BLUE }}
            >
              CVV *
            </Text>
            <TextInput
              className="rounded-lg border p-4 font-medium text-base"
              keyboardType="numeric"
              maxLength={4}
              onBlur={() => {
                const error = validateCVV(cvv);
                setErrors((prev) => ({ ...prev, cvv: error }));
              }}
              onChangeText={(text) => {
                // Only allow digits
                const cleaned = text.replace(/\D/g, '');
                setCvv(cleaned);
                // Clear error when user starts typing
                if (errors.cvv) {
                  setErrors((prev) => ({ ...prev, cvv: '' }));
                }
              }}
              placeholder="123"
              placeholderTextColor="#8E9AAF"
              secureTextEntry={true}
              style={{
                borderColor: errors.cvv ? '#EF4444' : PAYPAL_BORDER,
                backgroundColor: '#FFFFFF',
                color: PAYPAL_DARK_BLUE,
              }}
              value={cvv}
            />
            {errors.cvv ? (
              <Text className="mt-1 text-xs" style={{ color: '#EF4444' }}>
                {errors.cvv}
              </Text>
            ) : null}
          </View>
        </View>

        <View className="mb-4">
          <Text
            className="mb-2 font-medium text-sm"
            style={{ color: PAYPAL_DARK_BLUE }}
          >
            Cardholder Name *
          </Text>
          <TextInput
            autoCapitalize="words"
            className="rounded-lg border p-4 font-medium text-base"
            onBlur={() => {
              const error = validateCardholderName(cardholderName);
              setErrors((prev) => ({ ...prev, cardholderName: error }));
            }}
            onChangeText={(text) => {
              // Only allow letters and spaces
              const cleaned = text.replace(/[^a-zA-Z\s]/g, '');
              setCardholderName(cleaned);
              // Clear error when user starts typing
              if (errors.cardholderName) {
                setErrors((prev) => ({ ...prev, cardholderName: '' }));
              }
            }}
            placeholder="John Doe"
            placeholderTextColor="#8E9AAF"
            style={{
              borderColor: errors.cardholderName ? '#EF4444' : PAYPAL_BORDER,
              backgroundColor: '#FFFFFF',
              color: PAYPAL_DARK_BLUE,
            }}
            value={cardholderName}
          />
          {errors.cardholderName ? (
            <Text className="mt-1 text-xs" style={{ color: '#EF4444' }}>
              {errors.cardholderName}
            </Text>
          ) : null}
        </View>

        <View className="mb-6">
          <Text
            className="mb-2 font-medium text-sm"
            style={{ color: PAYPAL_DARK_BLUE }}
          >
            Email Address *
          </Text>
          <TextInput
            autoCapitalize="none"
            className="rounded-lg border p-4 font-medium text-base"
            keyboardType="email-address"
            onBlur={() => {
              const error = validateEmail(email);
              setErrors((prev) => ({ ...prev, email: error }));
            }}
            onChangeText={(text) => {
              setEmail(text.trim());
              // Clear error when user starts typing
              if (errors.email) {
                setErrors((prev) => ({ ...prev, email: '' }));
              }
            }}
            placeholder="john.doe@email.com"
            placeholderTextColor="#8E9AAF"
            style={{
              borderColor: errors.email ? '#EF4444' : PAYPAL_BORDER,
              backgroundColor: '#FFFFFF',
              color: PAYPAL_DARK_BLUE,
            }}
            value={email}
          />
          {errors.email ? (
            <Text className="mt-1 text-xs" style={{ color: '#EF4444' }}>
              {errors.email}
            </Text>
          ) : null}
        </View>

        {/* Payment button */}
        <Pressable
          className="mb-6 rounded-full py-4 transition-all active:scale-98"
          onPress={handlePayment}
          style={{
            backgroundColor: PAYPAL_BLUE,
            opacity:
              cardNumber && expiryDate && cvv && cardholderName && email
                ? 1
                : 0.6,
          }}
        >
          <Text className="text-center font-semibold text-base text-white">
            Pay $49.99
          </Text>
        </Pressable>

        {/* Footer info */}
        <View
          className="mb-8 rounded-lg p-4"
          style={{ backgroundColor: PAYPAL_LIGHT_GRAY }}
        >
          <View className="mb-2 flex-row items-center">
            <Lock color={PAYPAL_BLUE} size={14} />
            <Text
              className="ml-2 font-medium text-xs"
              style={{ color: PAYPAL_DARK_BLUE }}
            >
              We protect your financial information with industry-leading
              security and fraud prevention.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const renderProcessing = () => (
    <View className="flex-1 items-center justify-center px-6">
      <ActivityIndicator color={PAYPAL_BLUE} size="large" />
      <Text
        className="mt-4 text-center font-semibold text-lg"
        style={{ color: PAYPAL_DARK_BLUE }}
      >
        Processing your payment...
      </Text>
      <Text className="mt-2 text-center text-sm" style={{ color: '#8E9AAF' }}>
        Please don't close this window
      </Text>
    </View>
  );

  return (
    <View className="flex-1" style={{ backgroundColor: '#FFFFFF' }}>
      {paymentState === 'form' && renderPaymentForm()}
      {paymentState === 'processing' && renderProcessing()}
    </View>
  );
}
