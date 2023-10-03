//
//regular expression
//

//회원가입
//이메일 - (이메일 주소)@(도메인).(최상위 도메인 또는 TLD)
export const signupEmailRegex = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

//비밀번호 - 영문 숫자 조합, 8글자 이상
export const signupPasswordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,25}$/;

//이름 - 10글자 이내 한글
export const signupNameRegex = /^[ㄱ-ㅎ가-힇]{1,10}$/;


//