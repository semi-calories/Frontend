//
//user 관련 api 요청 및 응답
//
import { frontendInstance } from "~/apis/utils/instance"

export const getInfo = async (userCode) => {
    try {
        const { data } = await frontendInstance.get(`/user/getInfo`, { params:{ userCode: userCode } })
        return data
    } catch (err) {
        console.error(err)
    }
}

export const updateInfo = async (userInfo) => {
    console.log('updateInfo userInfo', userInfo)
    try {
        const { data } = await frontendInstance.post(`/user/updateInfo`, userInfo)
        return data
    } catch (err) {
        console.error(err)
    }
}
