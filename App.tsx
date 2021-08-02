/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useState } from 'react';
import { MainContext } from './src/context';

import Routers from './src/routers';
import store from './src/db';

const App = () => {
  const [platform, setPlatform] = useState(0);
  return (
    <MainContext.Provider
      value={{
        platform,
        setPlatform,
        store,
      }}
    >
      <Routers />
    </MainContext.Provider>
  );
};

export default App;
