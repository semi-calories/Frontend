//
//유저 성별, 나이, 키, 몸무게 등 설정할 수 있는 화면
//
import React, { useLayoutEffect, useState, useEffect, useRef } from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  View,
  Pressable,
  ImageBackground,
  Alert,
} from 'react-native';

import {
  MaterialCommunityIcons,
  Entypo,
  FontAwesome5,
} from '@expo/vector-icons';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import ActionSheet from 'react-native-actionsheet';
import { useSetRecoilState } from 'recoil';

import { MoveButton } from '~/components/button';
import { RootView } from '~/components/container';
import { BackHeader } from '~/components/header';
import {
  ageRegex,
  heightRegex,
  nameRegex,
  weightRegex,
} from '~/components/regex';
import { LabelTextInput } from '~/components/textInput';

import { UserInfoType } from '~/constants/type';
import {
  Gender,
  Gender_ko,
  Gender_icon,
  UserInfo,
  UserInfo_ko,
  Activity,
  Activity_ko,
  Activity_icon,
} from '~/constants/UserInfo';

import { rWidth, rHeight, rFont } from '~/styles/globalSizes';
import { fonts, colors } from '~/styles/globalStyles';

import { UserState } from '~/atoms/UserAtom';

import { getInfo, updateInfo } from '~/apis/api/user';

const GenderFunc = ({ label, onPress, gender }) => {
  return (
    <View style={{ alignItems: 'center' }}>
      <Pressable style={styles.genderIconView} onPress={onPress}>
        <MaterialCommunityIcons
          name={Gender_icon[label]}
          size={rHeight(60)}
          color={
            gender === label
              ? gender === Gender.female
                ? colors.pink
                : colors.blue
              : colors.textGrey
          }
        />
      </Pressable>
      <Text style={[styles.smallLabelText, { color: colors.borderGrey }]}>
        {Gender_ko[label]}
      </Text>
    </View>
  );
};

const ActivityFunc = ({ label, onPress, activity }) => {
  return (
    <Pressable onPress={onPress} style={{ alignItems: 'center' }}>
      <MaterialCommunityIcons
        name={Activity_icon[label]}
        size={rWidth(50)}
        color={label === activity ? colors.primary : colors.textGrey}
      />
      <Text
        style={[
          styles.smallLabelText,
          { color: label === activity ? colors.primary : colors.textGrey },
        ]}
      >
        {Activity_ko[label]}
      </Text>
    </Pressable>
  );
};

