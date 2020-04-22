const Mix = require('../models/data');

exports.createGame = async (req, res, next) => {
  let game = await Mix.findOne();

  if (game) {
    game = await Mix.findOneAndRemove();
  }
  const mix = await Mix.create({
    starter: req.user,
    pool: req.players,
  });
  return mix;
};

exports.pickLeaders = async (req, res, next) => {
  let game = await Mix.findOne();
  console.log(game);
  if (game.leaders.length < 2) {
    console.log(game.id);
    if (!game.leaders.includes(req.leader)) {
      if (game.team1.length < 1) {
        const index = game.pool.indexOf(req.leader);
        game.pool.splice(index, 1);
        game.save();
        game = await Mix.findByIdAndUpdate(
          game._id,
          {
            $push: { leaders: req.leader, team1: req.leader },
          },
          { new: true }
        );
        req.message.reply(
          'Sa oled 1. tiimi liider! Kirjuta !pick @nimi, et valida omale meeskonnaliikmed'
        );
      } else {
        const index = game.pool.indexOf(req.leader);
        game.pool.splice(index, 1);
        game.save();
        game = await Mix.findByIdAndUpdate(
          game._id,
          {
            $push: { leaders: req.leader, team2: req.leader },
          },
          { new: true }
        );
        req.message.reply(
          'Sa oled 2. tiimi liider! Kirjuta !pick @nimi, et valida omale meeskonnaliikmed'
        );
      }
    }
  }
};

exports.teamPicker = async (req, res, next) => {
  let game = await Mix.findOne();

  //   if (game.pool.length === 0) {
  //     req.message.channel.send('Kõik mängijad on valitud!');
  //   }
  const nigger = game.leaders[0] === req.leader ? 'team1' : 'team2';

  try {
    if (game.leaders.includes(req.leader)) {
      if (game.pool.includes(req.player)) {
        const index = game.pool.indexOf(req.player);
        game.pool.splice(index, 1);
        await game.save();
        game = await Mix.findByIdAndUpdate(
          game._id,
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
  let game = await Mix.findOne();
  return game;
};