// Импортируем всё необходимое.
// Или можно не импортировать,
// а передавать все нужные объекты прямо из run.js при инициализации new Game().
const keypress = require('keypress');

const Hero      = require('./game-models/Hero');
const Enemy     = require('./game-models/Enemy');
const Boomerang = require('./game-models/Boomerang');
const Obstacle  = require('./game-models/Obstacle');
const View      = require('./View');

// Основной класс игры.
// Тут будут все настройки, проверки, запуск.

class Game {
  #frame         = 1;    // current frame
  #second        = 1000; // ms
  #frameDuration = 40;   // ms
  #fps           = 25;   // frames per second
  #weaponSpeed   = 2;
  #enemySpeed    = 5;    // frames per move
  #obstacleSpeed = 8;    // frames per move
  #gameTime      = 0;
  #heroAction    = null;
  heroScore      = 0;
  #effect        = '💥';

  constructor({ trackLength }) {
    this.trackLength = trackLength;
    this.boomerang   = new Boomerang();
    this.hero        = new Hero(this.boomerang); // Герою можно аргументом передать бумеранг.
    this.enemy       = new Enemy(trackLength);
    this.obstacle    = new Obstacle(trackLength);
    this.view        = new View(this);
    this.track       = [];
    this.regenerateTrack();
  }

  getFrame() {
    return this.#frame;
  }

  getEnemySpeed() {
    return this.#enemySpeed;
  }

  gameTime() {
    return this.#gameTime += Math.floor(this.#frame * this.#frameDuration / this.#second);
  }

  nextFrame() {
    if (this.#frame === this.#fps) {
      this.#frame = 1;
    } else {
      this.#frame += 1;
    }
  }

  #keyboard = {
    a: (game) => {
      if (game.hero.position > 0) {
        game.hero.moveLeft();
      }
    },
    d: (game) => {
      if (game.hero.position < game.trackLength) {
        game.hero.moveRight();
      }
    },
    w: (game) => {
      if (game.hero.floor === 1) {
        game.hero.jump();
      }
    },
    space: (game) => {
      game.hero.attack();
    }
  };

  regenerateTrack() {
    // Сборка всего необходимого (герой, враг(и), оружие)
    // в единую структуру данных
    if (this.hero.jumpFramesTimer > 0) {
      this.hero.jumpFramesTimer -= 1;
    } else {
      this.hero.floor = 1;
    }

    this.track    = new Array(2);
    this.track[0] = new Array(this.trackLength).fill('  '); // клетка в 2 пробела, т.к. emoji занимает ровно 2 пробельных символа
    this.track[1] = [].concat(this.track[0]);

    if (this.boomerang.position && [this.boomerang.position, this.boomerang.position + 1, this.boomerang.position - 1].includes(this.enemy.position)) {
      this.track[1][this.enemy.position] = this.#effect;
    } else {
      this.track[1][this.enemy.position] = this.enemy.skin;
    }

    if (this.boomerang.position !== null) {
      this.track[1][this.boomerang.position] = this.boomerang.skin;
      if (this.#frame % this.#weaponSpeed === 0) {
        this.boomerang.position += 1;
      }
    }

    if (this.obstacle.position !== null) {
      this.track[1][this.obstacle.position] = this.obstacle.skin;
    }

    if (!this.enemy.position || this.enemy.position <= 0) {
      this.enemy = new Enemy(this.trackLength);
    }

    // New
    if (!this.obstacle.position || this.obstacle.position <= 0) {
      this.obstacle = new Obstacle(this.trackLength);
    }

    this.track[this.hero.floor][this.hero.position] = this.hero.skin;
  }

  check() {
    if (this.hero.floor === 1 && (this.hero.position === this.enemy.position || this.hero.position === this.obstacle.position)) {
      this.hero.die();
    }

    if (this.boomerang.position === this.enemy.position) {
      this.enemy.die();
      this.heroScore += 1;
      this.boomerang.position = null;
    }

    if (this.boomerang.position === this.trackLength || this.boomerang.position === this.obstacle.position) {
      this.boomerang.position = null;
    }

    switch (this.heroScore) {
      case 3:
          this.#enemySpeed = 4;
        break;
      case 5:
          this.#enemySpeed = 3;
        break;
      case 8:
          this.#enemySpeed = 2;
        break;
      case 10:
          this.#enemySpeed = 1;
        break;
      default:
          // none;
        break;
    }
  }

  play() {
    this.runInteractiveConsole();
    setInterval(() => {
      this.check();
      if (this.#heroAction !== null) { this.#heroAction(this); }
      if (this.#frame % this.#enemySpeed === 0) { this.enemy.moveLeft(); }
      if (this.#frame % this.#obstacleSpeed === 0) { this.obstacle.moveLeft(); }
      this.regenerateTrack();
      this.view.render();
      this.nextFrame();
      this.#heroAction = null;
    }, this.#frameDuration);
  }

  runInteractiveConsole() {
    keypress(process.stdin);
    process.stdin.on('keypress', (ch, key) => {
      if (key) {
        // Вызывает команду, соответствующую нажатой кнопке.
        if (key.name in this.#keyboard && this.#heroAction === null) {
          this.#heroAction = this.#keyboard[key.name];
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
