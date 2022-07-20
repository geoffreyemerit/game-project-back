import gameTypesController from './controllers/gameType';
import limitYearsController from './controllers/limitYear';
import videoGamesController from './controllers/videoGame';
import { Express } from 'express';

const setupRoutes = (server: Express) => {
  // ------ GAMETYPES ------ //
  //--ALL--
  server.get('/api/gameTypes', gameTypesController.getAllGameTypes);
  //--ID--
  server.get('/api/gameTypes/:idGameType', gameTypesController.getGameTypeById);
  //--ADD--
  server.post(
    '/api/gameTypes',
    gameTypesController.validateGameTypes,
    gameTypesController.addGameType
  );
  //--UPDATE--
  server.put(
    '/api/gameTypes/:idGameType',
    gameTypesController.validateGameTypes,
    gameTypesController.gameTypeExists,
    gameTypesController.updateGameType
  );
  //--DELETE--
  server.delete(
    '/api/gameTypes/:idGameType',
    gameTypesController.gameTypeExists,
    gameTypesController.deleteGameType
  );

  //------ LIMITYEARS -----//
  //--ALL--
  server.get('/api/limitYears', limitYearsController.getAllLimitYears);
  //--ID--
  server.get(
    '/api/limitYears/:idLimitYear',
    limitYearsController.getLimitYearById
  );
  //--ADD--
  server.post(
    '/api/limitYears',
    limitYearsController.validateLimitYears,
    limitYearsController.addLimitYear
  );
  //--UPDATE--
  server.put(
    '/api/limitYears/:idLimitYear',
    limitYearsController.validateLimitYears,
    limitYearsController.limitYearExists,
    limitYearsController.updateLimitYear
  );
  //--DELETE--
  server.delete(
    '/api/limitYears/:idLimitYear',
    limitYearsController.limitYearExists,
    limitYearsController.deleteLimitYear
  );

  //------ VIDEOGAMES -----//
  //--ALL--
  server.get('/api/videoGames', videoGamesController.getAllVideoGames);
  //--ID--
  server.get(
    '/api/videoGames/:idVideoGame',
    videoGamesController.getVideoGameById
  );
  //--ADD--
  server.post(
    '/api/videoGames',
    videoGamesController.validateVideoGame,
    videoGamesController.addVideoGame
  );
  //--UPDATE--
  server.put(
    '/api/videoGames/:idVideoGame',
    videoGamesController.validateVideoGame,
    videoGamesController.videoGameExists,
    videoGamesController.updateVideoGame
  );
  //--DELETE--
  server.delete(
    '/api/videoGames/:idVideoGame',
    videoGamesController.videoGameExists,
    videoGamesController.deleteVideoGame
  );
};
export default setupRoutes;
