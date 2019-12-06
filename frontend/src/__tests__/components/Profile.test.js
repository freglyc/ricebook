import React from 'react';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store'
import Profile from "../../pages/profile/Profile";

const mockStore = configureMockStore();
const store = mockStore({});

describe("Profile Component", () => {
    it('renders without crashing', () => {
        shallow(<Profile store={store}/>);
    });
});
