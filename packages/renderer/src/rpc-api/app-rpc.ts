import { AppRpc } from '../../../shared/app-rpc.interface';

// Usage of 'electron-store'
export const appRpc: AppRpc = new Proxy<AppRpc>({} as any, {
  get(target, prop, receiver) {
    return async (...args: any[]) => {
      const { invoke } = window.ipcRenderer
      let value = await invoke('app-rpc', prop, ...args)
      try {
        value = JSON.parse(value)
      } finally {
        return value
      }
    }
  },
});