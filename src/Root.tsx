import React from "react";
import { Composition } from "remotion";
import { AIVideo, TOTAL_DURATION } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="AIVideo"
      component={AIVideo}
      durationInFrames={TOTAL_DURATION}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
