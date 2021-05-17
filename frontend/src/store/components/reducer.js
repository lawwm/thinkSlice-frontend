import { SET_ALERT, REMOVE_ALERT } from './actionTypes';

const initialState = {
    alertArray: []
};

export const component = (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case SET_ALERT:
            return { ...state, alertArray: [...state.alertArray, payload] };
        case REMOVE_ALERT:
            return { ...state, alertArray: state.alertArray.filter(alert => alert.id !== payload) };
        default:
            return state;
    }
}
