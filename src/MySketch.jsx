import React from "react";
import Sketch from "react-p5";

let volume = 0;
let transcript = "";
let bgColor = [0, 0, 0]; // 背景色（初期：黒）
let textParticles = [];
let ambientParticles = [];

export const setVolume = (v) => {
  volume = v;
};

class TextParticle {
  constructor(p5, char) {
    this.char = char;
    this.pos = p5.createVector(p5.width / 2, p5.height / 2);
    const angle = p5.random(p5.TWO_PI);
    const speed = p5.random(2, 6);
    this.vel = p5.createVector(Math.cos(angle), Math.sin(angle)).mult(speed);
    this.size = p5.random(20, 40);
    this.opacity = 255;
    this.rotation = p5.random(p5.TWO_PI);
    this.rotSpeed = p5.random(-0.1, 0.1);
    this.color = [p5.random(100, 255), p5.random(100, 255), p5.random(100, 255)];
  }

  update() {
    this.pos.add(this.vel);
    this.rotation += this.rotSpeed;
    this.opacity -= 3;
  }

  isDead() {
    return this.opacity <= 0;
  }

  draw(p5) {
    p5.push();
    p5.translate(this.pos.x, this.pos.y);
    p5.rotate(this.rotation);
    p5.textSize(this.size);
    p5.fill(...this.color, this.opacity);
    p5.noStroke();
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.text(this.char, 0, 0);
    p5.pop();
  }
}

class AmbientParticle {
  constructor(p5) {
    this.p5 = p5;
    this.pos = p5.createVector(p5.random(p5.width), p5.random(p5.height));
    this.vel = p5.createVector(p5.random(-0.2, 0.2), p5.random(-0.2, 0.2));
    this.size = p5.random(1, 4);
    this.opacity = p5.random(50, 120);
  }

  update() {
    this.pos.add(this.vel);

    // 画面外に出たらループ
    if (this.pos.x < 0) this.pos.x = this.p5.width;
    if (this.pos.x > this.p5.width) this.pos.x = 0;
    if (this.pos.y < 0) this.pos.y = this.p5.height;
    if (this.pos.y > this.p5.height) this.pos.y = 0;
  }

  draw() {
    this.p5.noStroke();
    this.p5.fill(255, this.opacity);
    this.p5.ellipse(this.pos.x, this.pos.y, this.size);
  }
}

export const setTranscript = (t) => {
  if (t !== transcript) {
    transcript = t;
    slidingTextX = 600;

    // 1文字ずつ TextParticle を生成
    for (const char of t) {
      textParticles.push(new TextParticle(window.p5Instance, char));
    }

    // transcriptHistory は前の演出用（残すなら維持）
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

    // AmbientParticle の初期化
    for (let i = 0; i < 100; i++) {
      ambientParticles.push(new AmbientParticle(p5));
    }

    window.p5Instance = p5; // 👈 グローバル参照用
  };

  const drawNoise = (p5) => {
    for (let i = 0; i < 100; i++) {
      p5.stroke(255, 255, 255, 20);
      p5.point(p5.random(p5.width), p5.random(p5.height));
    }
  };

  const drawAmbientParticles = (p5) => {
    for (const particle of ambientParticles) {
      particle.update();
      particle.draw();
    }
  };

  // 円形の幾何学模様を描画（パーリンノイズを使用）
  // 音量に応じて変化する
  const drawGeometry = (p5) => {
    p5.push();
    p5.translate(p5.width / 2, p5.height / 2);
    p5.noFill();
    p5.stroke(255, 100 + volume * 100, 200, 150);
    p5.beginShape();
  
    const baseRadius = 80 + volume * 50;
    const segments = 100;
    for (let i = 0; i <= segments; i++) {
      const angle = p5.map(i, 0, segments, 0, p5.TWO_PI);
      const offset = p5.noise(i * 0.1, p5.frameCount * 0.01); // パーリンノイズでゆらぎ
      const radius = baseRadius + offset * 50; // 半径にノイズを足す
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      p5.vertex(x, y);
    }
  
    p5.endShape(p5.CLOSE);
    p5.pop();
  };

  const drawTextParticles = (p5) => {
    for (const p of textParticles) {
      p.update();
      p.draw(p5);
    }
    textParticles = textParticles.filter((p) => !p.isDead());
  };
  
  const draw = (p5) => {
    p5.background(...bgColor);

    drawAmbientParticles(p5); // 🌌 背景の浮遊粒子
    drawNoise(p5);
    drawGeometry(p5);
    drawTextParticles(p5); // 👈 NEW: タイポ爆発演出

    // 音量バー
    // p5.fill(255);
    // p5.noStroke();
    // p5.rect(10, 10, volume * 300, 20);
    // p5.fill(200);
    // p5.text(`音量: ${volume.toFixed(2)}`, 320, 28);
  };

  return <Sketch setup={setup} draw={draw} />;
}
