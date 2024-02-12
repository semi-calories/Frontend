//
//axios 인스턴스 
//

import axios from "axios";

import { getToken } from "~/components/expoSecureStore";
import { SPRING_SERVER } from "@env"


const axiosAPI = (url, options) => {
    return axios.create({
        baseURL: url,
        //timeout: 2000,
        ...options
    })
}

export const frontendInstance = axiosAPI(SPRING_SERVER);


const createAxiosInstance = async(url, options) => {
    const token = await getToken('accessToken');

    if (token) {
        // Axios 인스턴스 생성
        const instance = axios.create({
            baseURL: url,
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            ...options,
        });



        return instance;
    } else {
        console.error('Token not available.');
        return null;
    }
};

// API 요청 함수
export const fetchDataGet = async(endPoint, params) => {
    try {
        const axiosInstance = await createAxiosInstance(SPRING_SERVER);
        //console.log('#####', axiosInstance, endPoint, params)

        const response = await axiosInstance.get(endPoint, params);
        return response;
    } catch (error) {
        console.error('API 요청 오류:', error);
        throw error;
    }
};

export const fetchDataPost = async (endPoint, data, params) => {
    try {
        const axiosInstance = await createAxiosInstance(SPRING_SERVER);

        const response = await axiosInstance.post(endPoint, data, params);
        return response;
    } catch (error) {
        console.error('API 요청 오류:', error);
        throw error;
    }
};



