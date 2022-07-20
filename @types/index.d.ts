import IAddress from '../interfaces/IAddress';
import IUser from '../interfaces/IUser';
import IItem from '../interfaces/IItem';
declare global {
  namespace Express {
    interface Request {
      record?: IUser | IAddress | IItem; // used to store deleted record to send appropriate responses to react-admin
    }
  }
}
