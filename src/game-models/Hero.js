// Наш герой.

class Hero {
  constructor(boomerang) {
    this.skin = '🤠'; // можете использовать любые emoji '💃'
    this.position = 0;
    this.boomerang = boomerang;
    this.floor = 1;
    this.jumpFramesTimer = 0;
  }

  moveLeft() {
    // Идём влево.
    this.position -= 1;
  }

  moveRight() {
    // Идём вправо.
    this.position += 1;
  }

  jump() {
    // Прыжок
    this.floor = 0;
    this.jumpFramesTimer = 5; // frames
  }

  attack() {
    if (this.boomerang.position !== null) {
      return;
    }

    this.boomerang.fly(this.position);
  }

  die() {
    this.skin = '💀';
    console.log('YOU ARE DEAD!💀');
    process.exit();
  }
}

module.exports = Hero;
