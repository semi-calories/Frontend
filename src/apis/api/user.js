//
//user 관련 api 요청 및 응답
//
import { userInstance } from "~/apis/utils/instance"

export const getInfo = async (userCode) => {
    try {
        const { data } = await userInstance.get(`/user/getInfo?userCode=${userCode}`)
        return data
    } catch (err) {
        console.error(err)
    }
}

export const updateInfo = async (userInfo) => {
    try {
        const { data } = await userInstance.post(`/user/updateInfo`, userInfo)
        return data
    } catch (err) {
        console.error(err)
    }
}
