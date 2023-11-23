//
//로그인, 회원가입 관련 Api 요청 및 응답
//
import { frontendInstance, fetchDataGet, fetchDataPost } from "~/apis/utils/instance"

export const login = async (loginInfo) => {
    try {
        const { data } = await frontendInstance.post(`/passwordMatch`, loginInfo)
        console.log('login api data', data)

        return data
    } catch (err) {
        console.error(err)
    }
}

export const signup = async (signupInfo) => {
    try {
        const { data } = await frontendInstance.post(`/sign-up`, signupInfo)
        console.log('signup api data', data)

        return data
    } catch (err) {
        console.error(err)
    }
}

export const emailDuplicateCheck = async (email) => {
    try {
        const { data } = await frontendInstance.get(`/emailDuplicateCheck`, { params: email })
        return data
    } catch (err) {
        console.error(err)
    }
}

//유저 정보 삭제(탈퇴)
export const deleteInfo = async (userCode) => {
    console.log('deleteInfo userCode', userCode)

    try {
        const { data } = await fetchDataPost(`/deleteInfo`, userCode)
        return data
    } catch (err) {
        console.error(err)
    }
}

//로그아웃
export const userLogout = async(userCode) =>{
    try {
        const { data } = await fetchDataGet(`/userLogout`, {params: userCode})
        return data
    } catch (err) {
        console.error(err)
    }
}