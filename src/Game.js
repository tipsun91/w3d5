// Импортируем всё необходимое.
// Или можно не импортировать,
// а передавать все нужные объекты прямо из run.js при инициализации new Game().

const Hero = require('./game-models/Hero');
const Enemy = require('./game-models/Enemy');
const Boomerang = require('./game-models/Boomerang');
const View = require('./View');
const keypress = require('keypress');

// Основной класс игры.
// Тут будут все настройки, проверки, запуск.

class Game {
  #gameSpeed = 200;

  #keyboard = {
    a: (heroObject) => {
      if (heroObject.position > 0) {
        heroObject.moveLeft();
      }
    },
    d: (heroObject) => {
      if (heroObject.position < this.trackLength) {
        heroObject.moveRight();
      }
    },
  };

  constructor({ trackLength }) {
    this.trackLength = trackLength;
    this.boomerang = new Boomerang(0);
    this.hero = new Hero({ position: 0, boomerang: this.boomerang }); // Герою можно аргументом передать бумеранг.
    this.enemy = new Enemy(trackLength);
    this.view = new View(this);
    this.track = [];
    this.regenerateTrack();
  }

  regenerateTrack() {
    // Сборка всего необходимого (герой, враг(и), оружие)
    // в единую структуру данных
    this.track = (new Array(this.trackLength)).fill(' ');
    this.track[this.hero.position] = this.hero.skin;
    this.track[this.enemy.position] = this.enemy.skin;
  }

  check() {
    if (this.hero.position === this.enemy.position) {
      this.hero.die();
    }
  }

  play() {
    this.runInteractiveConsole();
    setInterval(() => {
      // Let's play!
      this.check();
      this.enemy.moveLeft();
      this.regenerateTrack();
      this.view.render();
    }, this.#gameSpeed);
  }

  runInteractiveConsole() {
    keypress(process.stdin);
    process.stdin.on('keypress', (ch, key) => {
      if (key) {
        // Вызывает команду, соответствующую нажатой кнопке.
        if (key.name in this.#keyboard) {
          this.check();
          this.#keyboard[key.name](this.hero);
        }
        // Прерывание программы.
        if (key.ctrl && key.name === 'c') {
          process.exit();
        }
      }
    });
    process.stdin.setRawMode(true);
  }
}

module.exports = Game;
