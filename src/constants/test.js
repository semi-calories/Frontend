//
//하드코딩된 test용 정보들
//
import { Nutrition, Nutrition_ko} from '~/constants/nutrition'
import { colors } from '~/constants/globalStyles';

//User 정보
export const Null_img = require('@assets/null_img.png');
export const UserName = '김건국';

//영양섭취
export const TargetIntake = {
    kcal: 1929,
    carb: 198,
    protein: 193,
    fat: 43,
}

export const SpentAmount = 859;
export const TargetAmount = 1929;

export const SpentNutri = {
    [Nutrition.carbo]: 82,
    [Nutrition.protein]: 53,
    [Nutrition.fat]: 36
}
export const TargetNutri = {
    [Nutrition.carbo]: 198,
    [Nutrition.protein]: 198,
    [Nutrition.fat]: 43
}

//통계
export const WeekData = {
    labels: ["1주차", "2주차", "3주차", "4주차", "5주차"],
    legend: [Nutrition_ko[Nutrition.carbo], Nutrition_ko[Nutrition.protein], Nutrition_ko[Nutrition.fat]],
    data: [
        [30, 20, 25],
        [40, 40, 20],
        [35, 20, 20],
        [20, 30, 20],
        [20, 20, 20]

    ],
    barColors: [colors.carbo, colors.protein, colors.fat]
};

export const MonthData = {
    labels: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
    legend: [Nutrition_ko[Nutrition.carbo], Nutrition_ko[Nutrition.protein], Nutrition_ko[Nutrition.fat]],
    data: [
        [30, 20, 25],
        [40, 40, 20],
        [35, 20, 20],
        [20, 30, 20],
        [20, 20, 20],
        [30, 20, 25],
        [40, 40, 20],
        [35, 20, 20],
        [20, 30, 20],
        [20, 20, 20],
        [40, 40, 20],
        [35, 20, 20],
    ],
    barColors: [colors.carbo, colors.protein, colors.fat]
};