//
//api 요청시 받아오는 데이터 정제
//

export const getPreferFood = rawData => {
    return rawData.map(food => food.preferFoodCode)
}

export const getDislikeFood = rawData => {
    return rawData.map(food => food.dislikeFoodCode)
}

export const getStructedRangeWeight = rawData => {
    const data = rawData.map(v => {
        const year = v.timestamp.substring(2, 4);
        const month = v.timestamp.substring(5, 7);
        const day = v.timestamp.substring(8, 10);

        return {
            value: v.weight,
            dataPointText: v.weight.toString(),
            label: `${year}.${month}.${day}`
        }
    })

    return [{ value: data[0].value }, ...data]
}
