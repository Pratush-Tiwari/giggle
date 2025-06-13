/// <reference types="chrome"/>

declare namespace chrome {
  namespace contextMenus {
    interface CreateProperties {
      id?: string;
      title?: string;
      contexts?: string[];
    }

    // eslint-disable-next-line no-unused-vars
    function create(createProperties: CreateProperties): void;
    // eslint-disable-next-line no-unused-vars
    function onClicked(
      // eslint-disable-next-line no-unused-vars
      callback: (info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab) => void,
    ): void;
  }

  namespace notifications {
    interface NotificationOptions {
      type: 'basic';
      iconUrl: string;
      title: string;
      message: string;
    }

    // eslint-disable-next-line no-unused-vars
    function create(options: NotificationOptions): void;
  }

  namespace action {
    function openPopup(): void;
    // eslint-disable-next-line no-unused-vars
    function onClicked(callback: () => void): void;
  }

  namespace runtime {
    // eslint-disable-next-line no-unused-vars
    function onInstalled(callback: (details: chrome.runtime.InstalledDetails) => void): void;
  }

  namespace windows {
    interface CreateData {
      url?: string;
      type?: 'normal' | 'popup' | 'panel' | 'devtools';
      width?: number;
      height?: number;
    }

    // eslint-disable-next-line no-unused-vars
    function create(createData: CreateData): Promise<chrome.windows.Window>;
  }

  namespace tabs {
    interface CreateProperties {
      url?: string;
      active?: boolean;
    }

    // eslint-disable-next-line no-unused-vars
    function create(createProperties: CreateProperties): Promise<chrome.tabs.Tab>;
  }
}
