import React, { FC, memo } from "react";
import { View, Image, Text, TouchableOpacity, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";
import { StoryAvatarProps } from "../../core/dto/componentsDTO";
import AvatarStyles from "./Avatar.styles";
import Loader from "../Loader";
import { AVATAR_OFFSET, AVATAR_SIZE } from "../../core/constants";

const AnimatedView = Animated.createAnimatedComponent(View);

const StoryAvatar: FC<StoryAvatarProps> = ({
  id,
  image,
  name,
  position,
  stories,
  loadingStory,
  seenStories,
  onPress,
  colors,
  seenColors,
  size,
  showName,
  nameTextStyle,
  AvatarStyle,
}) => {
  const loaded = useSharedValue(false);
  const isLoading = useDerivedValue(
    () => loadingStory.value === id || !loaded.value
  );
  const loaderColor = useDerivedValue(() =>
    seenStories.value[id] === stories[stories.length - 1]?.id
      ? seenColors
      : colors
  );

  const onLoad = () => {
    loaded.value = true;
  };

  const imageAnimatedStyles = useAnimatedStyle(() => ({
    opacity: withTiming(isLoading.value ? 0.5 : 1),
  }));

  let AvatarBorderRadius = StyleSheet.flatten(AvatarStyle);

  return (
    <View style={AvatarStyles.name}>
      <View style={AvatarStyles.container}>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={onPress}
          testID={`${id}StoryAvatar${stories.length}Story`}>
          {/* <Loader
            loading={isLoading}
            color={loaderColor}
            size={size + AVATAR_OFFSET * 2}
          /> */}

          <AnimatedView
            style={[
              AvatarStyles.avatar,
              imageAnimatedStyles,
              {
                width: AVATAR_SIZE,
                height: AVATAR_SIZE,
                borderRadius: AVATAR_SIZE / 2,
                backgroundColor: "#000000",
              },
              AvatarStyle,
            ]}>
            <Image
              source={{ uri: image ?? undefined }}
              style={{
                height: "100%",
                width: "100%",
                borderRadius: AvatarBorderRadius?.borderRadius,
              }}
              testID='storyAvatarImage'
              onLoad={onLoad}
            />

            <View
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                flex: 1,
                flexDirection: "column",
                backgroundColor: "#00000055",
                padding: 10,
                paddingTop: 6,
                borderBottomLeftRadius: AvatarBorderRadius?.borderRadius,
                borderBottomRightRadius: AvatarBorderRadius?.borderRadius,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: "#ffffff",
                }}>
                {name}
              </Text>

              {typeof position === "string" && (
                <Text
                  style={{
                    fontSize: 11,
                    color: "#ffffff",
                  }}>
                  {position}
                </Text>
              )}
            </View>
          </AnimatedView>
        </TouchableOpacity>
      </View>
      {Boolean(showName) && <Text style={nameTextStyle}>{name}</Text>}
    </View>
  );
};

export default memo(StoryAvatar);
