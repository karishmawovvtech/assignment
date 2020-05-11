import React, { Component } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { Card, CardItem, Body, Text, Button, Icon, Left, Input, ActionSheet, Right } from 'native-base';
var BUTTONS = ["Filter By Title", "Filter By Created At",  "Cancel"];
var CANCEL_INDEX = 2;
export default class Home extends Component{
    constructor(){
        super();
        this.state={
            hitList:[],
            pageCount:0,
            loading:false,
            searchText:''
        }
    }
    componentDidMount=()=>{
        if(this.state.hitList.length==0){
            this.setState({loading:true})
        }
        this.timer = setInterval(() => {
            this.featchData();
        }, 10000);
    }
    componentWillUnmount=()=>{
        clearInterval(this.timer);
    }
    featchData=()=>{
      var data= fetch('https://hn.algolia.com/api/v1/search_by_date?tags=story&page='+this.state.pageCount)
        .then((response) => response.json())
        .then((json) => {
            let oldList=this.state.hitList;
            let newList=json.hits;
            this.setState({hitList:[...oldList, ...newList], pageCount:this.state.pageCount+1});
            if(this.state.hitList.length > 0){
                this.setState({loading:false})
            }
        })
        .catch((error) => {
        console.error(error);
        });
        
    }
    navigate=()=>{
        this.props.navigation.navigate('jsonDetails')
    }
    renderListItem=({item})=>{
        return(
            <Card>
                <CardItem button onPress={this.navigate}>
                    <Body>
                        <Text>{item.title}</Text>
                        <Text note>{item.author}</Text>
                        <Text note style={{color:'blue'}}>{item.url}</Text>
                        <Text note>{item.created_at}</Text>
                    </Body>
                </CardItem>
            </Card>
        );
    }
    header=()=>{
        return(
            <View>
                {this.state.loading?<ActivityIndicator size='large' animating={this.state.loading} color='blue'/>:null}
                {!this.state.loading?
                    <View style={{flexDirection:'row'}}>
                        <Input placeholder="Search here" onSubmitEditing={()=>alert('hello')} onChangeText={value=>this.setState({searchText:value})} />

                        <Button small rounded bordered style={{alignSelf:'flex-end'}} onPress={()=>{
                            ActionSheet.show(
                                {
                                    options: BUTTONS,
                                    cancelButtonIndex: CANCEL_INDEX,
                                    title: "Select option"
                                },
                                buttonIndex => {
                                    // this.setState({ clicked: BUTTONS[buttonIndex] });
                                    if(buttonIndex==0){
                                        filterByTitle();
                                    }
                                    if(buttonIndex==1){
                                        filterByCreatedAt();
                                    }
                                }
                                )
                        }}>
                            {/* <Text>Filter</Text> */}
                            <Icon name='arrow-back' />
                        </Button>
                    </View>
                :null}
            </View>
        )
    }
    render(){
        return(
            <FlatList 
            ListHeaderComponent={this.header}
            data={this.state.hitList}
            renderItem={this.renderListItem}
            keyExtractor={index =>index.toString()}
            // onEndReached={this.loadMore}
            // onEndReachedThreshold={0.5}
            />
        );
    }
}