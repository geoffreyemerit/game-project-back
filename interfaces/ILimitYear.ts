import { RowDataPacket } from 'mysql2';

export default interface ILimitYear extends RowDataPacket {
  id: number;
  name: string;
  iconImage: string;
}
