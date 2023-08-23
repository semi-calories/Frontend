//
// textInput 컴포넌트 모아놓은 파일
//

import React from "react";

import { TextInput, StyleSheet, Text, View } from "react-native";

import { colors, fonts } from "~/constants/globalStyles"
import { scale, verticalScale } from "~/constants/globalSizes";

export function BasicTextInput(props) {
  const { type, text, onChangeText, width, ...restProps } = props

  return (
    <TextInput
      style={[styles.input, type == 'light' ? styles.light : styles.dark, { width: width }]}
      onChangeText={onChangeText}
      value={text}
      {...restProps}
    />
  );
}

export function LabelTextInput(props) {
  const { type, label, required, text, onChangeText, unit, width, inputViewStyle, inputStyle, ...restProps } = props
  return (
    <View style={inputViewStyle}>
      {label &&
        <View style={styles.flexRow}>
          <Text style={styles.labelText}>{label}</Text>
          {required && <Text style={styles.required}> *</Text>}
        </View>
      }
      <View style={[styles.input, type == 'light' ? styles.light : styles.dark, { width: width, flexDirection: 'row' }]}>
        <TextInput
          style={[{ flex: 1 }, inputStyle]}
          value={text}
          onChangeText={onChangeText}
          editable={type == 'dark' ? false : true}
          {...restProps}
        />
        {unit && <Text style={styles.unitText}>{unit}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: verticalScale(50),
    padding: scale(14),

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

  unitText: {
    fontFamily: fonts.bold,
    fontSize: scale(15),
    color: colors.textGrey,
  },

  flexRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  required: {
    color: 'red',
    fontFamily: fonts.medium,
    fontSize: scale(23),
  }
});