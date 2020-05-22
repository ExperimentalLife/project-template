import { User } from './user.model';

export class Session {
   public user: User;
   public context: any;
   public token: string;
   public expiration: Date;
}