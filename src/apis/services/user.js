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
    //console.log('getStructedRangeWeight rawData', rawData)
    const data = rawData.map(v => {
        const year = v.timestamp.substring(2, 4);
        const month = v.timestamp.substring(5, 7);
        const day = v.timestamp.substring(8, 10);

        return {
            value: v.weight,
            dataPointText: v.weight.toString(),
            //label: `${year}.${month}.${day}`
            label: `${month}.${day}`
        }
    })

    return [{ value: data[0].value }, ...data]
}

export const getStructedPredictWeight = rawData => {
    let startIndex = 0;

    const data = rawData.map(v => {
        if (v.predictWeight == 0) {
            startIndex++;
            return { value: 0 }
        }

        const year = v.timestamp.substring(2, 4);
        const month = v.timestamp.substring(5, 7);
        const day = v.timestamp.substring(8, 10);

        return {
            value: v.predictWeight,
            dataPointText: v.predictWeight.toString(),
            //label: `${year}.${month}.${day}`
            label: `${month}.${day}`
        }
    })
    //console.log(data, startIndex)

    return [startIndex, { value: 0 }, ...data]
}
