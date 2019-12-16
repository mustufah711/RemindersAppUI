import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableHighlight,
ActivityIndicator, FlatList, TextInput, RefreshControl } from 'react-native';
import axios from 'axios';
import { Header, Body, Title, Button, Icon } from 'native-base'
import ActionButton from 'react-native-action-button'
import CardView from './CardView';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Overlay } from 'react-native-elements';
import CreateReminder from './CreateReminder';
import { connect } from 'react-redux';


class RemindersScreen extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            isLoading: true,
            isVisible: false,
            task: '',
            priority: '',
            greeting: '',
            chosenDate: new Date()
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
    }

    async getReminders() {
        this.renderWelcomeMsg();
        return await fetch('http://192.168.1.219:4567/tasks')
            .then((response) => response.json())
            .then((responseJson) => {
            this.setState({
                isLoading: false,
                dataSource: responseJson.tasks,
            }, function(){
                if (this.state.dataSource === undefined) {
                    this.setState({
                        noTasks: true,
                    })
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
                <SwipeListView
                    data={this.props.remindersList}
                    renderItem={({item}) => 
                        <CardView task={item.task} status={item.status}/>}
                        renderHiddenItem={ (data, rowMap) => (
                        <View style={styles.rowBack}>
                            <Button style={{backgroundColor: 'green'}} title="Edit">
                            <Icon name='ios-keypad'></Icon>
                            </Button>
                            <Button style={{backgroundColor: 'red'}} title="Delete">
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
                    width="75%"
                    height="60%"
                    onBackdropPress={() => this.props.dispatch({ type: 'IS_VISIBLE', viewModal: false })}//this.setState({ isVisible: false })}
                    style={{ borderRadius: 10 }}
                >  
                    <CreateReminder></CreateReminder>
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
})

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
            */}