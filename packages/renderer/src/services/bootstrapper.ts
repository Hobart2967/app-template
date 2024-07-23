import { injectable } from 'inversify';

@injectable()
export abstract class Bootstrapper {
  public abstract bootstrap(): Promise<void>;
}