import { Injectable } from "@angular/core";
import { Subject, Observable } from 'rxjs';

@Injectable()
export class HttpObservableService {
   private _pendingRequestCounter = 0;
   private _isPendingRequestSubject = new Subject<boolean>();

   get isPendingRequests(): Observable<boolean> {
      return this._isPendingRequestSubject.asObservable();
   }

   get pendingRequests(): number {
      return this._pendingRequestCounter;
   }

   public onRequestStart(): void {
      this._pendingRequestCounter++;

      if (this._pendingRequestCounter === 1)
         this._isPendingRequestSubject.next(true);
   }

   public onRequestDone(): void {
      this._pendingRequestCounter--;

      if (this._pendingRequestCounter === 0)
         this._isPendingRequestSubject.next(false);
   }
}