import { Session } from '../models/session.model';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { SessionTag } from '../utils/tag.enum';

@Injectable()
export class SessionService {

   private localStorageService;
   private currentSession: Session = null;

   constructor() {
      this.localStorageService = localStorage;
      this.currentSession = this.loadSessionData();
   }

   setCurrentSession(session: Session): void {
      this.currentSession = session;
      this.localStorageService.setItem(SessionTag.session, JSON.stringify(session));
   }

   loadSessionData(): Session {
      var sessionStr = this.localStorageService.getItem(SessionTag.session);
      return (sessionStr) ? <Session>JSON.parse(sessionStr) : null;
   }

   getCurrentSession(): Session {
      return this.currentSession;
   }

   removeCurrentSession(): boolean {
      this.localStorageService.removeItem(SessionTag.session);
      this.currentSession = null;
      return !this.localStorageService.getItem(SessionTag.session) && !this.currentSession;
   }

   getCurrentUser(): User {
      var session: Session = this.getCurrentSession();
      return (session && session.user) ? session.user : null;
   }

   isAuthenticated(): Boolean {
      return (this.getCurrentToken() != null);
   }

   getCurrentToken(): string {
      var session = this.getCurrentSession();
      return (session && session.token) ? session.token : null;
   }

   getCurrentContext(): any {
      var session = this.getCurrentSession();
      return (session && session.context) ? session.context : null;
   }

   setCurrentContext(context: any): void {
      this.currentSession.context = context;
      this.setCurrentSession(this.currentSession);
   }

   removeCurrentContext(): void {
      this.setCurrentContext(null);
   }

   logout(): Promise<boolean> {
      return new Promise((resolve) => {
         resolve(this.removeCurrentSession())
      });
   }
}