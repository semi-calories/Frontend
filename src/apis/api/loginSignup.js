//
//로그인, 회원가입 관련 Api 요청 및 응답
//
import { userInstance } from "~/apis/utils/instance"

export const login = async (loginInfo) => {
    try {
        const { data } = await userInstance.post(`/passwordMatch`, loginInfo)
        return data
    } catch (err) {
        console.error(err)
    }
}

export const signup = async(signupInfo) => {
    try {
        const { data } = await userInstance.post(`/sign-up`, signupInfo)
        return data
    } catch (err) {
        console.error(err)
    }
}