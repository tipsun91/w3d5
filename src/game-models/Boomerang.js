// Бумеранг является оружием.
// В дальнейшем можно добавить другое оружие.
// Тогда можно будет создать класс Weapon и воспользоваться наследованием!

class Boomerang {
  constructor() {
    this.skin = '🔸';
    this.position = null;
    this.startPosition = null;
  }

  fly(position) {
    this.startPosition = position;
    this.position = position;
  }

  moveRight() {
    // Идём вправо.
    this.position += 1;
  }
}

module.exports = Boomerang;
