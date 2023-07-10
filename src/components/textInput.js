//
// textInput 컴포넌트 모아놓은 파일
//

import React from "react";

import { TextInput, StyleSheet, Text, View } from "react-native";

import { colors, fonts } from "~/constants/globalStyles"
import { scale, verticalScale } from "~/constants/globalSizes";

export function BasicTextInput({ type, text, onChangeText, placeholder, width, keyboardType = 'default' }) {
  return (
    <TextInput
      style={[styles.input, type == 'light' ? styles.light : styles.dark, { width: width }]}
      onChangeText={onChangeText}
      value={text}
      placeholder={placeholder}
      keyboardType={keyboardType}
    />
  );
}

export function LabelTextInput({ type, label, text, onChangeText, unit, placeholder, width, keyboardType = 'default', inputStyle}) {
  return (
    <View style={inputStyle}>
      <Text style={styles.labelText}>{label}</Text>
      <View style={[styles.input, type == 'light' ? styles.light : styles.dark,{ width:width, flexDirection: 'row' }]}>
        <TextInput
          style={{flex:1}}
          onChangeText={onChangeText}
          value={text}
          placeholder={placeholder}
          keyboardType = {keyboardType}
        />
        {unit && <Text style={styles.unitText}>{unit}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: verticalScale(50),
    padding: scale(15),
    borderRadius: 10,
    marginVertical: verticalScale(6),
  },

  light: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.textGrey,
  },

  dark: {
    backgroundColor: colors.placeHolderGrey,
  },

  labelText: {
    fontFamily: fonts.bold,
    fontSize: scale(20),
    color: colors.borderGrey,
  },

  unitText:{
    fontFamily: fonts.bold,
    fontSize: scale(15),
    color: colors.textGrey,
  }
});