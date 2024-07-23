import './app.scss';
import './styles.scss';
import 'reflect-metadata';

import { Router } from '@solidjs/router';
import { Container } from 'inversify';
import { onMount } from 'solid-js';
import { render } from 'solid-js/web';

import { UserBootstrapper } from './bootstrappers/test.bootstrapper';
import { DependencyInjectionContext } from './contexts/dependency-injection.context';
import { application } from './decorators/application.decorator';
import { AliasedProvider, ConstantValueProvider, ServiceProvider } from './models/ioc/provider.interface';
import { routes } from './routes';
import { appRpc } from './rpc-api/app-rpc';
import { AppChannel } from './services/app-channel.token';
import { Bootstrapper } from './services/bootstrapper';
import { TimeService } from './services/time.service';

@application()
export class App {
  //#region Private Fields
  private _container: Container | null = null;
  //#endregion

 //#region Properties
  public get container(): Container {
    return this._container!;
  }
  //#endregion

  public async spinUp(): Promise<void> {
    console.log("ipcRenderer", window.ipcRenderer);

    // Usage of ipcRenderer.on
    window.ipcRenderer?.on("main-process-message", (_event, ...args) => {
      console.log("[Receive Main-process message]:", ...args);
    });

    await this
      .buildContainer();
  }

  public async main(): Promise<void> {
    onMount(() => {
      window.removeLoading && window.removeLoading();
    });

    await this.render();
  }

  private buildContainer(): App {
    const container = new Container();

    const services: ServiceProvider[] = [
      TimeService
    ];
    const constantValues: ConstantValueProvider[] = [
      { use: AppChannel, withValue: appRpc }
    ];

    const aliases: AliasedProvider[] = [
      { use: UserBootstrapper, withAlias: Bootstrapper }
    ];

    for (const service of services) {
      container
        .bind(service)
        .toSelf()
        .inSingletonScope();
    }

    for (const service of constantValues) {
      container
        .bind(service.use)
        .toConstantValue({
          instance: service.withValue
        });
    }

    for (const service of aliases) {
      container
        .bind(service.withAlias)
        .to(service.use)
        .inSingletonScope();
    }

    this._container = container;

    return this;
  }

  private render(): App {
    const appContainer = document.getElementById("app");
    if (!appContainer) {
      throw new Error('Could not find #app container element in DOM.');
    }

    //  const Route = useRoutes(routes);
    // source={this._routerElectronIntegration()}
    render(
      () =>
        <DependencyInjectionContext.Provider value={this._container}>
          <Router>{routes}</Router>
        </DependencyInjectionContext.Provider>
      ,
      appContainer);

    return this;
  }
}
