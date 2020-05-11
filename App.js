import React,{Component} from 'react';
import {View, Text} from 'react-native';
import Route from './src/route';
import { Root } from "native-base";

export default class App extends Component{
    render(){
        return(
            <Root>
                <Route/>
            </Root>
        );
    }
}