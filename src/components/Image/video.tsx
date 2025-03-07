import React, { FC, memo, useRef, useState } from "react";
import { LayoutChangeEvent, Platform } from "react-native";
import { runOnJS, useAnimatedReaction } from "react-native-reanimated";
import { StoryVideoProps } from "../../core/dto/componentsDTO";
import { WIDTH, HEIGHT } from "../../core/constants";

const StoryVideo: FC<StoryVideoProps> = ({
  uri,
  paused,
  isActive,
  onLoad,
  onLayout,
  ...props
}) => {
  try {
    // eslint-disable-next-line global-require
    const Video = require("react-native-video").default;

    const ref = useRef<any>(null);

    const [pausedValue, setPausedValue] = useState(!paused.value);

    const start = () => ref.current?.seek(0);

    useAnimatedReaction(
      () => paused.value,
      (res, prev) => res !== prev && runOnJS(setPausedValue)(!res),
      [paused.value]
    );

    useAnimatedReaction(
      () => isActive.value,
      (res) => res && runOnJS(start)(),
      [isActive.value]
    );

    const onLoadFuntion = (status: any) => {
      if (status.isLoaded) {
        onLoad(status.durationMillis ?? 0);
      }
    };

    return (
      <Video
        ref={ref}
        style={{
          width: WIDTH,
          aspectRatio: 0.5626,
          height: Platform.OS === "ios" ? HEIGHT - 90 : HEIGHT,
        }}
        resizeMode='cover'
        {...props}
        source={{ uri }}
        paused={!pausedValue}
        controls={false}
        repeat={false}
        onLoad={({ duration }: { duration: number }) => onLoad(duration * 1000)}
        onLayout={(e: LayoutChangeEvent) =>
          onLayout(e.nativeEvent.layout.height)
        }
      />
    );
  } catch (error) {
    return null;
  }
};

export default memo(StoryVideo);
