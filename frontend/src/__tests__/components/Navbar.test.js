import React from 'react';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store'
import Navbar from "../../common/Navbar"

const mockStore = configureMockStore();
const store = mockStore({});

describe("Navbar Component", () => {
    it('renders without crashing', () => {
        shallow(<Navbar store={store}/>);
    });
});
