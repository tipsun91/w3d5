// Враг.

class Obstacle {
  constructor(position) {
    this.generateSkin();
    this.position = position;
  }

  generateSkin() {
    this.skin = '🌵';
  }

  moveLeft() {
    // Идём влево.
    this.position -= 1;
  }
}

module.exports = Obstacle;
