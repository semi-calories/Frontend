import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

import { AntDesign } from '@expo/vector-icons';

import { rWidth, rHeight, rFont } from '~/styles/globalSizes';
import { colors, fonts } from '~/styles/globalStyles';

export const BasicChip = ({ chipStyle, textStyle, text, onPress }) => {
  return (
    <Pressable style={[styles.container, chipStyle]} onPress={onPress}>
      <Text style={[styles.chipText, textStyle]}>{text}</Text>
    </Pressable>
  );
};

export const CloseChip = ({ chipStyle, textStyle, text, onClose }) => {
  return (
    <View style={[styles.closeContainer, chipStyle]}>
      <Text style={[styles.chipText, textStyle]}>{text}</Text>
      <Pressable
        onPress={onClose}
        style={{ alignItems: 'center', marginLeft: rHeight(5) }}
      >
        <AntDesign name="close" size={rHeight(18)} color="black" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',

    borderWidth: rHeight(1),
    borderColor: colors.borderGrey,
    borderRadius: rHeight(10),

    paddingHorizontal: rWidth(10),
    paddingVertical: 10,
    margin: rHeight(3),
  },

  closeContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    borderWidth: rHeight(1.5),
    borderColor: colors.borderGrey,
    borderRadius: rHeight(10),

    paddingHorizontal: rWidth(10),
    paddingVertical: rHeight(10),
    margin: rHeight(3),
  },

  chipText: {
    fontFamily: fonts.regular,
    fontSize: rFont(13),
    color: colors.black,

    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
