import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack'
import RemindersScreen from '../screens/Reminders/RemindersScreen';
import Initializing from '../screens/Initializing';
import CreateReminder from '../screens/Reminders/CreateReminder';


export const ReminderList = createStackNavigator({
    defaultName: {
        screen: RemindersScreen,
        navigationOptions: {
            header: null
        }
    }
});

export const Create = createStackNavigator({
    defaultName: {
        screen: CreateReminder,
        navigationOptions: {
            header: null
        }
    }
});

export const InitializeScreen = createSwitchNavigator(
    {
        Initialize: Initializing,
        Reminders: ReminderList,
        CreateReminders: Create
    },
    {
        initialRouteName: 'Initialize',
    }
);

const InitialScreen = createAppContainer(InitializeScreen);
export default InitialScreen; 