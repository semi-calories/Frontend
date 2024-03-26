import * as SecureStore from 'expo-secure-store';

export const storeSecureData = async (key, value) => {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (e) {
    console.error('Error storing data:', e);
  }
};

export const getSecureData = async (key) => {
  try {
    const value = await SecureStore.getItemAsync(key);
    return value;
  } catch (e) {
    console.error('Error reading value:', e);
  }
};
