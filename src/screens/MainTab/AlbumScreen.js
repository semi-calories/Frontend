//
// 앨범 스크린 나타나는 화면
//
import React, { useEffect, useState, useLayoutEffect, useRef } from "react";

import { StyleSheet, TouchableOpacity, View, Image, Text, FlatList, Pressable } from "react-native";
import * as MediaLibrary from 'expo-media-library';

import { BackHeader } from "~/components/header";
import { RootView } from "~/components/container";

import { UserInfoType } from "~/constants/type";

import { dWidth, verticalScale, scale } from "~/constants/globalSizes";
import { colors, fonts } from "~/constants/globalStyles";

const AlbumScreen = ({ navigation, route }) => {
    const { nextScreen, photosParam, firstPhotoId } = route.params

    const [photos, setPhotos] = useState([])
    console.log('AlbumScreen photos', photos)
    const [chosenPhoto, setChosenPhoto] = useState(null)

    const albumRef = useRef(null)
    console.log("AlbumScreen albumRef", albumRef)

    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => <BackHeader back title="사진 선택" backPress={() => navigation.goBack()} />
        });
    }, [navigation]);

    useEffect(() => {
        setPhotos([...photosParam])
        albumRef.current = firstPhotoId
    }, [])

    const renderItem = ({ item }) => {
        return (
            <Pressable onPress={() => setChosenPhoto(item)} style={styles.imageView} >
                <Image source={{ uri: item.uri }} style={styles.image} resizeMode="cover" />
            </Pressable>
        );
    };

    const onEndReached = async () => {
        const { assets , endCursor, hasNextPage } = await MediaLibrary.getAssetsAsync({
            after: albumRef.current,
        });

        if (hasNextPage) {
            albumRef.current = endCursor;
            setPhotos([...photos, ...assets]);
        }
    };

    const reChoosePictureHandler = () => {
        setChosenPhoto(null)
    }

    const uploadPictureHandler = () => {
        let params = {};

        if (nextScreen == 'MealtimeScreen') {
            //api호출 후 captureImage 보내고 정보 받아오기
            params = { foodParam: [] }
        } else {
            params = { image: chosenPhoto.uri, infoType: UserInfoType.edit }
        }

        navigation.navigate(nextScreen, params)
    }


    return photos.length !== 0 && (
        chosenPhoto ? (
            <RootView>
                <Image source={{ uri: chosenPhoto.uri }} style={styles.album} />
                <View style={styles.touchView}>
                    <TouchableOpacity activeOpacity={0.6} onPress={reChoosePictureHandler}>
                        <Text style={styles.text}>다시선택</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.6} onPress={uploadPictureHandler}>
                        <Text style={styles.text}>완료</Text>
                    </TouchableOpacity>
                </View>
            </RootView>
        ) : (
            <RootView viewStyle={styles.container}>
                <FlatList
                    data={photos}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    numColumns={3}
                    onEndReached={onEndReached}
                    //onEndReachedThreshold={0.8}
                    showsVerticalScrollIndicator="false"
                />

            </RootView>
        )

    )
}

export default AlbumScreen;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: scale(5),
    },

    imageView: {
        marginHorizontal: scale(2),
        marginVertical: verticalScale(2),
    },

    image: {
        width: dWidth / 3 - scale(7.5),
        height: verticalScale(120)
    },

    album: {
        width: dWidth,
        height: verticalScale(550)
    },

    touchView: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: scale(30)
    },

    text: {
        fontFamily: fonts.bold,
        fontSize: scale(20),
    }
})