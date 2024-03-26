//
//메인 홈화면
//

import React, { useLayoutEffect, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

import 'react-native-get-random-values';
import { useRecoilValue } from 'recoil';
import { v4 as uuidv4 } from 'uuid';

import HomeRecord from '~/screens/MainTab/HomeRecord';
import HomeStatistic from '~/screens/MainTab/HomeStatistic';
import HomeWeight from '~/screens/MainTab/HomeWeight';

import { getData, storeData } from '~/components/ayncStorage';
import { RootView, TabContainer } from '~/components/container';
import { MainHeader } from '~/components/header';
import { AccessRightModal } from '~/components/modal';

import { DEVICE_ID } from '~/constants/asyncStoragekey';

import { dWidth, rWidth, rFont } from '~/styles/globalSizes';
import { colors, fonts } from '~/styles/globalStyles';

import { UserState } from '~/atoms/UserAtom';

const tabs = ['기록', '통계', '몸무게'];

const HomeScreen = ({ navigation }) => {
  const [tabLabel, setTabLabel] = useState(tabs[0]);

  const user = useRecoilValue(UserState);
  console.log('HomeScreen user', user);

  const [isModalVisible, setModalVisible] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <MainHeader
          notiPress={() => navigation.navigate('NotificationScreen')}
          userInfoPress={() => navigation.navigate('UserInfoMainScreen')}
        />
      ),
      // header: () => <MainHeader userInfoPress={() => navigation.navigate('UserInfoMainScreen')} />
    });
  }, [navigation]);

  useEffect(() => {
    onMountScreen();
  }, []);

  const onMountScreen = async () => {
    const deviceId = await getData(DEVICE_ID);

    if (deviceId === null) {
      // 처음 진입하는 사용자
      setModalVisible(true);

      const uuid = uuidv4();
      storeData(DEVICE_ID, uuid);
    } else {
      // 이미 진입한 사용자
      console.log('이미 진입한 적이 있습니다.');
    }
  };

  return (
    <TabContainer>
      <RootView>
        {user?.userCode && (
          <AccessRightModal
            isVisible={isModalVisible}
            toggleModal={() => setModalVisible(false)}
            user={user}
          />
        )}
        {/* 상단 탭 */}
        <View style={styles.tab}>
          {tabs.map((tab) => (
            <Pressable key={tab} onPress={() => setTabLabel(tab)}>
              <Text
                key={tab}
                style={[
                  styles.tabLabel,
                  { color: tab === tabLabel ? colors.black : colors.textGrey },
                ]}
              >
                {tab}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* 기록 화면 */}
        {tabLabel === tabs[0] && (
          <HomeRecord navigation={navigation} userInfo={user} />
        )}

        {/* 통계 화면 */}
        {tabLabel === tabs[1] && <HomeStatistic userInfo={user} />}

        {/* 몸무게 화면 */}
        {tabLabel === tabs[2] && <HomeWeight userInfo={user} />}
      </RootView>
    </TabContainer>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  tab: {
    width: dWidth,
    //height: rHeight(40),
    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: rWidth(14),
  },

  tabLabel: {
    fontFamily: fonts.bold,
    fontSize: rFont(23),

    marginHorizontal: rWidth(7),

    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
