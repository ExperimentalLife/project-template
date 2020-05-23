import { Component, OnInit } from '@angular/core';
import { InfectedService } from '@core/services';
import { BehaviorSubject } from 'rxjs';
@Component({
  selector: 'infected',
  templateUrl: './infected.component.html',
  styleUrls: ['./infected.component.scss']
})
export class InfectedComponent implements OnInit {

  constructor(private infectedService: InfectedService) { }

  ngOnInit() {
    this.infectedService.infected();
  }

  list: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  options = {
    searches: false,
    select: false,
    responsive: true,
    editor: {
      numeric: { className: 'numeric' },
      string: { className: 'string' },
      option: { className: 'option', datasource: [] }
    },
    data: {
      ajax: (data, callback, settings) =>
      this.infectedService.infecteds$.subscribe(res => callback({ aaData: res })),
      columns: [
        { defaultContent: "" },
        { data: "infE_dateRep", className: "string" },
        { data: "infE_day", className: "string" },
        { data: "infE_month", className: "string" },
        { data: "infE_year", className: "string" },
        { data: "infE_cases", className: "string" },
        { data: "infE_deaths", className: "string" },
        { data: "infE_countriesAndTerritories", className: "string" },
        { data: "infE_geoId", className: "string" },
        { data: "infE_countryterritoryCode", className: "string" },
        { data: "infE_popData2018", className: "string" },
        { data: "infE_continentExp", className: "string" },
      ]
    }
  };
}
