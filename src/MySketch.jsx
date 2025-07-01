// src/MySketch.jsx
import React from "react";
import Sketch from "react-p5";

let volume = 0;
let transcript = "";
let slidingTextX = 600; // 初期位置（画面右端）

export const setVolume = (v) => {
  volume = v;
};

export const setTranscript = (t) => {
  transcript = t;
  slidingTextX = 600; // 新しい発話が来たら右端から再スタート
};

const drawNoise = (p5) => {
  for (let i = 0; i < 100; i++) {
    const x = p5.random(p5.width);
    const y = p5.random(p5.height);
    p5.stroke(200, 200, 255, 30); // 薄めの点
    p5.point(x, y);
  }
};

let angle = 0;

const drawGeometry = (p5) => {
  p5.push();
  p5.translate(p5.width / 2, p5.height / 2);
  p5.rotate(angle);
  p5.noFill();
  p5.stroke(255, 150);
  p5.ellipse(0, 0, 100 + Math.sin(angle) * 50);
  p5.pop();
  angle += 0.01;
};


export default function MySketch() {
  const setup = (p5, canvasParentRef) => {
    // canvasが重複して描画される問題への対応。
    // 古いキャンバスを削除（StrictModeで再描画されるときに）
    if (canvasParentRef.firstChild) {
      canvasParentRef.removeChild(canvasParentRef.firstChild);
    }

    // ウィンドウいっぱいに表示したい
    p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
    p5.textSize(24);
  };

  const draw = (p5) => {
    // p5.background(255);
    p5.background(0); // 黒背景に変更して映えるように

    drawNoise(p5);
    drawGeometry(p5);

    // p5.fill(0);
    // p5.text(`音量: ${volume.toFixed(2)}`, 10, 30);
    // p5.text(`発話: ${transcript}`, 10, 70);
    // p5.fill(100, 100, 255);
    // p5.rect(10, 100, volume * 300, 30);
    p5.fill(255);
    p5.text(`音量: ${volume.toFixed(2)}`, 10, 30);

    p5.fill(0, 255, 255);
    p5.text(transcript, slidingTextX, 350);
    slidingTextX -= 2;

    // スライドアニメーション（左へ流す）
    p5.fill(50, 50, 200);
    p5.text(transcript, slidingTextX, 200);
    slidingTextX -= 2; // 左に移動

    // 画面外に出たらリセット（オプション）
    if (slidingTextX < -p5.textWidth(transcript)) {
      slidingTextX = 600;
    }
  };

  return <Sketch setup={setup} draw={draw} />;
}
