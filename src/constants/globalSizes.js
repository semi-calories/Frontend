//
// size scaling
//

import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

//Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 390;
const guidelineBaseHeight = 844;
const screenSize = Math.sqrt(width * height) / 100;

//너비에 관한 scale
export const scale = size => (width / guidelineBaseWidth) * size;
//높이에 관한 scale
export const verticalScale = size => (height / guidelineBaseHeight) * size;

//너비 관한 scale (factor로 크기 조정 요소)
export const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;
//높이 관한 scale (factor로 크기 조정 요소)
export const moderateVerticalScale = (size, factor= 0.5 ) => size + (verticalScale(size) - size) * factor
