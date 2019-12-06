import {
    RESET, SET_USERNAME, SET_DISPLAY, SET_STATUS, SET_FOLLOWING,
    SET_BIRTH, SET_EMAIL, SET_PHONE, SET_ZIP, SET_AVATAR, SET_ARTICLES, ADD_ARTICLES
} from "../constants/action-types";

const initialState = {
    username: "",
    display: "",
    status: "",
    following: [],
    birth: "",
    email: "",
    phone: "",
    zip: "",
    avatar: "",
    articles: []
};

function rootReducer(state = initialState, action) {
    switch (action.type) {
        case RESET:
            return initialState;
        case SET_USERNAME:
            return Object.assign({}, state, { username: action.payload });
        case SET_DISPLAY:
            return Object.assign({}, state, { display: action.payload });
        case SET_STATUS:
            return Object.assign({}, state, { status: action.payload });
        case SET_FOLLOWING:
            return Object.assign({}, state, { following: action.payload });
        case SET_BIRTH:
            return Object.assign({}, state, { birth: action.payload });
        case SET_EMAIL:
            return Object.assign({}, state, { email: action.payload });
        case SET_PHONE:
            return Object.assign({}, state, { phone: action.payload });
        case SET_ZIP:
            return Object.assign({}, state, { zip: action.payload });
        case SET_AVATAR:
            return Object.assign({}, state, { avatar: action.payload });
        case SET_ARTICLES:
            return Object.assign({}, state, { articles: action.payload });
        case ADD_ARTICLES:
            return Object.assign({}, state, { 
                articles: JSON.parse(JSON.stringify(state.articles)).concat(action.payload)
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            });
        default:
            return state;
    }
}

export default rootReducer;