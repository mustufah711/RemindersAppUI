const initialState = {
    remindersList: [],
    isVisible: false
}

const reminders = (state = initialState, action) => {
    switch(action.type) {
        case 'ADD_REMINDER':
           return {
               ...state,
               remindersList: state.remindersList.concat(action.addNewReminder)
           }
        case 'ADD_ALL_REMINDERS': 
            return Object.assign({}, state, {
                remindersList: action.addReminders
            })
        case 'IS_VISIBLE':
            return Object.assign({}, state, {
                isVisible: action.viewModal
            })
        default:
            return state;
    }
}
export default reminders;