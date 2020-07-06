import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  // encapsulation: ViewEncapsulation.None,
  host: {'class': 'app-history'}
})
export class HistoryComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
