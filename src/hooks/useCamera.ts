import * as ImagePicker from 'expo-image-picker';
import * as Linking from 'expo-linking';
import { Alert } from 'react-native';

export function useCamera(
  onSuccess?: (assets: ImagePicker.ImagePickerAsset[]) => void,
  cameraOpts?: ImagePicker.ImagePickerOptions
) {
  const [permisson, requestPermisson] = ImagePicker.useCameraPermissions();

  const handleGranted = async (perm: ImagePicker.PermissionResponse) => {
    if (perm && !perm.granted) {
      return;
    }

    const result = await ImagePicker.launchCameraAsync(cameraOpts);

    if (result.canceled || !result.assets.length) {
      return;
    }

    onSuccess?.(result.assets);
  };

  const handleCamera = async () => {
    if (!permisson) {
      return;
    }

    if (permisson.status === ImagePicker.PermissionStatus.DENIED) {
      Alert.alert('Camera Access Required', '', [
        { style: 'cancel', text: 'Not now' },
        { text: 'Open Settings', onPress: Linking.openSettings },
      ]);
    } else if (permisson.status === ImagePicker.PermissionStatus.UNDETERMINED) {
      const perm = await requestPermisson();
      await handleGranted(perm);
    } else if (permisson.status === ImagePicker.PermissionStatus.GRANTED) {
      await handleGranted(permisson);
    }
  };

  return handleCamera;
}
