import { RowDataPacket } from 'mysql2';

export default interface IGameType extends RowDataPacket {
  id: number;
  name: string;
}
