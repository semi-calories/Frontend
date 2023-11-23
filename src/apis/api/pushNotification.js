import { fetchDataGet, fetchDataPost } from "~/apis/utils/instance"

export const saveSetting =async(reqBody) =>{
    try {
        const { data } = await fetchDataPost(`/alert/saveSetting`, reqBody)
        return data
    } catch (err) {
        console.error(err)
    }
}

export const getSetting =async(reqBody) =>{
    try {
        const { data } = await fetchDataPost(`/alert/getSetting`, reqBody)
        return data
    } catch (err) {
        console.error(err)
    }
}

export const updateSetting =async(reqBody) =>{
    try {
        const { data } = await fetchDataPost(`/alert/updateSetting`, reqBody)
        return data
    } catch (err) {
        console.error(err)
    }
}