const UserInfoEditScreen = ({ navigation, route }) => {
  const { userInfo, infoType } = route.params;
  console.log('UserInfoEditScreen user', userInfo);

  const [image, setImage] = useState();
  const [name, setName] = useState();
  const [gender, setGender] = useState();
  const [age, setAge] = useState();
  const [height, setHeight] = useState();
  const [weight, setWeight] = useState();
  const [goalWeight, setGoalWeight] = useState();
  const [userActivity, setActivity] = useState();

  const actionSheetRef = useRef(null);

  const setUserState = useSetRecoilState(UserState);

  useLayoutEffect(() => {
    if (infoType === UserInfoType.init) {
      navigation.setOptions({
        header: () => <BackHeader />,
      });
    } else if (infoType === UserInfoType.edit) {
      navigation.setOptions({
        header: () => (
          <BackHeader
            back
            title="사용자 정보"
            backPress={() => navigation.pop()}
          />
        ),
      });
    }
  }, [navigation, infoType]);

  useEffect(() => {
    setImage(userInfo.image ? userInfo.image : '');
    setName(userInfo.name ? userInfo.name : '');
    setGender(userInfo.gender ? userInfo.gender : '');
    setAge(userInfo.age ? userInfo.age.toString() : '');
    setHeight(userInfo.height ? userInfo.height.toString() : '');
    setWeight(userInfo.weight ? userInfo.weight.toString() : '');
    setGoalWeight(userInfo.goalWeight ? userInfo.goalWeight.toString() : '');
    setActivity(userInfo.userActivity ? userInfo.userActivity : '');
  }, [route.params?.userInfo]);

  const CameraIcon = () => {
    return (
      <Pressable
        onPress={() => actionSheetRef.current.show()}
        style={styles.imgView}
      >
        <View style={styles.img}>
          <Entypo name="camera" size={rHeight(28)} color={colors.borderGrey} />
        </View>
      </Pressable>
    );
  };

  const onPressCameraMenu = async (index) => {
    switch (index) {
      case 0: {
        //사진선택
        const { status: cameraStatus } =
          await Camera.requestCameraPermissionsAsync();
        // 권한을 획득하면 status가 granted 상태
        if (cameraStatus === 'granted') {
          navigation.navigate('CameraScreen', {
            nextScreen: 'UserInfoEditScreen',
            userInfo,
          });
        } else {
          Alert.alert('카메라 접근 허용은 필수입니다.');
        }

        break;
      }

      case 1: {
        //앨범에서 선택
        const { status: albumStatus } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (albumStatus === 'granted') {
          navigation.navigate('AlbumScreen_new', {
            nextScreen: 'UserInfoEditScreen',
            userInfo,
          });
        } else {
          Alert.alert('앨범 접근 허용은 필수입니다.');
        }

        break;
      }

      default:
    }
  };

  const onPressComplete = () => {
    if (
      !(name && gender && age && height && weight && goalWeight && userActivity)
    ) {
      Alert.alert('항목을 모두 입력해주세요.');
      return;
    }

    if (
      !(
        nameRegex.test(name) &&
        ageRegex.test(age) &&
        heightRegex.test(height) &&
        weightRegex.test(weight) &&
        weightRegex.test(goalWeight)
      )
    ) {
      Alert.alert('올바른 형식인지 확인하세요');
      return;
    }

    const user = {
      userCode: userInfo.userCode,
      email: userInfo.email,
      name,
      image: image.base64 ? image.base64 : image.uri,
      gender,
      age,
      height,
      weight,
      goalWeight,
      userActivity,
      userGoal: userInfo.userGoal,
      period: userInfo.period,
    };

    const userWeight = {
      userCode: userInfo.userCode,
      goalWeight,
      period: userInfo.period,
    };

    handleSetUserInfo(user, userWeight);
  };

  const handleSetUserInfo = async (user, userWeight) => {
    if (infoType === UserInfoType.init) {
      navigation.push('SetGoalScreen', {
        userInfo: user,
        infoType: UserInfoType.init,
      });
    } else if (infoType === UserInfoType.edit) {
      try {
        //await savePredictWeight(userWeight)
        await updateInfo(user);
        const userData = await getInfo({ userCode: userInfo.userCode });
        setUserState({ ...userData, userCode: userInfo.userCode });

        Alert.alert('사용자 정보 수정 완료!');
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <RootView viewStyle={styles.container}>
      {infoType === UserInfoType.init && (
        <>
          <Text style={styles.boldText}>{userInfo.name}님</Text>
          <Text style={styles.text}>나만의 식단 관리 설정</Text>
        </>
      )}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {infoType === UserInfoType.edit && (
          <View>
            {image?.uri ? (
              <ImageBackground
                source={{ uri: image.uri }}
                style={styles.imgBackground}
                imageStyle={{ borderRadius: 100 }}
                resizeMode="cover"
              >
                <CameraIcon />
              </ImageBackground>
            ) : (
              <View
                style={[
                  styles.imgBackground,
                  {
                    backgroundColor: colors.placeHolderGrey,
                    borderRadius: 100,
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                ]}
              >
                <FontAwesome5
                  name="user"
                  size={rHeight(80)}
                  color={colors.borderGrey}
                />
                <CameraIcon />
              </View>
            )}
            <LabelTextInput
              label={UserInfo_ko[UserInfo.name]}
              value={name}
              onChangeText={setName}
              width={rWidth(320)}
              defaultValue={name}
              valid={nameRegex.test(name)}
            />
          </View>
        )}
        <View style={styles.flexRow}>
          <Text style={styles.labelText}>{UserInfo_ko[UserInfo.gender]}</Text>
        </View>
        <View style={styles.contentView}>
          <GenderFunc
            label={Gender.female}
            onPress={() => setGender(Gender.female)}
            gender={gender}
          />
          <GenderFunc
            label={Gender.male}
            onPress={() => setGender(Gender.male)}
            gender={gender}
          />
        </View>

        <View style={{ flexDirection: 'row' }}>
          <LabelTextInput
            label={UserInfo_ko[UserInfo.age]}
            value={age}
            onChangeText={setAge}
            unit="세"
            width={rWidth(155)}
            keyboardType="numeric"
            inputViewStyle={styles.inputViewStyle}
            valid={ageRegex.test(age)}
          />
          <LabelTextInput
            label={UserInfo_ko[UserInfo.height]}
            value={height}
            onChangeText={setHeight}
            unit="cm"
            width={rWidth(155)}
            keyboardType="numeric"
            valid={heightRegex.test(height)}
          />
        </View>
        <View style={{ flexDirection: 'row' }}>
          <LabelTextInput
            label={UserInfo_ko[UserInfo.weight]}
            value={weight}
            onChangeText={setWeight}
            unit="kg"
            width={rWidth(155)}
            keyboardType="numeric"
            inputViewStyle={styles.inputViewStyle}
            valid={weightRegex.test(weight)}
          />
          <LabelTextInput
            label={UserInfo_ko[UserInfo.goalWeight]}
            value={goalWeight}
            onChangeText={setGoalWeight}
            unit="kg"
            width={rWidth(155)}
            keyboardType="numeric"
            valid={weightRegex.test(goalWeight)}
          />
        </View>

        <Text style={styles.labelText}>
          {UserInfo_ko[UserInfo.userActivity]}
        </Text>
        <View style={[styles.contentView, { marginBottom: rHeight(40) }]}>
          <ActivityFunc
            label={Activity.less}
            onPress={() => setActivity(Activity.less)}
            activity={userActivity}
          />
          <ActivityFunc
            label={Activity.normal}
            onPress={() => setActivity(Activity.normal)}
            activity={userActivity}
          />
          <ActivityFunc
            label={Activity.more}
            onPress={() => setActivity(Activity.more)}
            activity={userActivity}
          />
        </View>
      </ScrollView>
      <MoveButton
        text={infoType === UserInfoType.init ? '다음' : '완료'}
        onPress={onPressComplete}
        inActive={
          !(
            name &&
            gender &&
            age &&
            height &&
            weight &&
            goalWeight &&
            userActivity
          )
        }
      />

      <ActionSheet
        ref={actionSheetRef}
        options={['사진찍기', '앨범에서 선택', '취소']}
        cancelButtonIndex={2}
        //destructiveButtonIndex={1}
        onPress={(index) => onPressCameraMenu(index)}
      />
    </RootView>
  );
};

export default UserInfoEditScreen;

const styles = StyleSheet.create({
  container: {
    //paddingHorizontal: scale(30),
    alignItems: 'center',
  },

  boldText: {
    fontFamily: fonts.bold,
    fontSize: rFont(30),
    color: colors.black,

    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  text: {
    fontFamily: fonts.medium,
    fontSize: rFont(25),
    color: colors.black,

    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  scrollView: {
    paddingVertical: rHeight(20),
  },

  labelText: {
    fontFamily: fonts.bold,
    fontSize: rFont(20),
    color: colors.borderGrey,

    marginVertical: rHeight(15),

    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  contentView: {
    flexDirection: 'row',
    paddingHorizontal: rWidth(20),
    justifyContent: 'space-evenly',
    marginBottom: rHeight(25),
  },

  genderIconView: {
    width: rWidth(109),
    height: rHeight(99),
    backgroundColor: colors.white,

    borderWidth: rHeight(2),
    borderColor: colors.textGrey,
    borderRadius: rHeight(10),

    alignItems: 'center',
    justifyContent: 'center',
  },

  smallLabelText: {
    fontFamily: fonts.medium,
    fontSize: rFont(15),

    marginVertical: rHeight(5),

    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  inputViewStyle: {
    marginRight: rWidth(20),
    paddingBottom: rWidth(10),
  },

  imgBackground: {
    width: rHeight(120),
    height: rHeight(120),
    alignSelf: 'center',
    marginBottom: rHeight(25),
  },

  imgView: {
    position: 'absolute',
    bottom: rWidth(-5),
    right: rWidth(-5),

    backgroundColor: colors.white,
    borderRadius: 50,
    width: rWidth(50),
    height: rHeight(50),
    borderWidth: 1,
    borderColor: colors.placeHolderGrey,
    alignItems: 'center',
    justifyContent: 'center',
  },

  img: {
    width: rWidth(40),
    height: rHeight(40),
    backgroundColor: colors.placeHolderGrey,
    borderRadius: 50,
    alignItems: 'center',
    paddingTop: rHeight(5),
  },

  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
