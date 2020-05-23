import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Result } from '@core/models/result.model';
import { getDefaultOptions } from '@core/helpers/http.configuration';
import { BehaviorSubject } from 'rxjs';
import { ObjectMapService } from '../object-map.service';
import { Infected } from '@core/models/server/infected.model';

@Injectable()
export class InfectedService {

   public infecteds = new BehaviorSubject<Array<any>>([]);

   infecteds$ = this.infecteds.asObservable();

   constructor(private http: HttpClient,
      private mapper: ObjectMapService) { }

   infected = () =>
      this.http.get<Result<any>>(`/api/Infected`, { headers: getDefaultOptions() })
         .subscribe(
            data => this.infecteds.next(data.data.map(x => this.mapper.mapClass(x, Infected))),
            err => console.log(err)
         )

}
