// src/MySketch.jsx
import React from "react";
import Sketch from "react-p5";

let volume = 0;
let transcript = "";

export const setVolume = (v) => {
  volume = v;
};

export const setTranscript = (t) => {
  transcript = t;
};

export default function MySketch() {
  const setup = (p5, canvasParentRef) => {
    // canvasが重複して描画される問題への対応。
    // 古いキャンバスを削除（StrictModeで再描画されるときに）
    if (canvasParentRef.firstChild) {
      canvasParentRef.removeChild(canvasParentRef.firstChild);
    }

    p5.createCanvas(600, 400).parent(canvasParentRef);
    p5.textSize(24);
  };

  const draw = (p5) => {
    p5.background(255);
    p5.fill(0);
    p5.text(`音量: ${volume.toFixed(2)}`, 10, 30);
    p5.text(`発話: ${transcript}`, 10, 70);
    p5.fill(100, 100, 255);
    p5.rect(10, 100, volume * 300, 30);
  };

  return <Sketch setup={setup} draw={draw} />;
}
