//
//user 관련 api 요청 및 응답
//
import { frontendInstance, fetchDataGet, fetchDataPost } from "~/apis/utils/instance"

//유저 정보 조회
export const getInfo = async (userCode) => {
    try {
        const { data } = await fetchDataGet(`/user/getInfo`, { params: userCode })
        return data
    } catch (err) {
        console.error(err)
    }
}

//유저 정보 등록/수정
export const updateInfo = async (userInfo) => {
    console.log('updateInfo userInfo', userInfo)

    try {
        const { data } = await fetchDataPost(`/user/updateInfo`, userInfo)
        return data
    } catch (err) {
        console.error(err)
    }
}

//선호 음식 조회
export const getPrefer = async (userCode) => {
    try {
        const { data } = await fetchDataGet(`/user/getPrefer`, { params: userCode })
        return data
    } catch (err) {
        console.error(err)
    }
}

//비선호 음식 조회
export const getDislike = async (userCode) => {
    try {
        const { data } = await fetchDataGet(`/user/getDislike`, { params: userCode })
        return data
    } catch (err) {
        console.error(err)
    }
}

//선호 음식 등록/수정
export const savePrefer = async (preferInfo) => {
    console.log('savePrefer preferInfo', preferInfo)

    try {
        const { data } = await fetchDataPost(`/user/savePrefer`, preferInfo)
        return data
    } catch (err) {
        console.error(err)
    }
}

//비선호 음식 등록/수정
export const saveDislike = async (dislikeInfo) => {
    console.log('saveDislike dislikeInfo', dislikeInfo)

    try {
        const { data } = await fetchDataPost(`/user/saveDislike`, dislikeInfo)
        return data
    } catch (err) {
        console.error(err)
    }
}


//몸무게 기간 조회
export const getMonthRangeWeight = async (weightInfo) => {
    console.log('getMonthRangeWeight weightInfo', weightInfo)

    try {
        const { data } = await fetchDataGet('/record/getMonthRangeWeight', { params: weightInfo })
        return data
    } catch (err) {
        console.error(err)
    }
}

//몸무게 조회
export const getWeight = async (weightInfo) => {
    console.log('getWeight weightInfo', weightInfo)

    try {
        const { data } = await fetchDataGet('/record/getWeight', { params: weightInfo })
        return data
    } catch (err) {
        console.error(err)
    }
}

//몸무게 저장/수정
export const saveWeight = async (weightInfo) => {
    console.log('saveWeight weightInfo', weightInfo)

    try {
        const { data } = await fetchDataPost('/record/saveWeight', weightInfo)
        return data
    } catch (err) {
        console.error(err)
    }
}

//몸무게 석제
export const deleteWeight = async (weightInfo) => {
    console.log('deleteWeight weightInfo', weightInfo)

    try {
        const { data } = await fetchDataPost('/record/deleteWeight', weightInfo)
        return data
    } catch (err) {
        console.error(err)
    }
}

//예상 몸무게 조회
export const getPredictWeight = async (userCode) => {
    try {
        const { data } = await fetchDataGet('/record/getPredictWeight', { params: userCode })
        return data;
    } catch (e) {
        console.error(e)
    }
}

//예상 몸무게 저장
export const savePredictWeight = async (weightInfo) => {
    console.log('savePredictWeight weightInfo', weightInfo)
    try {
        const { data } = await fetchDataPost('/record/savePredictWeight', weightInfo)
        return data;
    } catch (e) {
        console.error(e)
    }
}
