import { Request, Response, NextFunction, RequestHandler } from 'express';
import GameType from '../models/gameType';
import { ErrorHandler } from '../helpers/errors';
import IGameType from '../interfaces/IGameType';
import { formatSortString } from '../helpers/functions';
import Joi from 'joi';

const validateGameTypes = (req: Request, res: Response, next: NextFunction) => {
  let required: Joi.PresenceMode = 'optional';
  if ((req.method === 'POST', 'PUT')) {
    required = 'required';
  }
  const errors = Joi.object({
    id: Joi.number().optional(),
    name: Joi.string().max(50).presence(required),
  }).validate(req.body, { abortEarly: false }).error;
  if (errors) {
    console.log(errors.message);
    next(new ErrorHandler(422, errors.message));
  } else {
    next();
  }
};

// EXIST GAME TYPE
// checks if an game type exists before update or delete
const gameTypeExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { idGameType } = req.params;

  const gameTypeExists: IGameType = await GameType.getGameTypeById(
    Number(idGameType)
  );
  if (!gameTypeExists) {
    next(new ErrorHandler(409, `This game type does not exist`));
  } else {
    req.record = gameTypeExists;
    next();
  }
};

// GET ALL
const getAllGameTypes = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sortBy: string = req.query.sort as string;
    const gameTypes = await GameType.getAllGameTypes(formatSortString(sortBy));
    res.setHeader(
      'Content-Range',
      `pageTypes : 0-${gameTypes.length}/${gameTypes.length + 1}`
    );
    res.status(200).json(gameTypes);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

// GET BY ID
const getGameTypeById = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idGameType } = req.params;
    const gameTypes = await GameType.getGameTypeById(Number(idGameType));
    gameTypes ? res.status(200).json(gameTypes) : res.sendStatus(404);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

// ADD
const addGameType = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const gameTypeId = await GameType.addGameType(req.body as IGameType);
    if (gameTypeId) {
      res.status(201).json({ id: gameTypeId, ...req.body });
    } else {
      throw new ErrorHandler(500, `gameType cannot be created`);
    }
  } catch (err) {
    next(err);
  }
};

//UPDATE
const updateGameType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idGameType } = req.params;
    const gameTypeUpdated = await GameType.updateGameType(
      Number(idGameType),
      req.body as IGameType
    );
    if (gameTypeUpdated) {
      const gameTypes = await GameType.getGameTypeById(Number(idGameType));
      res.status(200).send(gameTypes); // react-admin needs this response
    } else {
      throw new ErrorHandler(500, `gameType cannot be updated`);
    }
  } catch (err) {
    next(err);
  }
};

//DELETE
const deleteGameType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idGameType } = req.params;
    const typeGameDeleted = await GameType.deleteGameType(Number(idGameType));
    if (typeGameDeleted) {
      res.status(200).send(req.record); // react-admin needs this response
    } else {
      throw new ErrorHandler(409, `pageType not found`);
    }
  } catch (err) {
    next(err);
  }
};

export default {
  gameTypeExists,
  validateGameTypes,
  getAllGameTypes,
  getGameTypeById,
  addGameType,
  updateGameType,
  deleteGameType,
};
