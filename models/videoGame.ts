import { ResultSetHeader } from 'mysql2';
import connection from '../db-config';
import IVideoGame from '../interfaces/IVideoGame';

//GET ALL VIDEO GAMES
const getAllVideoGames = async (): Promise<IVideoGame[]> => {
  const sql: string = `SELECT * from videoGames`;
  const results = await connection.promise().query<IVideoGame[]>(sql);
  return results[0];
};

// GET VIDEO GAME BY ID
const getVideoGameById = async (idVideoGame: number): Promise<IVideoGame> => {
  const [results] = await connection
    .promise()
    .query<IVideoGame[]>('SELECT * FROM videoGames WHERE id = ?', [
      idVideoGame,
    ]);
  return results[0];
};

// GET BY IDGAMETYPE
const getVideoGamesByIdGameType = async (
  idGameType: number
): Promise<IVideoGame[]> => {
  const results = await connection
    .promise()
    .query<IVideoGame[]>('SELECT * FROM videoGames WHERE idGameType = ?', [
      idGameType,
    ]);
  return results[0];
};

// GET BY IDLIMITYEAR
const getVideoGamesByIdLimitYear = async (
  idLimitYear: number
): Promise<IVideoGame[]> => {
  const results = await connection
    .promise()
    .query<IVideoGame[]>('SELECT * FROM videoGames WHERE idLimitYear = ?', [
      idLimitYear,
    ]);
  return results[0];
};

// ADD NEW VIDEO GAME
const addVideoGame = async (page: IVideoGame): Promise<number> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>(
      'INSERT INTO videoGames (idGameType, idLimitYear, title, backgroundImage, iconImage) VALUES (?, ?, ?, ?, ?',
      [
        page.idGameType,
        page.idLimitYear,
        page.title,
        page.backgroundImage,
        page.iconImage,
      ]
    );
  return results[0].insertId;
};

// UPDATE 1 VIDEO GAME
const updateVideoGame = async (
  idVideoGame: number,
  videoGame: IVideoGame
): Promise<boolean> => {
  let sql: string = 'UPDATE videoGames SET ';
  [];
  const sqlValues: Array<string | number | Date> = [];
  let oneValue: boolean = false;

  if (videoGame.idGameType) {
    sql += 'idGameType = ? ';
    sqlValues.push(videoGame.idGameType);
    oneValue = true;
  }
  if (videoGame.idLimitYear) {
    sql += 'idLimitYear = ? ';
    sqlValues.push(videoGame.idLimitYear);
    oneValue = true;
  }
  if (videoGame.title) {
    sql += oneValue ? ', title = ? ' : ' title = ? ';
    sqlValues.push(videoGame.title);
    oneValue = true;
  }
  if (videoGame.backgroundImage) {
    sql += oneValue ? ', backgroundImage = ? ' : ' backgroundImage = ? ';
    sqlValues.push(videoGame.backgroundImage);
    oneValue = true;
  }
  if (videoGame.iconImage) {
    sql += oneValue ? ', iconImage = ? ' : ' iconImage = ? ';
    sqlValues.push(videoGame.iconImage);
    oneValue = true;
  }
  sql += ' WHERE id = ?';
  sqlValues.push(idVideoGame);

  const results = await connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues);
  return results[0].affectedRows === 1;
};

//DELETE PAGE
const deleteVideoGame = async (idVideoGame: number): Promise<boolean> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM videoGames WHERE id = ?', [
      idVideoGame,
    ]);
  return results[0].affectedRows === 1;
};

export default {
  getAllVideoGames,
  getVideoGameById,
  getVideoGamesByIdGameType,
  getVideoGamesByIdLimitYear,
  addVideoGame,
  updateVideoGame,
  deleteVideoGame,
};
