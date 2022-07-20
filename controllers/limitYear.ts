import { Request, Response, NextFunction, RequestHandler } from 'express';
import LimitYear from '../models/limitYear';
import { ErrorHandler } from '../helpers/errors';
import ILimitYear from '../interfaces/ILimitYear';
import { formatSortString } from '../helpers/functions';
import Joi from 'joi';

const validateLimitYears = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let required: Joi.PresenceMode = 'optional';
  if ((req.method === 'POST', 'PUT')) {
    required = 'required';
  }
  const errors = Joi.object({
    id: Joi.number().optional(),
    name: Joi.string().max(50).presence(required),
    iconImage: Joi.string().max(255).presence(required),
  }).validate(req.body, { abortEarly: false }).error;
  if (errors) {
    console.log(errors.message);
    next(new ErrorHandler(422, errors.message));
  } else {
    next();
  }
};

// EXIST LIMIT YEAR
// checks if an limityear exists before update or delete
const limitYearExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { idLimitYear } = req.params;

  const limitYearExists: ILimitYear = await LimitYear.getLimitYearById(
    Number(idLimitYear)
  );
  if (!limitYearExists) {
    next(new ErrorHandler(409, `This limit year does not exist`));
  } else {
    req.record = limitYearExists;
    next();
  }
};

// GET ALL
const getAllLimitYears = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sortBy: string = req.query.sort as string;
    const limitYears = await LimitYear.getAllLimitYears(
      formatSortString(sortBy)
    );
    res.setHeader(
      'Content-Range',
      `pageTypes : 0-${limitYears.length}/${limitYears.length + 1}`
    );
    res.status(200).json(limitYears);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

// GET BY ID
const getLimitYearById = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idLimitYear } = req.params;
    const limitYears = await LimitYear.getLimitYearById(Number(idLimitYear));
    limitYears ? res.status(200).json(limitYears) : res.sendStatus(404);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

// ADD
const addLimitYear = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const limitYearid = await LimitYear.addLimitYear(req.body as ILimitYear);
    if (limitYearid) {
      res.status(201).json({ id: limitYearid, ...req.body });
    } else {
      throw new ErrorHandler(500, `limitYear cannot be created`);
    }
  } catch (err) {
    next(err);
  }
};

//UPDATE
const updateLimitYear = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idLimitYear } = req.params;
    const limitYearUpdated = await LimitYear.updateLimitYear(
      Number(idLimitYear),
      req.body as ILimitYear
    );
    if (limitYearUpdated) {
      const limitYears = await LimitYear.getLimitYearById(Number(idLimitYear));
      res.status(200).send(limitYears); // react-admin needs this response
    } else {
      throw new ErrorHandler(500, `limitYears cannot be updated`);
    }
  } catch (err) {
    next(err);
  }
};

//DELETE
const deleteLimitYear = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idLimitYear } = req.params;
    const yearLimitDeleted = await LimitYear.deleteLimitYear(
      Number(idLimitYear)
    );
    if (yearLimitDeleted) {
      res.status(200).send(req.record); // react-admin needs this response
    } else {
      throw new ErrorHandler(409, `limitYear not found`);
    }
  } catch (err) {
    next(err);
  }
};

export default {
  limitYearExists,
  validateLimitYears,
  getAllLimitYears,
  getLimitYearById,
  addLimitYear,
  updateLimitYear,
  deleteLimitYear,
};
