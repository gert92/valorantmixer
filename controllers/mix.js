const Mix = require('../models/data');

exports.createGame = async (req, res, next) => {
  let games = await Mix.findOne({ channelId: req.channelId });

  if (games) {
    // games.map((game) => game.remove());
    games.remove();
  }
  const mix = await Mix.create({
    starter: req.user,
    pool: req.players,
    channelId: req.channelId,
  });
  console.log(mix);
  return mix;
};

exports.pickLeaders = async (req, res, next) => {
  let game = await Mix.findOne({ channelId: req.channelId });
  console.log(game);

  const nigger = game.team1.length < 1 ? 'team1' : 'team2';

  if (game.leaders.length < 2) {
    console.log(game.id);
    if (!game.leaders.includes(req.leader)) {
      const index = game.pool.indexOf(req.leader);
      game.pool.splice(index, 1);
      game.save();
      game = await Mix.findOneAndUpdate(
        { channelId: req.channelId },
        {
          $push: { leaders: req.leader, [nigger]: req.leader },
        },
        { new: true }
      );
      req.message.reply(
        'Sa oled tiimi liider! Kirjuta !pick @nimi, et valida omale meeskonnaliikmed'
      );
    }
  }
};

exports.teamPicker = async (req, res, next) => {
  let game = await Mix.findOne({ channelId: req.channelId });

  //   if (game.pool.length === 0) {
  //     req.message.channel.send('Kõik mängijad on valitud!');
  //   }
  const nigger = game.leaders[0] === req.leader ? 'team1' : 'team2';

  try {
    if (game.leaders.includes(req.leader)) {
      // console.log(req.leader);
      if (game.pool.includes(req.player)) {
        const index = game.pool.indexOf(req.player);
        game.pool.splice(index, 1);
        await game.save();
        game = await Mix.findOneAndUpdate(
          { channelId: req.channelId },
          { $push: { [nigger]: req.player } },
          { new: true }
        );

        //   await req.message.channel.send(game.team1.map((player) => player));
      }
    }
    console.log(game);
    return game;
  } catch (error) {
    console.error(error);
  }
};

exports.mixPool = async (req, res, next) => {
  let game = await Mix.findOne({ channelId: req.channelId });
  return game;
};
