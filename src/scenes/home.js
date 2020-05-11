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
            list:[],
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
            this.setState({hitList:[...oldList, ...newList], list:[...oldList, ...newList], pageCount:this.state.pageCount+1});
            if(this.state.hitList.length > 0){
                this.setState({loading:false})
            }
        })
        .catch((error) => {
        console.error(error);
        });
        
    }
    navigate=(json)=>{
        this.props.navigation.navigate('jsonDetails',{json})
    }
    renderListItem=({item})=>{
        return(
            <Card>
                <CardItem button onPress={()=>this.navigate(item)}>
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
    search=()=>{
        if(this.state.searchText!=''){
            var tempArray=[];
            var list= this.state.list;
            filteredData = [...list];
            filteredData = filteredData.filter((item) => {
                if ( item.url && item.url.toLowerCase().includes(this.state.searchText.toLowerCase()) ) {
                    return true;
                } else if ( item.author && item.author.toLowerCase().includes(this.state.searchText.toLowerCase()) ) {
                    return true;
                } else {
                    return false;
                }
            });
            this.setState({hitList:filteredData})
        }else{

        }
    }
    filterByTitle=()=>{
        filteredData = [...this.state.list];
        filteredData = filteredData.sort(function (a, b) {
            if (a.title < b.title) {
                return -1;
            }
            if (a.title > b.title) {
            return 1;
            }
            return 0;
        });
        console.log(filteredData.length);
        this.setState({hitList:filteredData})
    }
    filterByCreatedAt=()=>{
        filteredData = [...this.state.list];
        filteredData = filteredData.sort(function (a, b) {
            return new Date(b.created_at) - new Date(a.created_at);
        });
        this.setState({hitList:filteredData})
    }
    header=()=>{
        return(
            <View>
                {this.state.loading?<ActivityIndicator size='large' animating={this.state.loading} color='blue'/>:null}
                {!this.state.loading?
                    <View style={{flexDirection:'row',justifyContent:'center'}}>
                        <Input placeholder="Search here"  onChangeText={value=>this.setState({searchText:value})} />
                        <Button small rounded onPress={this.search} >
                            <Text>SEARCH</Text>
                        </Button>    
                        <Button small rounded bordered  onPress={()=>{
                            ActionSheet.show(
                                {
                                    options: BUTTONS,
                                    cancelButtonIndex: CANCEL_INDEX,
                                    title: "Select option"
                                },
                                buttonIndex => {
                                    // this.setState({ clicked: BUTTONS[buttonIndex] });
                                    if(buttonIndex==0){
                                        this.filterByTitle();
                                    }
                                    if(buttonIndex==1){
                                        this.filterByCreatedAt();
                                    }
                                }
                                )
                        }}>
                            {/* <Text>Filter</Text> */}
                            <Icon type="FontAwesome" name="filter" />
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
            keyExtractor={(item, index) =>index.toString()}
            // onEndReached={this.loadMore}
            // onEndReachedThreshold={0.5}
            />
        );
    }
}