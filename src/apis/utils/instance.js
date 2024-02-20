//
//axios 인스턴스 
//

import axios from "axios";
import { useRecoilValue } from "recoil";
import { useNavigation } from '@react-navigation/native';

import { saveAccessToken, getToken } from "~/components/expoSecureStore";
import { UserState } from "~/atoms/UserAtom";

import { SPRING_SERVER } from "@env"


//토큰 불필요한 경우
export const publicApi = axios.create({
    baseURL: SPRING_SERVER,
    //timeout: 2000,
});


//토큰을 함께 보내는 instance
const privateApi = async () => {
    const token = await getToken('accessToken');

    if (token) {
        // Axios 인스턴스 생성
        const instance = axios.create({
            baseURL: SPRING_SERVER,
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        //Refresh Token 구현
        instance.interceptors.response.use(
            (response) => {
                return response;
            },
            async (error) => {
                const originalRequest = error.config;

                // 만료된 토큰일 경우에만 Refresh Token 호출
                if (error.response.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    try {
                        // 새로운 Access Token 요청
                        const tokenResponse = await refreshToken();
                        console.log('@@@@tokenResponse', tokenResponse)

                        if (tokenResponse.status == 201) {
                            const newAccessToken = tokenResponse.data.accessToken;

                            saveAccessToken(newAccessToken)

                            // 새로 발급받은 토큰으로 기존 요청 재시도
                            originalRequest.headers['Authorization'] = 'Bearer ' + tokenResponse;
                            return axios(originalRequest);
                        }
                    } catch (error) {
                        console.error(error)

                        //refreshToken 만료시 재로그인 화면으로 이동
                        const resetNavigation = () => useNavigation.reset({
                            index: 0,
                            routes: [{ name: 'LoginSignupScreen' }],
                        });

                        resetNavigation();
                    }
                }

                return Promise.reject(error);
            });


        return instance;
    } else {
        console.error('Token not available.');
        return null;
    }
};

// API 요청 함수
export const fetchDataGet = async (endPoint, params) => {
    try {
        const axiosInstance = await privateApi();

        const response = await axiosInstance.get(endPoint, params);
        return response;
    } catch (error) {
        console.error('API 요청 오류:', error);
        throw error;
    }
};

export const fetchDataPost = async (endPoint, data, params) => {
    try {
        const axiosInstance = await privateApi();

        const response = await axiosInstance.post(endPoint, data, params);
        return response;
    } catch (error) {
        console.error('API 요청 오류:', error);
        throw error;
    }
};

const refreshToken = async () => {
    const user = useRecoilValue(UserState)
    const refreshToken = await getToken('refreshToken');

    const response = await publicApi.post(`/auth/reissueToken`, null, {
        params: user.userCode,
        headers: {
            'Refresh': refreshToken,
        },
    })

    return response
}



