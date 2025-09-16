"use client";

import React, { createContext, useContext, useState } from "react";

export interface VideoLink {
  label: string;
  entryId: string;
  flavoredUrl: string;
  segLinks: string[];
  mp4Url: string;
}

export interface VideoProp {
  currCourseNumberString: string;
  currVideoLinks: VideoLink[];
  currCourseNumberLoaded: boolean,
  updateFunction: (values: VideoLink[] | string | boolean) => void;
}


export const VideoContextDefaultProp: VideoProp = {
  currCourseNumberString: "",
  currVideoLinks: [],
  currCourseNumberLoaded: false,
  updateFunction: () => { },
};

export const VideoContext = createContext<VideoProp>(
  VideoContextDefaultProp
);

export function useVideo() {
  return useContext(VideoContext);
}

type Props = {
  children: React.ReactNode;
};

export function VideoProvider({ children }: Props) {
  const [courseNumberString, setCourseNumberString] = useState<string>("");
  const [courseNumberLoaded, setCourseNumberLoaded] = useState<boolean>(false);
  const [videoLinks, setVideoLinks] = useState<VideoLink[]>([]);

  const update = (updatedVideoValues: VideoLink[] | string | boolean) => {
    if (typeof updatedVideoValues == "string") {
      setCourseNumberString(updatedVideoValues)
    } else if (typeof updatedVideoValues == "boolean") {
      setCourseNumberLoaded(updatedVideoValues)
    } else {
      setVideoLinks(updatedVideoValues)
    }
  };

  const value: VideoProp = {
    currCourseNumberString: courseNumberString,
    currVideoLinks: videoLinks,
    currCourseNumberLoaded: courseNumberLoaded,
    updateFunction: update,
  };

  return (
    <VideoContext.Provider value={value}>{children}</VideoContext.Provider>
  );
}
