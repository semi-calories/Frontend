//
//api 요청시 받아오는 데이터 정제
//

export const getPreferFood = rawData =>{
    return rawData.map(food => food.preferFoodCode)
}

export const getDislikeFood = rawData =>{
    return rawData.map(food => food.dislikeFoodCode)
}

export const getStructedRangeWeight = rawData =>{
    const data =  rawData.map(v => {
        return {
            value:v.weight,
            dataPointText:v.weight.toString(),
            label:v.timestamp.substring(0,10)
        }
    })

    return data
}
