import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import axios from 'axios';
import { Avatar } from 'react-native-elements'
import { Card, CardItem, Body, CheckBox, Right, Left, Icon } from 'native-base'



export default class CardView extends Component {
    
    // https://blog.expo.io/upcoming-limitations-to-ios-expo-client-8076d01aee1a

    constructor(props) {
        super(props);
        this.state = {
            checked: false
        }
    }

    render() {
        return(
            <View style={{/* paddingLeft: 10, paddingRight: 10,*/ margin: 10 }}> 
                <Card style={styles.card}>
                    <CardItem>
                        <Left>
                            <Avatar
                                size='medium'
                                rounded
                                source={require('../../../assets/purple_rocket.png')}
                            />
                        </Left>
                        <Right><Text>{this.props.task}</Text></Right>
                        {/*}
                        <Right style={{ paddingRight: 5 }}>
                            <CheckBox checked={this.state.checked} color="#523284" onPress={() => this.setState({checked: !this.state.checked})}/>
                        </Right>
                        */}
                    </CardItem>
                    <CardItem footer bordered>
                        <Left><Icon name='alarm' style={{ color: 'black', fontSize: 20 }}></Icon>
                            <Text>  12/21/2019  5:00 PM</Text>
                        </Left>
                        <Right style={{ paddingRight: 5 }}>
                            <CheckBox checked={this.state.checked} color="#523284" onPress={() => this.setState({checked: !this.state.checked})}/>
                        </Right>
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
        borderColor: '#dedfe0',
    }
})