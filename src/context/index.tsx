import React from 'react';

export interface LayoutContent {
  platform: number;
  setPlatform?: (val: number) => void;
}

export const MainContext: React.Context<LayoutContent> = React.createContext({
  platform: 0,
});
