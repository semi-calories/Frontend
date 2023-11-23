import { fetchDataGet, fetchDataPost } from "~/apis/utils/instance"

//권한 설정
export const saveSetting = async (reqBody) => {
    try {
        const { data } = await fetchDataPost(`/alert/saveSetting`, reqBody)
        return data
    } catch (err) {
        console.error(err)
    }
}

//설정 조회
export const getSetting = async (reqBody) => {
    try {
        const { data } = await fetchDataPost(`/alert/getSetting`, reqBody)
        return data
    } catch (err) {
        console.error(err)
    }
}

//설정 변경
export const updateSetting = async (reqBody) => {
    try {
        const { data } = await fetchDataPost(`/alert/updateSetting`, reqBody)
        return data
    } catch (err) {
        console.error(err)
    }
}

//기록 조회
export const getAlertRecord = async (reqBody) => {
    try {
        const { data } = await fetchDataGet(`/alert/getAlertRecord`, {params:reqBody})
        return data
    } catch (err) {
        console.error(err)
    }
}