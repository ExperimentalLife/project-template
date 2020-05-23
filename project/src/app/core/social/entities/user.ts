export class SocialUser {
  provider: string;
  id: string;
  email: string;
  name: string;
  photoUrl: string;
  firstName: string;
  lastName: string;
  authToken: string;
  idToken: string; 
  authorizationCode: string;
  facebook?: any;
  linkedIn?: any;
}
