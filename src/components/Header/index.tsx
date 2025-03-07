import React, { FC, memo } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { WIDTH } from "../../core/constants";
import HeaderStyles from "./Header.styles";
import { StoryHeaderProps } from "../../core/dto/componentsDTO";
import Close from "../Icon/close";

const StoryHeader: FC<StoryHeaderProps> = ({
  image,
  name,
  onClose,
  avatarSize,
  textStyle,
  buttonHandled,
  closeColor,
}) => {
  const styles = {
    width: avatarSize,
    height: avatarSize,
    borderRadius: avatarSize,
  };
  const width = WIDTH - HeaderStyles.container.left * 2;

  return (
    <View style={[HeaderStyles.container, { width }]}>
      <View style={HeaderStyles.left}>
        {image && (
          <View
            style={[HeaderStyles.avatar, { borderRadius: styles.borderRadius }]}
          >
            <Image source={{ uri: image }} style={styles} />
          </View>
        )}
        {Boolean(name) && <Text style={textStyle}>{name}</Text>}
      </View>
      <TouchableOpacity
        onPress={onClose}
        hitSlop={16}
        testID="storyCloseButton"
        onPressIn={() => {
          buttonHandled.value = true;
        }}
      >
        <Close color={closeColor} />
      </TouchableOpacity>
    </View>
  );
};

export default memo(StoryHeader);
