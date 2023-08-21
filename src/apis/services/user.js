//
//api 요청시 받아오는 데이터 정제
//

export const getUserInfo = (rawUserInfo) => {
    // const { email, userName, notifications } = rawUserInfo.user
    // return {
    //     email,
    //     name: userName,
    //     notifications: notifications.length > 0 ? notifications : null,
    // }
    return rawUserInfo;
}

export const updatUserInfo = (rawUserInfo) =>{
    return rawUserInfo;
}
