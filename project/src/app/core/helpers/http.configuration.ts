import { HttpHeaders } from '@angular/common/http';

export const getDefaultOptions = (): HttpHeaders => {
   const headers = new HttpHeaders();
   headers.set('Accept', 'application/json');
   headers.set('Content-Type', 'application/json');
   return headers;
}