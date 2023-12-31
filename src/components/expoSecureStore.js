import * as SecureStore from 'expo-secure-store';

export async function saveTokens(accessToken, refreshToken) {
  await SecureStore.setItemAsync('accessToken', JSON.stringify(accessToken));
  await SecureStore.setItemAsync('refreshToken', JSON.stringify(refreshToken));
}

// 저장된 토큰을 가져오는 함수
export const getToken = async (key) => {
  try {
    const token = await SecureStore.getItemAsync(key);

    return JSON.parse(token);
  } catch (error) {
    console.error('Error retrieving token:', error);
    
    return null;
  }
};
