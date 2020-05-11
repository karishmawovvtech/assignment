import React,{Component} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './scenes/home';
import JSONDetails from './scenes/jsondetails';

const Stack = createStackNavigator();

function Route() {
  return (
    <NavigationContainer>
      <Stack.Navigator >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="jsonDetails" component={JSONDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Route;