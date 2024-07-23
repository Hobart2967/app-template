import { Container } from 'inversify';

import { Bootstrapper } from '../services/bootstrapper';

interface Application {
  spinUp(): Promise<void>;
  main(): Promise<void>;
  readonly container: Container;
}

interface ClassConstructor<T> extends Function {
  new(): T;
}

// TODO: Enable strict typing
export type ApplicationClassDecorator = <TFunction extends Application>(target: ClassConstructor<Application>) => ClassConstructor<Application> | void;

export function application(): ClassDecorator {
  return ((constructor: ClassConstructor<Application>) => {
    setTimeout(async () => {
      const app = new constructor();
      await app.spinUp();
      const bootstrappers = app.container.getAll(Bootstrapper);
      for (const initializer of bootstrappers) {
        await initializer.bootstrap();
      }

      await app.main();
    });
    return constructor;
  }) as ClassDecorator;
}