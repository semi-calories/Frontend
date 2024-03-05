//
//유효한 형식
//
export const ValidFormat = (type) => {
  switch (type) {
    case '이메일':
      return '올바른 이메일 형식이 아닙니다.';
    case '비밀번호':
      return '영문과 숫자를 포함하여 8글자 이상 입력해주세요.';
    case '이름':
      return '10글자 이내의 한글로 입력해주세요.';
    case '나이':
      return '18이상 80이하 정수로 입력해주세요.';
    case '키':
      return '120이상 250이하,\n소수 첫째자리까지 입력해주세요.';
    case '몸무게':
      return '30이상 200이하,\n소수 첫째자리까지 입력해주세요.';
    case '목표 몸무게':
      return '30이상 200이하,\n소수 첫째자리까지 입력해주세요.';
    case '섭취량':
      return '1이상 3000이하, 소수 첫째자리까지 입력해주세요.';
    case '기간':
      return '10이상 365이하 정수로 입력해주세요.';
    default:
      return '';
  }
};
