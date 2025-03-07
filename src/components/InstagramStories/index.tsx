import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
  useRef,
  memo,
} from "react";
import { useSharedValue } from "react-native-reanimated";
import { Image, ScrollView } from "react-native";
import StoryAvatar from "../Avatar";
import {
  clearProgressStorage,
  getProgressStorage,
  setProgressStorage,
} from "../../core/helpers/storage";
import {
  InstagramStoriesProps,
  InstagramStoriesPublicMethods,
} from "../../core/dto/instagramStoriesDTO";
import { ProgressStorageProps } from "../../core/dto/helpersDTO";
import {
  ANIMATION_CONFIG,
  PROGRESS_DURATION,
  DEFAULT_COLORS,
  SEEN_LOADER_COLORS,
  STORY_AVATAR_SIZE,
  AVATAR_SIZE,
  BACKGROUND_COLOR,
  CLOSE_COLOR,
} from "../../core/constants";
import StoryModal from "../Modal";
import { StoryModalPublicMethods } from "../../core/dto/componentsDTO";

const InstagramStories = forwardRef<
  InstagramStoriesPublicMethods,
  InstagramStoriesProps
>(
  (
    {
      stories,
      saveProgress = false,
      avatarBorderColors = DEFAULT_COLORS,
      avatarSeenBorderColors = SEEN_LOADER_COLORS,
      avatarSize = AVATAR_SIZE,
      storyAvatarSize = STORY_AVATAR_SIZE,
      listContainerStyle,
      listContainerProps,
      animationConfig = ANIMATION_CONFIG,
      progressDuration = PROGRESS_DURATION,
      backgroundColor = BACKGROUND_COLOR,
      showName = false,
      nameTextStyle,
      videoAnimationMaxDuration,
      videoProps,
      closeIconColor = CLOSE_COLOR,
      avatarStyle,
      ...props
    },
    ref
  ) => {
    const [data, setData] = useState(stories);

    const seenStories = useSharedValue<ProgressStorageProps>({});
    const loadedStories = useSharedValue(false);
    const loadingStory = useSharedValue<string | undefined>(undefined);

    const modalRef = useRef<StoryModalPublicMethods>(null);

    const onPress = (id: string) => {
      "wokrlet";

      loadingStory.value = id;

      if (loadedStories.value) {
        modalRef.current?.show(id);
      }
    };

    const onLoad = () => {
      "wokrlet";

      loadingStory.value = undefined;
    };

    const onStoriesChange = async () => {
      "wokrlet";

      seenStories.value = await (saveProgress ? getProgressStorage() : {});

      const promises = stories.map((story) => {
        const seenStoryIndex = story.stories.findIndex(
          (item) => item.id === seenStories.value[story.id]
        );
        const seenStory = story.stories[seenStoryIndex + 1] || story.stories[0];

      if ( !seenStory ) {

        return true;

      }

        return seenStory.mediaType !== "video"
          ? Image.prefetch(seenStory.sourceUrl)
          : true;
      });

      await Promise.all(promises);

      loadedStories.value = true;

      if (loadingStory.value) {
        onPress(loadingStory.value);
      }
    };

    const onSeenStoriesChange = async (user: string, value: string) => {
      if (!saveProgress) {
        return;
      }

      if (seenStories.value[user]) {
        const userData = data.find((story) => story.id === user);
        const oldIndex = userData?.stories.findIndex(
          (story) => story.id === seenStories.value[user]
        );
        const newIndex = userData?.stories.findIndex(
          (story) => story.id === value
        );

        if (oldIndex! > newIndex!) {
          return;
        }
      }

      seenStories.value = await setProgressStorage(user, value);
    };

    useImperativeHandle(
      ref,
      () => ({
        spliceStories: (newStories, index) => {
          if (index === undefined) {
            setData([...data, ...newStories]);
          } else {
            const newData = [...data];
            newData.splice(index, 0, ...newStories);
            setData(newData);
          }
        },
        spliceUserStories: (newStories, user, index) => {
          const userData = data.find((story) => story.id === user);

          if (!userData) {
            return;
          }

          const newData =
            index === undefined
              ? [...userData.stories, ...newStories]
              : [...userData.stories];

          if (index !== undefined) {
            newData.splice(index, 0, ...newStories);
          }

          setData(
            data.map((value) =>
              value.id === user
                ? {
                    ...value,
                    stories: newData,
                  }
                : value
            )
          );
        },
        setStories: (newStories) => {
          setData(newStories);
        },
        clearProgressStorage,
        hide: () => modalRef.current?.hide(),
        show: (id) => {
          if (id) {
            onPress(id);
          } else if (data[0]?.id) {
            onPress(data[0]?.id);
          }
        },
      }),
      [data]
    );

    useEffect(() => {
      onStoriesChange();
    }, [data]);

    useEffect(() => {
      setData(stories);
    }, [stories]);

    return (
      <>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          {...listContainerProps}
          contentContainerStyle={listContainerStyle}
          testID="storiesList"
        >
          {data.map((story) => (
            <StoryAvatar
              {...story}
              loadingStory={loadingStory}
              seenStories={seenStories}
              onPress={() => onPress(story.id)}
              colors={avatarBorderColors}
              seenColors={avatarSeenBorderColors}
              size={avatarSize}
              showName={showName}
              nameTextStyle={nameTextStyle}
              key={`avatar${story.id}`}
              AvatarStyle={avatarStyle}
            />
          ))}
        </ScrollView>
        <StoryModal
          ref={modalRef}
          stories={data}
          seenStories={seenStories}
          duration={progressDuration}
          storyAvatarSize={storyAvatarSize}
          onLoad={onLoad}
          animationConfig={animationConfig}
          onSeenStoriesChange={onSeenStoriesChange}
          backgroundColor={backgroundColor}
          videoDuration={videoAnimationMaxDuration}
          videoProps={videoProps}
          closeIconColor={closeIconColor}
          {...props}
        />
      </>
    );
  }
);

export default memo(InstagramStories);
