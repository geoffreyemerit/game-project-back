import { Request, Response, NextFunction, RequestHandler } from 'express';
import VideoGame from '../models/videoGame';
import { ErrorHandler } from '../helpers/errors';
import IVideoGame from '../interfaces/IVideoGame';
import Joi from 'joi';

// VALIDATE INPUT FOR POST AND PUT
const validateVideoGame = (req: Request, res: Response, next: NextFunction) => {
  let required: Joi.PresenceMode = 'optional';
  if ((req.method === 'POST', 'PUT')) {
    required = 'required';
  }

  const errors = Joi.object({
    id: Joi.number().optional(),
    idGameType: Joi.number().required().valid(1, 2, 3, 4, 5, 6, 7),
    idLimitYear: Joi.number().required().valid(1, 2, 3, 4, 5, 6),
    title: [Joi.string().max(150).optional(), Joi.allow(null)],
    backgroundImage: [Joi.string().max(255).optional(), Joi.allow(null)],
    iconImage: [Joi.string().max(255).optional(), Joi.allow(null)],
  }).validate(req.body, { abortEarly: false }).error;

  if (errors) {
    next(new ErrorHandler(422, errors.message));
  } else {
    next();
  }
};

// EXIST VIDEO GAME
// checks if an video game exists before update or delete
const videoGameExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { idVideoGame } = req.params;

  const videoGameExists: IVideoGame = await VideoGame.getVideoGameById(
    Number(idVideoGame)
  );
  if (!videoGameExists) {
    next(new ErrorHandler(409, `This video game does not exist`));
  } else {
    req.record = videoGameExists;
    next();
  }
};

//GET ALL VIDEO GAMES
const getAllVideoGames = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const videoGames = await VideoGame.getAllVideoGames();
    res.setHeader(
      'Content-Range',
      `pages : 0-${videoGames.length}/${videoGames.length + 1}`
    );
    return res.status(200).json(videoGames);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

// GET BY ID
const getVideoGameById = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idVideoGame } = req.params;
    const videoGames = await VideoGame.getVideoGameById(Number(idVideoGame));
    videoGames ? res.status(200).json(videoGames) : res.sendStatus(404);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

// GET BY IDGAMETYPE
const getVideoGamesByIdGameType = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idGameType } = req.params;
    const videoGames = await VideoGame.getVideoGamesByIdGameType(
      Number(idGameType)
    );
    if (videoGames) {
      res.setHeader(
        'Content-Range',
        `pages : 0-${videoGames.length}/${videoGames.length + 1}`
      );
      res.status(200).json(videoGames);
    } else res.sendStatus(404);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

// GET BY IDLIMITYEAR
const getVideoGamesByIdLimitYear = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idLimitYear } = req.params;
    const videoGames = await VideoGame.getVideoGamesByIdLimitYear(
      Number(idLimitYear)
    );
    if (videoGames) {
      res.setHeader(
        'Content-Range',
        `pages : 0-${videoGames.length}/${videoGames.length + 1}`
      );
      res.status(200).json(videoGames);
    } else res.sendStatus(404);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

// ADD VIDEO GAME
const addVideoGame = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const videoGameId = await VideoGame.addVideoGame(req.body as IVideoGame);
    if (videoGameId) {
      res.status(201).json({ id: videoGameId, ...req.body });
    } else {
      throw new ErrorHandler(500, `videoGame cannot be created`);
    }
  } catch (err) {
    next(err);
  }
};

//UPDATE VIDEO GAME
const updateVideoGame = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idVideoGame } = req.params;
    const videoGamesUpdated = await VideoGame.updateVideoGame(
      Number(idVideoGame),
      req.body as IVideoGame
    );
    if (videoGamesUpdated) {
      const videoGames = await VideoGame.getVideoGameById(Number(idVideoGame));
      res.status(200).send(videoGames); // react-admin needs this response
    } else {
      throw new ErrorHandler(500, `videoGame cannot be updated`);
    }
  } catch (err) {
    next(err);
  }
};

//DELETE PAGE
const deleteVideoGame = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idVideoGame } = req.params;
    const videoGameDeleted = await VideoGame.deleteVideoGame(
      Number(idVideoGame)
    );
    if (videoGameDeleted) {
      res.status(200).send(req.record); // react-admin needs this response
    } else {
      throw new ErrorHandler(409, `videoGame not found`);
    }
  } catch (err) {
    next(err);
  }
};

export default {
  videoGameExists,
  validateVideoGame,
  getAllVideoGames,
  getVideoGameById,
  getVideoGamesByIdGameType,
  getVideoGamesByIdLimitYear,
  addVideoGame,
  updateVideoGame,
  deleteVideoGame,
};
