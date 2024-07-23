import { injectable } from 'inversify';

import { Bootstrapper } from '../services/bootstrapper';

@injectable()
export class UserBootstrapper extends Bootstrapper {
  //#region Ctor
  public constructor() { super(); }
  //#endregion

  //#region Public Methods
  public async bootstrap(): Promise<void> {
    console.log('Bootstrapping app')
  }
  //#endregion

}