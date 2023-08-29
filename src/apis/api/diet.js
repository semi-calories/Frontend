//
//diet 관련 api 요청 및 응답
//
import { frontendInstance } from "~/apis/utils/instance"

export const getRecord = async (recordInfo) => {
    console.log('getRecord recordInfo', recordInfo)

    try {
        const { data } = await frontendInstance.get(`/record/getRecord`, { params: recordInfo })
        return data
    } catch (err) {
        console.error(err)
    }
}

export const foodSearch = async (foodname) => {
    try {
        const { data } = await frontendInstance.get(`/record/foodSearch`, { params: foodname })
        return data
    } catch (err) {
        console.error(err)
    }
}

export const getMonthStats = async (statInfo) => {
    console.log('getMonthStats statInfo', statInfo)

    try {
        const { data } = await frontendInstance.get(`/record/getMonthStats`, { params: statInfo })
        return data
    } catch (err) {
        console.error(err)
    }
}

export const getWeekStats = async (userCode, month) => {
    console.log('getWeekStats  userCode month', userCode, month)

    try {
        const { data } = await frontendInstance.post(`/record/getWeekStats`, month, { params: userCode })
        return data
    } catch (err) {
        console.error(err)
    }
}

export const updateRecord = async (recordInfo) => {
    console.log('updateRecord recordInfo', recordInfo)

    try {
        const { data } = await frontendInstance.post(`/record/text`, recordInfo)
        return data
    } catch (err) {
        console.error(err)
    }
}
