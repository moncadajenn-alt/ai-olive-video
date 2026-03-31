/**
 * Main composition – AI in Everyday Life: Olive Oil Example
 * 9:16 | 1080×1920 | 30fps | ~42 seconds
 *
 * Scene structure:
 *  Hook    – 5s  – wide shot, camera pan, dog enters, notices bottles
 *  Scene1  – 4s  – medium shot 4 bottles, dog confused, shoulders drop
 *  Scene2  – 4s  – close-up, label spin/blur, dog scratches head
 *  Scene3  – 5s  – idea moment, light-bulb, phone tap close-up
 *  Scene4  – 8s  – step-by-step: arrange, frame, tap +, shutter
 *  Scene5  – 7s  – AI response: typing → thinking dots → ranked results → reaction
 *  Scene6  – 5s  – confident pick, sparkle on bottle
 *  Ending  – 5s  – dog walks away with bottle, "just try it"
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";

import { Hook }   from "./scenes/Hook";
import { Scene1 } from "./scenes/Scene1";
import { Scene2 } from "./scenes/Scene2";
import { Scene3, SCENE3_DURATION } from "./scenes/Scene3";
import { Scene4, SCENE4_DURATION } from "./scenes/Scene4";
import { Scene5, SCENE5_DURATION } from "./scenes/Scene5";
import { Scene6, SCENE6_DURATION } from "./scenes/Scene6";
import { Ending, ENDING_DURATION } from "./scenes/Ending";

const FADE = 10;
const SLIDE = 14;

const HOOK_DUR  = 150; // 5s
const S1_DUR    = 120; // 4s
const S2_DUR    = 120; // 4s
// SCENE3_DURATION = 150 (5s)
// SCENE4_DURATION = 240 (8s)
// SCENE5_DURATION = 210 (7s)
// SCENE6_DURATION = 150 (5s)
// ENDING_DURATION = 150 (5s)

export const TOTAL_DURATION =
  HOOK_DUR + S1_DUR + S2_DUR + SCENE3_DURATION + SCENE4_DURATION + SCENE5_DURATION + SCENE6_DURATION + ENDING_DURATION
  - (FADE * 4 + SLIDE * 3); // 7 transitions

export const AIVideo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#FFF9F0" }}>
    <TransitionSeries>

      {/* 0 – Hook (5s) – camera pan, dog enters */}
      <TransitionSeries.Sequence durationInFrames={HOOK_DUR}>
        <Hook />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={linearTiming({ durationInFrames: SLIDE })}
      />

      {/* 1 – Medium shot 4 bottles, confused dog */}
      <TransitionSeries.Sequence durationInFrames={S1_DUR}>
        <Scene1 />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={springTiming({ config: { damping: 200 }, durationInFrames: FADE })}
      />

      {/* 2 – Close-up confusion, label spin */}
      <TransitionSeries.Sequence durationInFrames={S2_DUR}>
        <Scene2 />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-bottom" })}
        timing={linearTiming({ durationInFrames: SLIDE })}
      />

      {/* 3 – Idea moment + phone tap */}
      <TransitionSeries.Sequence durationInFrames={SCENE3_DURATION}>
        <Scene3 />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: FADE })}
      />

      {/* 4 – Step-by-step setup */}
      <TransitionSeries.Sequence durationInFrames={SCENE4_DURATION}>
        <Scene4 />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={linearTiming({ durationInFrames: SLIDE })}
      />

      {/* 5 – AI response */}
      <TransitionSeries.Sequence durationInFrames={SCENE5_DURATION}>
        <Scene5 />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={springTiming({ config: { damping: 200 }, durationInFrames: FADE })}
      />

      {/* 6 – Confident choice */}
      <TransitionSeries.Sequence durationInFrames={SCENE6_DURATION}>
        <Scene6 />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={linearTiming({ durationInFrames: SLIDE })}
      />

      {/* 7 – Walk away + "just try it" */}
      <TransitionSeries.Sequence durationInFrames={ENDING_DURATION}>
        <Ending />
      </TransitionSeries.Sequence>

    </TransitionSeries>
  </AbsoluteFill>
);
