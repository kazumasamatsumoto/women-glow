import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { HomeScreen } from '../screens/HomeScreen';
import { ChatScreen } from '../screens/ChatScreen';
import { PurchaseScreen } from '../screens/PurchaseScreen';

export type RootTabParamList = {
  Home: undefined;
  Chat: undefined;
  Purchase: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#b85f8e',
          tabBarInactiveTintColor: '#8e5873',
          tabBarStyle: {
            backgroundColor: '#fff',
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ tabBarLabel: 'トップ' }}
        />
        <Tab.Screen
          name="Chat"
          component={ChatScreen}
          options={{ tabBarLabel: 'チャット' }}
        />
        <Tab.Screen
          name="Purchase"
          component={PurchaseScreen}
          options={{ tabBarLabel: '課金' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
