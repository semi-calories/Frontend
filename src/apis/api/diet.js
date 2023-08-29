//
//diet 관련 api 요청 및 응답
//
import { frontendInstance } from "~/apis/utils/instance"

//날짜별 식단 기록 조회
export const getRecord = async (recordInfo) => {
    console.log('getRecord recordInfo', recordInfo)

    try {
        const { data } = await frontendInstance.get(`/record/getRecord`, { params: recordInfo })
        return data
    } catch (err) {
        console.error(err)
    }
}

//음식 검색
export const foodSearch = async (foodName) => {
    console.log('foodSearch foodname', foodName)
    try {
        const { data } = await frontendInstance.get(`/record/foodSearch`, { params: foodName })
        return data
    } catch (err) {
        console.error(err)
    }
}

//통계 - 월간 조회
export const getMonthStats = async (statInfo) => {
    console.log('getMonthStats statInfo', statInfo)

    try {
        const { data } = await frontendInstance.get(`/record/getMonthStats`, { params: statInfo })
        return data
    } catch (err) {
        console.error(err)
    }
}

//통계 - 주간 조회
export const getWeekStats = async (userCode, month) => {
    console.log('getWeekStats  userCode month', userCode, month)

    try {
        const { data } = await frontendInstance.post(`/record/getWeekStats`, month, { params: userCode })
        return data
    } catch (err) {
        console.error(err)
    }
}

//식단 기록 등록/수정
export const updateRecord = async (recordInfo) => {
    console.log('updateRecord recordInfo', recordInfo)

    try {
        const { data } = await frontendInstance.post(`/record/text`, recordInfo)
        return data
    } catch (err) {
        console.error(err)
    }
}

