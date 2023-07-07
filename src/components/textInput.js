//
// textInput 컴포넌트 모아놓은 파일
//

import React from "react";

import { TextInput, StyleSheet} from "react-native";

import { colors, fonts } from "~/constants/globalStyles"
import { scale, verticalScale } from "~/constants/globalSizes";

export function BasicTextInput({ type, text, onChangeText, placeholder, width }) {

  return (
      <TextInput
        style={[styles.input, type == 'light' ? styles.light : styles.dark, { width: width }]}
        onChangeText={onChangeText}
        value={text}
        placeholder={placeholder}
      />
  );
}

const styles = StyleSheet.create({
  input: {
    height: verticalScale(50),
    padding: scale(15),
    borderRadius: 10,
    marginVertical: verticalScale(10),
  },

  light: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.textGrey,
  },

  dark: {
    backgroundColor: colors.placeHolderGrey,
  },
});