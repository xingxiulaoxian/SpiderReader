import React from 'react';
import store, { Store } from '../db';

export interface MainContextProps {
  platform: number;
  setPlatform?: (val: number) => void;
  store: Store;
}

export const MainContext: React.Context<MainContextProps> = React.createContext(
  {
    platform: 0,
    store: store,
  },
);
