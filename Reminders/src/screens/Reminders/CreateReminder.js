import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import axios from 'axios';
import { DatePicker, Button } from 'native-base'
import { connect } from 'react-redux'


class CreateReminder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            task: '',
            priority: '',
            chosenDate: new Date(),
            uniqueValue: 1
        };
        this.setDate = this.setDate.bind(this);
    }
    setDate(newDate) {
        this.setState({ chosenDate: newDate });
    }
    submitTask() {
        const taskData = {
            id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
            task: this.state.task,
            priority: this.state.priority,
            status: 'Not Completed',
        };
        axios.post('http://192.168.1.51:4567/tasks', {
            id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
            task: this.state.task,
            priority: this.state.priority,
            status: 'Not Completed'
         })
            .then(res => {
                if(res.data.responseStatus === 'Added Successfully') {
                    this.props.dispatch({ type: 'ADD_REMINDER', addNewReminder: taskData });
                    this.props.dispatch({ type: 'IS_VISIBLE', viewModal: false });
                }
        })
    }

    render() {
        return(
            <View >
                <Text style={{fontSize: 18, marginBottom: 15 }}>Reminder</Text>
                <TextInput
                    onChangeText={(val)=> this.setState({ task: val })}
                    style={ styles.textInput } placeholder="Reminder Name" underlineColorAndroid={'transparent'}
                >{ this.props.reminder }</TextInput>
                <Text style={{fontSize: 18, marginBottom: 15 }}>Priority</Text>
                <TextInput
                    onChangeText={(val)=> this.setState({ priority: val })}
                    style={ styles.textInput } placeholder="Priority" underlineColorAndroid={'transparent'}
                />
                <Text style={{fontSize: 18, marginBottom: 15 }}>
                    Select Date
                </Text>
                <DatePicker
                    defaultDate={new Date()}
                    minimumDate={new Date()}
                    locale={"en"}
                    timeZoneOffsetInMinutes={undefined}
                    modalTransparent={false}
                    animationType={"fade"}
                    androidMode={"default"}
                    placeHolderText="Reminder Date"
                    textStyle={{ color: "green" }}
                    placeHolderTextStyle={{ color: "#d3d3d3" }}
                    onDateChange={this.setDate}
                    disabled={false}
                />
                <Button 
                    style={styles.button}
                    onPress={this.submitTask.bind(this)}
                ><Text style={{ color: 'white' }}>Submit</Text></Button>
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
    /*input: {
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
    },*/
    textInput: {
        fontSize: 15,
        marginBottom: 15,
        borderColor: 'gray',
        borderWidth: 1,
        padding: 11
    },
    button: {
      height: 50,
      backgroundColor: '#523284',
      width: 300,
      marginTop: 20,
      justifyContent: 'center',
      borderRadius: 25,
      color: 'white'
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