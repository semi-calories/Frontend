//
//login 및 회원가입 관련 데이터 정제
//
import { storeSecureData } from '~/components/secureStore';

import { ACCESS_TOKEN, REFRESH_TOKEN } from '~/constants/secureStoreKey';

export const getLoginInfo = (rawInfo) => {
  if (!rawInfo) {
    throw new Error('Invalid argument: rawInfo is undefined');
  }

  const { userExists, user, matchResult, accessToken, refreshToken } = rawInfo;

  if (userExists && matchResult) {
    storeSecureData(ACCESS_TOKEN, accessToken);
    storeSecureData(REFRESH_TOKEN, refreshToken);

    return { user, error: '' };
  } else if (userExists) {
    return { user, error: '아이디나 비밀번호를 확인해주세요.' };
  } else {
    return { user, error: '존재하지 않는 회원입니다.' };
  }
};

export const getSignupInfo = (rawInfo) => {
  const { userCode, accessToken, refreshToken } = rawInfo;

  storeSecureData(ACCESS_TOKEN, accessToken);
  storeSecureData(REFRESH_TOKEN, refreshToken);

  return userCode;
};
