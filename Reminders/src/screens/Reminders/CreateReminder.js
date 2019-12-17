import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableHighlight,
ActivityIndicator, FlatList, Button, TextInput, Alert } from 'react-native';
import axios from 'axios';
import { Overlay } from 'react-native-elements';
import { Header, Body, Title, DatePicker } from 'native-base'
import { connect } from 'react-redux'


class CreateReminder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            task: '',
            priority: '',
            chosenDate: new Date(),
            uniqueValue: 1
        }
        this.setDate = this.setDate.bind(this);
    }
    setDate(newDate) {
        this.setState({ chosenDate: newDate });
    }
    submitTask() {
        const taskData = {
            task: this.state.task,
            priority: this.state.priority,
            status: 'Not Completed'
        }
        axios.post('http://192.168.1.219:4567/tasks', { 
            task: this.state.task,
            priority: this.state.priority,
            status: 'Not Completed'
         })
            .then(res => {
                if(res.data.responseStatus === 'Added Successfully') {
                    this.props.dispatch({ type: 'ADD_REMINDER', addNewReminder: taskData })
                    this.props.dispatch({ type: 'IS_VISIBLE', viewModal: false })
                }
        })
    }

    render() {
        return(
            <View>
                <Text>Hello Child: { this.props.remindersList.length}</Text>
                <TextInput
                    onChangeText={(val)=> this.setState({ task: val })}
                    style={styles.input} placeholder="Task" textAlign={'center'} underlineColorAndroid={'transparent'}
                />
                <TextInput
                    onChangeText={(val)=> this.setState({ priority: val })}
                    style={styles.input} placeholder="Priority" textAlign={'center'} underlineColorAndroid={'transparent'}
                />
                <DatePicker
                    defaultDate={new Date()}
                    minimumDate={new Date()}
                    locale={"en"}
                    timeZoneOffsetInMinutes={undefined}
                    modalTransparent={false}
                    animationType={"fade"}
                    androidMode={"default"}
                    placeHolderText="Select date"
                    textStyle={{ color: "green" }}
                    placeHolderTextStyle={{ color: "#d3d3d3" }}
                    onDateChange={this.setDate}
                    disabled={false}
                />
                <Text>
                    Date: {this.state.chosenDate.toString().substr(4, 12)}
                </Text>
                <Button 
                    title='Submit'
                    style={styles.button}
                    onPress={this.submitTask.bind(this)}
                ></Button>
            </View>
        )
    }
}

const mapStateToProps = state => ({
    remindersList: state.reminders.remindersList,
    isVisible: state.reminders.isVisible
})

export default  connect(mapStateToProps) (CreateReminder)

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ffffff',
      width: null,
      height: null
    },
    input: {
      height: 50,
      width: 300,
      marginTop: 10,
      padding: 4,
      fontSize: 18,
      borderWidth: 1,
      borderColor: 'red',
      justifyContent: 'center',
      backgroundColor: '#ffffff',
      borderRadius: 25
    },
    button: {
      height: 50,
      backgroundColor: 'red',
      //alignSelf: 'stretch',
      width: 300,
      marginTop: 20,
      justifyContent: 'center',
      borderRadius: 25
    },
    buttonText: {
      fontSize: 22,
      color: '#FFF',
      alignSelf: 'center'
    },
    registerLink: {
      margin: 10,
      color: 'yellow'
    }
  })