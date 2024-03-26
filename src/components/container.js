// 공통적으로 쓰이는 Container

import React, { useRef, useEffect } from 'react';
import {
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  View,
} from 'react-native';

import { colors } from '~/styles/globalStyles';

import { useTabMenu } from '~/context/TabContext';

export function RootView({ children, viewStyle }) {
  return <View style={[styles.rootView, viewStyle]}>{children}</View>;
}

export function TabContainer({ children }) {
  const { opened, toggleOpened } = useTabMenu();

  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: opened ? 1 : 0,
      duration: 300,
      friction: 2,
      useNativeDriver: true,
    }).start();
  }, [opened, animation]);

  return (
    <View style={styles.tab}>
      {children}
      {opened && (
        <Pressable style={styles.overlay} onPress={toggleOpened}>
        <Animated.View
          style={[
            {
              backgroundColor: animation.interpolate({
                inputRange: [0, 1],
                outputRange: ['transparent', colors.black],
              }),
            },
          ]}
        />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  rootView: {
    flex: 1,
    backgroundColor: colors.white,
  },

  tab: {
    flex: 1,
  },

  overlay: {
    backgroundColor: colors.black,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 2, //overlay가 덮는 부분이 있어서 2px만큼 띄워줌
    zIndex: 1,
    opacity: 0.3,
  },
});
