import * as ImagePicker from 'expo-image-picker';

export function useLibrary(
  onSuccess?: (assets: ImagePicker.ImagePickerAsset[]) => void
) {
return () => {  
    ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    }).then((result) => {
      if (result.canceled || !result.assets.length) {
        return;
      }

      onSuccess?.(result.assets);
    });
  }
}

