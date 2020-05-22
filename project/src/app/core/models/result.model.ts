import { ResultType } from '../utils/type.enum';

export class Result<T>{
   public resultType: ResultType;
   public errors: Array<string>;
   public data: T;
   public date: Date;
   public exception: any;
}