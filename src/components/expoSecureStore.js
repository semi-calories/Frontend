import * as SecureStore from 'expo-secure-store';

export async function saveTokens(accessToken, refreshToken) {
    await SecureStore.setItemAsync('accessToken', accessToken);
    await SecureStore.setItemAsync('refreshToken', refreshToken);
}

// 저장된 토큰을 가져오는 함수
export const getToken = async (key) => {
    try {
      const token = await SecureStore.getItemAsync(key);
      return token;
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null;
    }
  };