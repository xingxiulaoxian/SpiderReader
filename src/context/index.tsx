import React from 'react';
import store, { Store } from '../db';

export interface LayoutContent {
  platform: number;
  setPlatform?: (val: number) => void;
  store: Store;
}

export const MainContext: React.Context<LayoutContent> = React.createContext({
  platform: 0,
  store: store,
});
