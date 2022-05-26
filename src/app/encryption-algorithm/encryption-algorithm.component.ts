import { Component, OnInit } from '@angular/core';
import * as localForage from "localforage";

@Component({
  selector: 'app-encryption-algorithm',
  templateUrl: './encryption-algorithm.component.html',
  styleUrls: ['./encryption-algorithm.component.sass']
})
export class EncryptionAlgorithmComponent implements OnInit {
  ngf: LocalForage = localForage.createInstance({ name: 'encryption-algorithm' ,storeName:'tabs'});;
  index?: number;

  indexChanged() {
    this.ngf.setItem('index', this.index).then();
  }
  constructor() { }

  ngOnInit(): void {
    this.ngf.getItem<number>('index').then(v => { this.index = v! });
  }

}
