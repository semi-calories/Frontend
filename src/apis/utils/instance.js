//
//axios 인스턴스 
//
import axios from "axios";

const SPRING_BASE_URL = 'http://54.235.159.48:8080';
const FASTAPI_BASE_URL = 'http://34.207.37.53:8000';
const FRONTEND_BASE_URL = 'http://34.236.139.24:8080';

const axiosAPI = (url, options) => {
    return axios.create({
        baseURL: url,
        //timeout: 2000,
        ...options
    })
}

// const axiosAuthAPI = (url, options) => {
//     const token = getItem('jwt_token')
//     return axios.create({
//       baseURL: url,
//       headers: {
//         Authorization: `bearer ${token}`,
//       },
//       ...options,
//     })
//   }


export const springInstance = axiosAPI(SPRING_BASE_URL);
export const fastApiInstance = axiosAPI(FASTAPI_BASE_URL);
export const frontendInstance = axiosAPI(FRONTEND_BASE_URL);


