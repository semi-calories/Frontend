//
// textInput 컴포넌트 모아놓은 파일
//

import React, { useState } from "react";

import { TextInput, StyleSheet, Text, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';

import { ValidFormat } from "~/constants/validFormat";

import { colors, fonts } from "~/constants/globalStyles"
import { scale, verticalScale } from "~/constants/globalSizes";

export function BasicTextInput(props) {
  const { value, placeholder, width, inputStyle, password, unit, dark, valid, ...restProps } = props

  const [secureMode, setSecureMode] = useState(true)

  return (
    <View>
      <View style={[styles.input, dark ? styles.dark : styles.light, { width: width, flexDirection: 'row' }, value && !valid && { borderColor: 'red' }]}>
        <TextInput
          style={[{ flex: 1 }, inputStyle]}
          value={value}
          placeholder={placeholder}
          secureTextEntry={password && secureMode ? true : false}
          editable={dark ? false : true}
          {...restProps}
        />
        {password &&
          (secureMode
            ? <Ionicons name="eye-off" size={22} color={colors.borderGrey} onPress={() => setSecureMode(!secureMode)} />
            : <Ionicons name="eye" size={22} color={colors.borderGrey} onPress={() => setSecureMode(!secureMode)} />
          )
        }
         {unit && <Text style={styles.unitText}>{unit}</Text>}
      </View>
      {value && !valid && <Text style={styles.validateText}>{ValidFormat(placeholder)}</Text>}
    </View>
  );
}

export function LabelTextInput(props) {
  const {value, label, width, inputViewStyle, inputStyle, unit, dark, valid,  ...restProps } = props

  return (
    <View style={inputViewStyle}>
      <Text style={styles.labelText}>{label}</Text>
      <View style={[styles.input, dark ? styles.dark : styles.light, { width: width, flexDirection: 'row' }, value && !valid && { borderColor: 'red' }]}>
        <TextInput
          style={[{ flex: 1 }, inputStyle]}
          value={value}
          editable={dark ? false : true}
          {...restProps}
        />
        {unit && <Text style={styles.unitText}>{unit}</Text>}
      </View>
      {value && !valid && <Text style={styles.validateText}>{ValidFormat(label)}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: verticalScale(50),
    padding: scale(12),

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

  validateText: {
    fontFamily: fonts.regular,
    fontSize: scale(10),
    color: 'red',

    paddingLeft:scale(3),
  }
});