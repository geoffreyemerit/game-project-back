import { ResultSetHeader } from 'mysql2';
import connection from '../db-config.js';
import ILimitYear from '../interfaces/ILimitYear';

// GET ALL
const getAllLimitYears = async (sortBy = ''): Promise<ILimitYear[]> => {
  let sql: string = 'SELECT * FROM limitYears';
  if (sortBy) {
    sql += ` ORDER BY ${sortBy}`;
  }
  const results = await connection.promise().query<ILimitYear[]>(sql);
  return results[0];
};

//GET BY ID
const getLimitYearById = async (idLimitYear: number): Promise<ILimitYear> => {
  const [results] = await connection
    .promise()
    .query<ILimitYear[]>('SELECT * FROM limitYears WHERE id = ?', [
      idLimitYear,
    ]);
  return results[0];
};

// ADD
const addLimitYear = async (limitYear: ILimitYear): Promise<number> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>(
      'INSERT INTO limitYears (name, iconImage) VALUES (?, ?)',
      [limitYear.name, limitYear.iconImage]
    );
  return results[0].insertId;
};

//UPDATE
const updateLimitYear = async (
  idLimitYear: number,
  limitYear: ILimitYear
): Promise<boolean> => {
  let sql: string = 'UPDATE limitYears SET ';
  const sqlValues: Array<string | number> = [];
  let oneValue: boolean = false;

  if (limitYear.name) {
    sql += 'name = ? ';
    sqlValues.push(limitYear.name);
    oneValue = true;
  }
  if (limitYear.iconImage) {
    sql += 'iconImage = ? ';
    sqlValues.push(limitYear.iconImage);
    oneValue = true;
  }

  sql += ' WHERE id = ?';
  sqlValues.push(idLimitYear);

  const results = await connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues);
  return results[0].affectedRows === 1;
};

//DELETE
const deleteLimitYear = async (idLimitYear: number): Promise<boolean> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM limitYears WHERE id = ?', [
      idLimitYear,
    ]);
  return results[0].affectedRows === 1;
};

export default {
  getAllLimitYears,
  getLimitYearById,
  addLimitYear,
  updateLimitYear,
  deleteLimitYear,
};
