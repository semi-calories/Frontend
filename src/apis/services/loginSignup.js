//
//login 및 회원가입 관련 데이터 정제
//

export const getLoginInfo = (rawLoginInfo) => {
    const { userExists, user, matchResult } = rawLoginInfo

    if (userExists && matchResult) {
        return { user, error: '' }
    } else if (userExists) {
        return { user, error: '아이디나 비밀번호를 확인해주세요.' }
    } else {
        return { user, error: '존재하지 않는 회원입니다.' }
    }
}

export const getSignupInfo = (rawSignupInfo) => {
    return rawSignupInfo.response
}