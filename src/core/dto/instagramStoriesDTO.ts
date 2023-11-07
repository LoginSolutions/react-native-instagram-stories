import { ReactNode } from "react";
import { ScrollViewProps, TextStyle, ViewStyle } from "react-native";
import { WithTimingConfig } from "react-native-reanimated";

export interface StoryItemProps {
  id: string;
  sourceUrl: string;
  mediaType?: "image" | "video";
  renderContent?: () => ReactNode;
}

export interface InstagramStoryProps {
  id: string;
  image?: string | null;
  name?: string;
  position?: string;
  stories: StoryItemProps[];
}

export interface InstagramStoriesProps {
  stories: InstagramStoryProps[];
  saveProgress?: boolean;
  avatarBorderColors?: string[];
  avatarSeenBorderColors?: string[];
  avatarSize?: number;
  storyAvatarSize?: number;
  avatarStyle?: ViewStyle | ViewStyle[];
  listContainerStyle?: ScrollViewProps["contentContainerStyle"];
  listContainerProps?: ScrollViewProps;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  animationConfig?: WithTimingConfig;
  progressDuration?: number;
  videoAnimationMaxDuration?: number;
  backgroundColor?: string;
  showName?: boolean;
  nameTextStyle?: TextStyle;
  videoProps?: any;
  videoPlayer?: "expo" | "react-native-video";
  closeIconColor?: string;
  onShow?: (id: string) => void;
  onHide?: (id: string) => void;
}

export type InstagramStoriesPublicMethods = {
  spliceStories: (stories: InstagramStoryProps[], index?: number) => void;
  spliceUserStories: (
    stories: StoryItemProps[],
    user: string,
    index?: number
  ) => void;
  setStories: (stories: InstagramStoryProps[]) => void;
  clearProgressStorage: () => void;
  hide: () => void;
  show: (id?: string) => void;
};
