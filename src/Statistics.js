// const Readline = require('readline/promises');
// const { stdin: input, stdout: output } = require('process');
const { User, Round, sequelize } = require('./db/models');

class Statistics {
  async get() {
    if (process.argv[2] === 'stat') {
      const findUser = async (pk) => {
        const currentUser = await User.findByPk(pk);
      };
      const data = await Round.findAll({
        limit: 5,
        order: [
          ['score', 'DESC'],
        ],
        raw: true,
        attributes: ['user_id', 'score'],
        include: [{
          model: User,
          attributes: ['name'],
        },
        ],
      });
      return data;
 
    }

  }
}

const stat = new Statistics();
stat.get().then(data => data.map((el, i) => console.log(`${i + 1}. ${el['User.name']} - ${el.score}`)));
