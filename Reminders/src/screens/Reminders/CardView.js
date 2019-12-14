import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import axios from 'axios';
//import { ListItem, Button, Icon, CheckBox, Card } from 'react-native-elements'
import { Card, CardItem, Body, CheckBox, Right } from 'native-base'
import { SwipeListView } from 'react-native-swipe-list-view';


export default class CardView extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            checked: false
        }
    }

    render() {
        return(
            <View style={{ paddingLeft: 10, paddingRight: 10, margin: 10 }}> 
                <Card style={styles.card}>
                    <CardItem header>
                        <Text>{this.props.task}</Text>
                    </CardItem>
                    <CardItem>
                    <Body style={{ flexDirection: 'row'}}>
                        <Text>{this.props.status}</Text>
                        <Right style={{ paddingRight: 5 }}>
                            <CheckBox checked={this.state.checked} color="#523284" onPress={() => this.setState({checked: !this.state.checked})}/>
                        </Right>
                    </Body>
                    </CardItem>
                </Card>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    card: {
        shadowOffset: { width: 7, height: 7 },
        shadowColor: 'black',
        shadowOpacity: 0.06,
        borderRadius: 7,
        borderColor: '#dedfe0'
    }
})