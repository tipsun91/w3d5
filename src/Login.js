const Readline = require('readline/promises');
const { stdin: input, stdout: output } = require('process');
const { User } = require('./db/models');

class Login {
  async name() {
    const rl = Readline.createInterface({ input, output });

    const usersName = () => new Promise((resolve, reject) => {
      rl.setPrompt('Type your name: ');
      rl.prompt();
      rl.on('line', (name) => {
        // console.log(`Name received by the user: ${name}`);
        resolve(name);
      });
    });

    const usersCity = () => new Promise((resolve, reject) => {
      rl.setPrompt('Your group: ');
      rl.prompt();
      rl.on('line', (group) => {
        // console.log(`Group received by the user: ${group}`);
        console.log(`Thank you for registration!`);
        resolve(group);
      });
    });

    const main = async () => {
      this.createUser(await usersName(), await usersCity(), rl);

      rl.close();
    //   console.clear()
    //   await this.createUser(await usersName(), await usersCity())
    };

    main()
  }

  async createUser(inputName, inputGroup, myRl) {
    await User.create({
      name: `${inputName}`,
      group: `${inputGroup}`
    });
  }
}

const login = new Login();
login.name();
// login.createUser();

module.exports = Login;