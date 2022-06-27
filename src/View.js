// Сделаем отдельный класс для отображения игры в консоли.

class View {
  constructor(game) {
    this.game = game;
  }

  render() {
    const yourTeamName = 'Elbrus';
    // Тут всё рисуем.
    console.clear();
    console.log(
      this.game.track
        .map(
          (el) => el.join('') + "\n"
        )
        .join('')
    );
    console.log(`\n💲: ${this.game.heroScore}\n🌀: ${this.game.getEnemySpeed()}\n🎬: ${this.game.getFrame()}\n⏳: ${this.game.gameTime()}\n`);
    console.log(`Created by "${yourTeamName}" with love`);
  }
}

module.exports = View;
