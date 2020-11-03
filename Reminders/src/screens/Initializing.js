import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native'

export default class Initializing extends Component {
  
  async componentDidMount() {
    try {
      this.timeoutHandle = setTimeout(()=>{
        this.props.navigation.navigate('Reminders');
      }, 2300);
    }catch(error){
        
    }
  }
  
  async componentWillUnmount() {
    clearTimeout(this.timeoutHandle); 
  }

  render() {
      return (
          <View style={styles.container}>
          </View>
      )
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      //backgroundColor: '#523284'
    }
})