import React, { ComponentType } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../pages/home';
import Search from '../pages/search';
import Info from '../pages/info';
import Menus from '../pages/menus';

interface Route {
  name: string;
  title: string;
  component: ComponentType<any>;
}

export const routers: Route[] = [
  { name: 'Home', title: '首页', component: Home },
  { name: 'Search', title: '搜索', component: Search },
  { name: 'Info', title: '详情', component: Info },
  { name: 'Menus', title: '菜单', component: Menus },
];
const Stack = createStackNavigator();

export default function Routers() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {routers.map(({ name, component }) => (
          <Stack.Screen key={name} name={name} component={component} />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
