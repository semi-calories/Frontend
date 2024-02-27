//
//axios 인스턴스 및 공통 API 함수
//

import axios from "axios";
import { useRecoilValue } from "recoil";
import { useNavigation } from '@react-navigation/native';

import { saveAccessToken, getToken } from "~/components/expoSecureStore";
import { UserState } from "~/atoms/UserAtom";

import { SPRING_MAIN_SERVER, SPRING_ALERT_SERVER } from "@env"


//토큰 불필요한 경우 instance
export const publicApi = axios.create({
    baseURL: SPRING_MAIN_SERVER,
    //timeout: 2000,
});


//Access토큰을 필요한 instance
const privateApi = async () => {
    const token = await getToken('accessToken');
    const refreshToken = await getToken('refreshToken');

    if (token) {

        // Axios 인스턴스 생성
        const instance = axios.create({
            baseURL: SPRING_MAIN_SERVER,
            headers: {
                'Authorization': 'Bearer ' + token,
            }
        });

        // 로그아웃인 경우 'Refresh' 헤더에 refreshToken을 추가
        // 푸시 알림 기능인 경우 baseURL 변경
        instance.interceptors.request.use(
            async (config) => {
                // 로그아웃 엔드포인트에 대한 요청만 처리
                if (config.url.endsWith('/userLogout')) {
                    config.headers.Refresh = refreshToken;
                }

                // /alert/로 시작하는 엔드포인트에 대한 요청 처리
                if (config.url.startsWith('/alert/')) {
                    config.baseURL = SPRING_ALERT_SERVER;
                }

                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );


        //Refresh Token 구현
        instance.interceptors.response.use(
            (response) => {
                return response;
            },
            async (err) => {
                const originalRequest = err.config;

                // 만료된 토큰일 경우에만 Refresh Token 호출
                if (err.response.status === 403 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    try {
                        // 새로운 Access Token 요청
                        const tokenResponse = await reissueToken();

                        if (tokenResponse.status == 200) {
                            const newAccessToken = tokenResponse.data.accessToken;

                            saveAccessToken(newAccessToken)

                            // 새로 발급받은 토큰으로 기존 요청 재시도
                            originalRequest.headers['Authorization'] = 'Bearer ' + tokenResponse;
                            return axios(originalRequest);
                        }
                    } catch (error) {
                        //refreshToken 만료시 재로그인 화면으로 이동
                        // 즉시 실행 함수 표현식
                        (function () {
                            useNavigation().reset({
                                index: 0,
                                routes: [{ name: 'LoginSignupScreen' }],
                            });
                        })();
                    }
                }

                return Promise.reject(err);
            });


        return instance;
    } else {
        console.error('Token not available.');
        return null;
    }
};

const reissueToken = async () => {
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
