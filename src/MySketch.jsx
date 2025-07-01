import React from "react";
import Sketch from "react-p5";

let volume = 0;
let transcript = "";
let slidingTextX = 600;
let angle = 0;
let bgColor = [0, 0, 0]; // 背景色（初期：黒）
let customFont;

export const setVolume = (v) => {
  volume = v;
};

export const setTranscript = (t) => {
  if (t !== transcript) {
    transcript = t;
    slidingTextX = 600;

    // 💡 キーワード反応
    if (t.includes("赤")) {
      bgColor = [200, 0, 0];
    } else if (t.includes("青")) {
      bgColor = [0, 0, 200];
    } else if (t.includes("緑")) {
      bgColor = [0, 100, 0];
    } else {
      bgColor = [0, 0, 0]; // デフォルトに戻す
    }
  }
};

export default function MySketch() {
  const setup = (p5, canvasParentRef) => {
    // canvasが重複して描画される問題への対応。
    // 古いキャンバスを削除（StrictModeで再描画されるときに）
    if (canvasParentRef.firstChild) {
      canvasParentRef.removeChild(canvasParentRef.firstChild);
    }

    p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
    p5.textFont("BIZ UDPGothic");
    p5.textSize(24);
  };

  const drawNoise = (p5) => {
    for (let i = 0; i < 100; i++) {
      p5.stroke(255, 255, 255, 20);
      p5.point(p5.random(p5.width), p5.random(p5.height));
    }
  };

  const drawGeometry = (p5) => {
    p5.push();
    p5.translate(p5.width / 2, p5.height / 2);
    p5.rotate(angle);
    p5.noFill();
    const size = 100 + Math.sin(angle * 2) * 30 + volume * 50;
    p5.stroke(255, 255 - volume * 100, 200, 150);
    p5.ellipse(0, 0, size, size);
    p5.pop();
    angle += 0.01 + volume * 0.05;
  };

  const draw = (p5) => {
    p5.background(...bgColor);

    drawNoise(p5);
    drawGeometry(p5);

    // 音量バー
    p5.fill(255);
    p5.noStroke();
    p5.rect(10, 10, volume * 300, 20);
    p5.fill(200);
    p5.text(`音量: ${volume.toFixed(2)}`, 320, 28);

    // スライディングテキスト
    p5.fill(255, 255, 0);
    p5.text(transcript, slidingTextX, 360);
    slidingTextX -= 2 + volume * 3;
    if (slidingTextX < -p5.textWidth(transcript)) {
      slidingTextX = 600;
    }
  };

  return <Sketch setup={setup} draw={draw} />;
}
