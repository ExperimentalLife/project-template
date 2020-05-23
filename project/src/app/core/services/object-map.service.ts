import { Injectable } from '@angular/core';

@Injectable()
export class ObjectMapService {
   mapClass = <T>(data: Object, o: new () => T): T => Object.assign(new o(), data)
}