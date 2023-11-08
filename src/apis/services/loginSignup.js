//
//login 및 회원가입 관련 데이터 정제
//
import { saveTokens } from "~/components/expoSecureStore"

export const getLoginInfo = (rawLoginInfo) => {
    const { userExists, user, matchResult, accessToken, refreshToken } = rawLoginInfo
      
    if (userExists && matchResult) {
        saveTokens(accessToken, refreshToken)
        return { user, error: '' }
    } else if (userExists) {
        return { user, error: '아이디나 비밀번호를 확인해주세요.' }
    } else {
        return { user, error: '존재하지 않는 회원입니다.' }
    }
}