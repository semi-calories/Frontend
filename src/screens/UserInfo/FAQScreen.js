//
//FAQ 화면
//
import React, { useLayoutEffect } from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

import { BackHeader } from '~/components/header';
import { rWidth, rHeight, dWidth, dHeight } from '~/constants/globalSizes';
import { colors } from '~/constants/globalStyles';

const FAQScreen = ({ navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <BackHeader back backPress={() => navigation.goBack()} title="FAQ" />
      ),
    });
  }, [navigation]);

  return (
    <WebView
      source={{
        uri: 'https://semi-calories.notion.site/FAQ-6df30d7f3294418bb2b7e1d3b3c485f4?pvs=4',
      }}
      startInLoadingState
      renderLoading={() => (
        <ActivityIndicator
          style={styles.indicator}
          color={colors.primary}
          size="large"
        />
      )}
    />
  );
};

export default FAQScreen;

const styles = StyleSheet.create({
  container: {
    //flex:1,
  },

  indicator: {
    position: 'absolute',
    left: rWidth(dWidth * 0.45),
    top: rHeight(dHeight * 0.4),
  },
});
