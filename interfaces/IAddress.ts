import { RowDataPacket } from 'mysql2';

export default interface IAddress extends RowDataPacket {
  address1: string;
  address2: string;
  postalCode: string;
  city: string;
  idUser: number;
}
