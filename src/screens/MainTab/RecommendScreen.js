//
// 추천때 보여지는 화면
//

import React, { useLayoutEffect, useState, useEffect } from "react";

import { View, Text, StyleSheet, FlatList, Image } from "react-native";

import { TabContainer, RootView } from "~/components/container";
import { MainHeader } from "~/components/header";

import { GetUserData } from "~/components/asyncStorageData";

import { RecommendFood } from "~/constants/test";
import { Nutrition, Nutrition_ko } from "~/constants/food";

import { dWidth, scale, verticalScale } from "~/constants/globalSizes";
import { colors, fonts } from "~/constants/globalStyles";

import { recommendRequest } from "~/apis/api/diet";

const RecommendScreen = ({ navigation }) => {
    const [isRefreshing, setIsRefreshing] = useState(false);

    const [user, setUser] = useState({})
    //console.log('RecommendScreen user', user)
    const [recommends, setRecommends] = useState([]);
    console.log('RecommendScreen recommends', recommends)

    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => <MainHeader notiPress={() => navigation.navigate('NotificationScreen')} userInfoPress={() => navigation.navigate('UserInfoMainScreen')} />
        });
    }, [navigation]);

    useEffect(() => {
        if (user) {
            recommendRequestDiet()
        }
    }, [user])

    useEffect(() => {
        const focusSubscription = navigation.addListener('focus', () => {
            console.log('HomeScreen focus')
            getUser()
        });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return focusSubscription;
    }, [navigation]);

    const getUser = async () => {
        const data = await GetUserData();

        setUser({ ...data })
    }


    const renderItem = ({ item }) => {
        return (
            <View style={styles.container}>
                {item.foodImgUrl ? <Image source={{uri: item.foodImgUrl}} style={styles.image} /> : <View style={[styles.image, { borderWidth: 1, borderColor: colors.textGrey }]} />}
                <View style={styles.foodView}>
                    <View style={styles.flexRow}>
                        <Text style={styles.text}>{item.foodName}</Text>
                        <Text style={[styles.greyText, { fontSize: scale(14) }]}>{item.foodKcal} kcal</Text>
                    </View>
                    <View style={[styles.flexRow, { marginTop: verticalScale(5), paddingHorizontal: scale(5) }]}>
                        <View style={styles.nutri}>
                            <Text style={styles.greyText}>{Nutrition_ko[Nutrition.foodCarbo]}</Text>
                            <Text style={styles.greyText}>{item.foodCarbon} g</Text>
                        </View>
                        <View style={styles.verticalBorder} />
                        <View style={styles.nutri}>
                            <Text style={styles.greyText}>{Nutrition_ko[Nutrition.foodProtein]}</Text>
                            <Text style={styles.greyText}>{item.foodProtein} g</Text>
                        </View>
                        <View style={styles.verticalBorder} />
                        <View style={styles.nutri}>
                            <Text style={styles.greyText}>{Nutrition_ko[Nutrition.foodFat]}</Text>
                            <Text style={styles.greyText}>{item.foodFat} g</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    const fetchItems = () => {
        recommendRequestDiet()

        setIsRefreshing(false)
    }

    const recommendRequestDiet = async () => {
        const requestInfo = {
            userCode: user.userCode,
            eatTimes: 0,
        }

        try {
            const { recommendList } = await recommendRequest(requestInfo)

            setRecommends([...recommendList])
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <TabContainer>
            <RootView viewStyle={styles.viewStyle}>
                <FlatList
                    data={recommends}
                    renderItem={renderItem}
                    keyExtractor={(item,idx) => item+idx}
                    onRefresh={fetchItems}
                    refreshing={isRefreshing}
                    showsVerticalScrollIndicator="false"
                    contentContainerStyle={{ paddingBottom: verticalScale(80) }}
                />
            </RootView>
        </TabContainer>
    );
}

export default RecommendScreen;

const styles = StyleSheet.create({
    viewStyle: {
        paddingHorizontal: scale(34),
    },

    container: {
        paddingVertical: verticalScale(24),
        flexDirection: 'row',

        borderBottomWidth: scale(1),
        borderBottomColor: colors.textGrey,
    },

    image: {
        width: scale(90),
        height: verticalScale(75),
        borderRadius: 10,
        resizeMode:'contain'
    },

    text: {
        fontFamily: fonts.medium,
        fontSize: scale(18),
        color: colors.black
    },

    greyText: {
        fontFamily: fonts.medium,
        fontSize: scale(13),
        color: colors.textGrey,
    },

    foodView: {
        flex: 1,
        marginLeft: scale(18),
        paddingVertical: verticalScale(3)
    },

    flexRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    nutri: {
        width: scale(50),
        alignItems: 'center',
    },

    verticalBorder: {
        width: scale(1),
        height: verticalScale(24),
        backgroundColor: colors.textGrey
    },


});