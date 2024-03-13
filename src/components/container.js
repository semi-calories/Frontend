// 공통적으로 쓰이는 Container

import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

import { colors } from '~/styles/globalStyles';

import { useTabMenu } from '~/context/TabContext';

export function RootView({ children, viewStyle }) {
  return <View style={[styles.rootView, viewStyle]}>{children}</View>;
}

export function TabContainer({ children }) {
  const { opened } = useTabMenu();

  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: opened ? 1 : 0,
      duration: 300,
      friction: 2,
      useNativeDriver: false,
    }).start();
  }, [opened, animation]);

  return (
    <View style={styles.tab}>
      {children}
      {opened && (
        <Animated.View
          style={[
            styles.overlay,
            {
              backgroundColor: animation.interpolate({
                inputRange: [0, 1],
                outputRange: ['transparent', colors.black],
              }),
            },
          ]}
        />
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    opacity: 0.3,
  },
});
