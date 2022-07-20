import { RowDataPacket } from 'mysql2';

export default interface IVideoGame extends RowDataPacket {
  id: number;
  idGameTypes: number;
  idLimitYears: number;
  title: string;
  backgroundImage: string;
  iconImage: string;
}
