import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {convertToParamMap, Data, ParamMap} from '@angular/router';
import {Injectable} from '@angular/core';

@Injectable()
export class ActivatedRouteStub {
  private paramSubject = new BehaviorSubject(convertToParamMap(this.testParamMap));
  paramMap = this.paramSubject.asObservable();
  private _testParamMap: ParamMap = convertToParamMap({});

  private dataSubject = new BehaviorSubject(this.testData);
  private _testData: Data = {};

  get testParamMap() {
    return this._testParamMap;
  }

  set testParamMap(params: {}) {
    this._testParamMap = convertToParamMap(params);
    this.paramSubject.next(this._testParamMap);
  }

  get snapshot(): {} {
    return {
      paramMap: this.testParamMap,
      data: this.testData
    };
  }

  get testData() {
    return this._testData;
  }

  set testData(data: Data) {
    this._testData = data;
    this.dataSubject.next(this._testData);
  }

  resetData(): void {
    this.testParamMap = {};
    this.testData = {};
  }
}
