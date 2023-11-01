//
// 차트 관련 컴포넌트들 모음
//

import React, { useRef, useEffect } from "react";

import { StyleSheet, View, Text, Animated, Easing } from "react-native";
import Svg, { G, Circle } from "react-native-svg";

import { rWidth, rHeight, rFont } from "~/constants/globalSizes";
import { colors, fonts } from "~/constants/globalStyles";

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

export function DonutChart({ strokeWidth, radius, spentAmount, targetAmount }) {
    const animatedValue = useRef(new Animated.Value(0)).current
    const circleRef = useRef()

    const circleCircumference = 2 * Math.PI * radius;
    const halfCircle = radius + strokeWidth
    const percentageComplete = (spentAmount / targetAmount) * 100;

    const animation = toValue => {
        return Animated.timing(animatedValue, {
            toValue,
            duration: 500,
            delay: 0,
            useNativeDriver: true,
            easing: Easing.out(Easing.ease),
        }).start()
    }

    useEffect(() => {
        animation(percentageComplete)

        animatedValue.addListener((v) => {
            const strokeDashoffset = circleCircumference - (circleCircumference * v.value) / 100;

            if (circleRef?.current) {
                circleRef.current.setNativeProps({
                    strokeDashoffset,
                })
            }
        }, [percentageComplete])

        return () => {
            animatedValue.removeAllListeners();
        };
    })

    return (
        <View style={styles.container}>
            <Svg height={radius * 2} width={radius * 2} viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}>
                <G rotation='-90' origin={`${halfCircle}, ${halfCircle}`}>
                    <Circle
                        cx="50%"
                        cy="50%"
                        r={radius}
                        stroke={colors.textGrey}
                        fill="transparent"
                        strokeWidth={strokeWidth}
                        strokeOpacity={0.2}
                    />
                    <AnimatedCircle
                        ref={circleRef}
                        cx="50%"
                        cy="50%"
                        r={radius}
                        stroke={colors.primary}
                        fill="transparent"
                        strokeWidth={strokeWidth}
                        strokeDasharray={circleCircumference}
                        strokeDashoffset={circleCircumference}
                        strokeLinecap="round"
                    />
                </G>
            </Svg>
            <View style={styles.textView}>
                <Text style={styles.text}>{spentAmount}</Text>
                <Text style={styles.unitText}> kcal</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
    },

    textView: {
        flexDirection: 'row',
        position: "absolute",
        alignItems: 'flex-end',
        //justifyContent: "center",
    },

    text: {
        fontFamily: fonts.medium,
        fontSize: rFont(25),
        color: colors.black,

        includeFontPadding: false,
        textAlignVertical: 'center'
    },

    unitText: {
        fontFamily: fonts.regular,
        fontSize: rFont(15),
        color: colors.black,

        marginBottom: rHeight(3),

        includeFontPadding: false,
        textAlignVertical: 'center'
    }

})