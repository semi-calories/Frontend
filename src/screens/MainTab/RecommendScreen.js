//
// 추천때 보여지는 화면
//

import React, { useLayoutEffect, useState } from "react";

import { View, Text, StyleSheet, FlatList, Image } from "react-native";

import { TabContainer, RootView } from "~/components/container";
import { MainHeader } from "~/components/header";

import { RecommendFood } from "~/constants/test";
import { Nutrition, Nutrition_ko } from "~/constants/food";

import { dWidth, scale, verticalScale } from "~/constants/globalSizes";
import { colors, fonts } from "~/constants/globalStyles";

const RecommendScreen = ({ navigation }) => {
    const [isRefreshing, setIsRefreshing] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => <MainHeader notiPress={() => navigation.navigate('NotificationScreen')} userInfoPress={() => navigation.navigate('UserInfoMainScreen')} />
        });
    }, [navigation]);

    const renderItem = ({ item }) => {
        return (
            <View style={styles.container}>
                {item.food_image ? <Image source={item.food_image} style={styles.image} /> : <View style={[styles.image, { borderWidth: 1, borderColor: colors.textGrey }]} />}
                <View style={styles.foodView}>
                    <View style={styles.flexRow}>
                        <Text style={styles.text}>{item.food_name}</Text>
                        <Text style={[styles.greyText, { fontSize: scale(14) }]}>{item.food_kcal} kcal</Text>
                    </View>
                    <View style={[styles.flexRow,{marginTop:verticalScale(5), paddingHorizontal:scale(5)}]}>
                            <View style={styles.nutri}>
                                <Text style={styles.greyText}>{Nutrition_ko[Nutrition.foodCarbo]}</Text>
                                <Text style={styles.greyText}>{item.food_carbo} g</Text>
                            </View>
                            <View style={styles.verticalBorder} />
                            <View style={styles.nutri}>
                                <Text style={styles.greyText}>{Nutrition_ko[Nutrition.foodProtein]}</Text>
                                <Text style={styles.greyText}>{item.food_protein} g</Text>
                            </View>
                            <View style={styles.verticalBorder} />
                            <View style={styles.nutri}>
                                <Text style={styles.greyText}>{Nutrition_ko[Nutrition.foodFat]}</Text>
                                <Text style={styles.greyText}>{item.food_fat} g</Text>
                            </View>
                        </View>
                </View>
            </View>
        );
    };

    const fetchItems = () => {

        setIsRefreshing(false)
    }

    return (
        <TabContainer>
            <RootView viewStyle={styles.viewStyle}>
                <FlatList
                    data={RecommendFood}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    onRefresh={fetchItems}
                    refreshing={isRefreshing}
                    showsVerticalScrollIndicator="false"
                    contentContainerStyle={{paddingBottom : verticalScale(80)}}
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