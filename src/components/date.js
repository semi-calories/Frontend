//
//date 관련 계산 함수들
//

import Moment from 'moment';
import { extendMoment } from 'moment-range';

const moment = extendMoment(Moment);

//기록 - 날짜 더하고 빼고 계산
export const CalculateRecordDate = (calculation, date) => {
    const clone = new Date(date);

    if (calculation == 'add')
        clone.setDate(date.getDate() + 1)
    if (calculation == 'sub')
        clone.setDate(date.getDate() - 1)

    return clone;
}

//통계 - 날짜 더하고 뺴고 계산
export const CalculateStatisticDate = (type, calculation, date) => {
    const clone = new Date(date);

    if (type == '주간') {
        let adjustDate = date.getMonth();
        clone.setMonth(calculation == 'add' ? adjustDate + 1 : adjustDate - 1)
    } else if (type == '월간') {
        let adjustDate = date.getFullYear();
        clone.setFullYear(calculation == 'add' ? adjustDate + 1 : adjustDate - 1)
    }

    return clone;
}

//매월 주차 구하기
export const CalculateWeek = (year, month) => {
    //console.log('CalculateWeek year, month', year, month)
    startDate = moment.utc([year, month - 1])

    firstDay = moment(startDate).startOf('month')
    endDay = moment(startDate).endOf('month')

    monthRange = moment.range(firstDay, endDay);

    weeks = []
    for (let mday of monthRange.by('days')) {
        if (weeks.indexOf(mday.week()) === -1) {
            weeks.push(mday.week());
        }
    }

    calendar = []

    for (let index = 0; index < weeks.length; index++) {
        var weeknumber = weeks[index];
        firstWeekDay = moment(firstDay).week(weeknumber).day(0);
        if (firstWeekDay.isBefore(firstDay)) {
            firstWeekDay = firstDay;
        }
        lastWeekDay = moment(endDay).week(weeknumber).day(6);
        if (lastWeekDay.isAfter(endDay)) {
            lastWeekDay = endDay;
        }
        
        weekRange = moment.range(firstWeekDay, lastWeekDay)
        calendar.push(weekRange)
    }

    return calendar
}

export const FormatWeekData = rawWeekData =>{
    //console.log('FormatWeekData', rawWeekData)

    let weekData = [];

    for(let week of rawWeekData){
        let formatStartDate = moment(week.start).format('YYYY-MM-DD')
        let formatEndDate = moment(week.end).format('YYYY-MM-DD')

        weekData.push({start: formatStartDate, end: formatEndDate})
    }

    return weekData
}