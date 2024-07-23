import { injectable } from 'inversify';
import { interval, map, Observable, startWith } from 'rxjs';

@injectable()
export class TimeService {
  //#region Properties
  private _user$!: Observable<Date>;
  public get user(): Observable<Date> {
    return (this._user$ = this._user$ || interval(1000).pipe(
      startWith(new Date()),
      map(() => new Date())));
  }
  //#endregion
}