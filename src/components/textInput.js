//
// textInput 컴포넌트 모아놓은 파일
//

import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { TextInput, StyleSheet, Text, View } from 'react-native';

import { rWidth, rHeight, rFont } from '~/constants/globalSizes';
import { colors, fonts } from '~/constants/globalStyles';
import { ValidFormat } from '~/constants/validFormat';

export function BasicTextInput(props) {
  const {
    value,
    width,
    inputStyle,
    password,
    unit,
    dark,
    validType,
    valid,
    ...restProps
  } = props;

  const [secureMode, setSecureMode] = useState(true);

  return (
    <View>
      <View
        style={[
          styles.input,
          dark ? styles.dark : styles.light,
          { width, flexDirection: 'row' },
          value && !valid && { borderColor: 'red' },
        ]}
      >
        <TextInput
          style={[{ flex: 1 }, inputStyle, styles.textStyle]}
          value={value}
          secureTextEntry={!!(password && secureMode)}
          editable={!dark}
          {...restProps}
        />
        {password && (
          <Ionicons
            name={secureMode ? 'eye-off' : 'eye'}
            size={rHeight(22)}
            color={colors.borderGrey}
            onPress={() => setSecureMode(!secureMode)}
          />
        )}
        {unit && <Text style={styles.unitText}>{unit}</Text>}
      </View>
      {value && !valid && (
        <Text style={styles.validateText}>{ValidFormat(validType)}</Text>
      )}
    </View>
  );
}

export function LabelTextInput(props) {
  const {
    value,
    label,
    width,
    inputViewStyle,
    inputStyle,
    unit,
    dark,
    valid,
    ...restProps
  } = props;

  return (
    <View style={inputViewStyle}>
      <Text style={styles.labelText}>{label}</Text>
      <View
        style={[
          styles.input,
          dark ? styles.dark : styles.light,
          { width, flexDirection: 'row' },
          value && !valid && { borderColor: 'red' },
        ]}
      >
        <TextInput
          style={[{ flex: 1 }, inputStyle, styles.textStyle]}
          value={value}
          editable={!dark}
          {...restProps}
        />
        {unit && <Text style={styles.unitText}>{unit}</Text>}
      </View>
      {value && !valid && (
        <Text style={styles.validateText}>{ValidFormat(label)}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: rHeight(50),
    alignItems: 'center',
    paddingHorizontal: rHeight(15),

    borderRadius: rHeight(10),
    marginVertical: rHeight(6),
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
    fontSize: rFont(20),
    color: colors.borderGrey,

    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  unitText: {
    fontFamily: fonts.bold,
    fontSize: rFont(15),
    color: colors.textGrey,

    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  validateText: {
    fontFamily: fonts.regular,
    fontSize: rFont(10),
    color: 'red',

    paddingLeft: rWidth(3),

    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  textStyle: {
    fontFamily: fonts.regular,
    fontSize: rFont(14),
    color: colors.black,

    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
