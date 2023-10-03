//
//유효한 형식
//
export const ValidFormat = type =>{
    switch(type){
        case '이메일':
            return '올바른 이메일 형식이 아닙니다.'
        case '비밀번호':
            return '영문과 숫자를 포함하여 8글자 이상 입력해주세요.'
        case '이름':
            return '10글자 이내의 한글로 입력해주세요.'
        default:
            return ''
    }
}