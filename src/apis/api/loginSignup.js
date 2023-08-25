//
//로그인, 회원가입 관련 Api 요청 및 응답
//
import { frontendInstance } from "~/apis/utils/instance"

export const login = async (loginInfo) => {
    try {
        const { data } = await frontendInstance.post(`/passwordMatch`, loginInfo)
        return data
    } catch (err) {
        console.error(err)
    }
}

export const signup = async (signupInfo) => {
    try {
        const { data } = await frontendInstance.post(`/sign-up`, signupInfo)
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