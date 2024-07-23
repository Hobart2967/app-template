import { ipcMain } from 'electron';

import { AppRpc } from '../../shared/app-rpc.interface';

class AppRpcImpl implements AppRpc {
  public log(message: string): void {
    console.log(message);
  }
}
/**
 * Expose 'electron-store' to Renderer-process through 'ipcMain.handle'
 */

const store = new AppRpcImpl();

ipcMain.handle(
  'app-channel',
  async (_evnet, methodSign: string, ...args: any[]) => {

    console.log('methodSign', methodSign);

    let result;
    if (typeof (store as any)[methodSign] === 'function') {
      result = (store as any)[methodSign](...args);
    } else {
      result = (store as any)[methodSign];
    }

    return result;
  }
);
