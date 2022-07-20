import { ResultSetHeader } from 'mysql2';
import connection from '../db-config.js';
import IGameType from '../interfaces/IGameType';

// GET ALL
const getAllGameTypes = async (sortBy = ''): Promise<IGameType[]> => {
  let sql: string = 'SELECT * FROM gameTypes';
  if (sortBy) {
    sql += ` ORDER BY ${sortBy}`;
  }
  const results = await connection.promise().query<IGameType[]>(sql);
  return results[0];
};

//GET BY ID
const getGameTypeById = async (idGameType: number): Promise<IGameType> => {
  const [results] = await connection
    .promise()
    .query<IGameType[]>('SELECT * FROM gameTypes WHERE id = ?', [idGameType]);
  return results[0];
};

// ADD
const addGameType = async (gameType: IGameType): Promise<number> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>('INSERT INTO gameTypes (name) VALUES (?)', [
      gameType.name,
    ]);
  return results[0].insertId;
};

//UPDATE
const updateGameType = async (
  idGameType: number,
  gameType: IGameType
): Promise<boolean> => {
  let sql: string = 'UPDATE gameTypes SET ';
  const sqlValues: Array<string | number> = [];
  let oneValue: boolean = false;

  if (gameType.name) {
    sql += 'name = ? ';
    sqlValues.push(gameType.name);
    oneValue = true;
  }

  sql += ' WHERE id = ?';
  sqlValues.push(idGameType);

  const results = await connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues);
  return results[0].affectedRows === 1;
};

//DELETE
const deleteGameType = async (idGameType: number): Promise<boolean> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM gameTypes WHERE id = ?', [idGameType]);
  return results[0].affectedRows === 1;
};

export default {
  getAllGameTypes,
  getGameTypeById,
  addGameType,
  updateGameType,
  deleteGameType,
};
