import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableHighlight,
ActivityIndicator, FlatList, TextInput, RefreshControl } from 'react-native';
import axios from 'axios';
import { Body, Title, Button, Icon } from 'native-base'
import ActionButton from 'react-native-action-button'
import CardView from './CardView';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Header, Overlay } from 'react-native-elements';
import CreateReminder from './CreateReminder';
import { connect } from 'react-redux';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';

class RemindersScreen extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            isLoading: true,
            isVisible: false,
            greeting: ''
        }
    }

    renderWelcomeMsg = (currentTime = new Date()) => {
        const currentHour = currentTime.getHours();
        console.log(currentHour)
        const splitAfternoon = 12; // 24hr time to split the afternoon
        const splitEvening = 17; // 24hr time to split the evening
      
        if (currentHour >= splitAfternoon && currentHour <= splitEvening) {
          // Between 12 PM and 5PM
          this.setState({
              greeting: 'Good Afternoon!'
          });
        } else if (currentHour >= splitEvening) {
            // Between 5PM and Midnight
            this.setState({
                greeting: 'Good Evening!'
            });
        } else {
            // Between dawn and noon
            this.setState({
                greeting: 'Good Morning!'
            });
        }
    };

    registerForPushNotificationsAsync = async () => {
        const { status: existingStatus } = await Permissions.getAsync(
            Permissions.NOTIFICATIONS
        );
        let finalStatus = existingStatus;
        // only ask if permissions have not already been determined, because
        // iOS won't necessarily prompt the user a second time.
        if (existingStatus !== 'granted') {
            // Android remote notification permissions are granted during the app
            // install, so this will only ask on iOS
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
        }
        // Stop here if the user did not grant permissions
        if (finalStatus !== 'granted') {
            return;
        }
        // Get the token that uniquely identifies this device
        let token = await Notifications.getExpoPushTokenAsync();

        /*// POST the token to your backend server from where you can retrieve it to send push notifications.
        return fetch(PUSH_ENDPOINT, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: {
                    value: token,
                },
                user: {
                    username: 'Brent',
                },
            }),
        });*/
    };

    async getReminders() {
        await this.registerForPushNotificationsAsync()
        this.renderWelcomeMsg();
        return await fetch('http://192.168.1.51:4567/tasks')
            .then((response) => response.json())
            .then((responseJson) => {
            this.setState({
                isLoading: false,
                dataSource: responseJson.tasks,
            }, function(){
                if (this.state.dataSource === undefined) {
                    this.setState({
                        noTasks: true,
                    });
                    this.props.dispatch({ type: 'ADD_ALL_REMINDERS', addReminders: [] })
                } else {
            
                    this.props.dispatch({ type: 'ADD_ALL_REMINDERS', addReminders: this.state.dataSource })
                }
            });
            })
            .catch((error) =>{
            console.error(error);
        });
    }

    async componentDidMount() {
        this.getReminders();
    }

    openModal() {
       this.props.dispatch({ type: 'IS_VISIBLE', viewModal: true })
    }

    deleteTask(task) {
        console.log(task.item);
        try {
            axios.delete('http://192.168.1.51:4567/deleteTask', {
                data: {
                    id: task.item.id,
                }
            }) .then(res => {
                const index = this.props.remindersList.indexOf(task.item) + 1;
                if(res.data.responseStatus === 'Deleted Task') {
                    this.props.dispatch({ type: 'DELETE_REMINDER', deleteReminder: index })
                }
            })
        } catch(err) {
            console.log(err);
        }
    }

    render() {

        if(this.state.isLoading){
            return(
            <View style={{flex: 1, padding: 20}}>
                <ActivityIndicator/>
            </View>
            )
        }

        return(
            <View style={{flex: 1, backgroundColor: '#F2F6FF'}}>
                <Header
                    centerComponent={
                        <View>
                            <Text style={{ color: 'white'}}>{ this.state.greeting }</Text>
                            <Text style={{ color: 'white'}}>You have { this.props.remindersList.length } Reminder(s)!</Text>
                        </View>
                    }
                    containerStyle={{
                        backgroundColor: '#523284',
                    }}
                >

                </Header>
                <SwipeListView
                    data={this.props.remindersList}
                    renderItem={({item}) => 
                        <CardView task={item.task} status={item.status}/>}
                        renderHiddenItem={ (data, rowMap) => (
                        <View style={styles.rowBack}>
                            <Button style={{backgroundColor: 'green'}} title="Edit" onPress={() => this.test(data)}>
                                <Icon name='ios-keypad'></Icon>
                            </Button>
                            <Button style={{backgroundColor: 'red'}} title="Delete" onPress={() => this.deleteTask(data)}>
                                <Icon name='trash'></Icon>
                            </Button>
                        </View>
                    )}
                    leftOpenValue={75}
                    rightOpenValue={-85}
                    keyExtractor={({id}, index) => index.toString()}
                />
            
                <ActionButton
                    buttonColor='#523284'
                    buttonTextStyle={{ color: 'white' }}
                    position='right'
                    onPress={ this.openModal.bind(this) }
                />
                <Overlay 
                    isVisible={this.props.isVisible } //{ this.state.isVisible }
                    width="auto"
                    height="auto"
                    onBackdropPress={() => this.props.dispatch({ type: 'IS_VISIBLE', viewModal: false })}//this.setState({ isVisible: false })}
                    style={{ borderRadius: 25 }}
                >  
                    <CreateReminder
                        reminder=''
                        priority=''
                    />
                </Overlay>
            </View>
        );
    }
}

// Connects you to the redux store to access the data in it. remindersList is one of the varibles
// in the store that we have available
const mapStateToProps = state => ({
    remindersList: state.reminders.remindersList,
    isVisible: state.reminders.isVisible
});

export default connect(mapStateToProps) (RemindersScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F5FC',
        alignItems: 'center',
        justifyContent: 'center',
    },
    rowBack: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
        paddingRight: 15,
    }
});

{/*}
            <SwipeListView
                data={this.state.dataSource}
                renderItem={({item}) => 
                    <CardView task={item.task} status={item.status}/>}
                renderHiddenItem={ (data, rowMap) => (
                    <View style={styles.rowBack}>
                        <Button style={{backgroundColor: '#ffb96e'}} title="Edit"></Button>
                        <Button style={{backgroundColor: 'red'}} title="Delete"></Button>
                    </View>
                )}
                leftOpenValue={75}
                rightOpenValue={-75}
                keyExtractor={({id}, index) => index.toString()}
            />
            <FlatList
                    data={ this.props.remindersList }
                    renderItem={({item}) => 
                        <CardView task={item.task} status={item.status}/>}
                    keyExtractor={({id}, index) => index.toString()}
                />
            <Header style={{ backgroundColor: '#523284', height: 90 }}>
                    <Body >
                        <Title style={{  color: 'white' }}>
                            { this.state.greeting }
                        </Title>
                        <Title style={{  color: 'white' }}>
                            You have { this.props.remindersList.length } Reminder(s)!
                        </Title>
                    </Body>
                </Header>
            */}