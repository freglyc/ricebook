import React from 'react';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store'
import Landing from '../../pages/landing/Landing';
import Login from '../../pages/landing/Login';
import Register from '../../pages/landing/Register';

const mockStore = configureMockStore();
const store = mockStore({});

describe("Landing Component", () => {
    it('renders without crashing', () => {
        shallow(<Landing store={store}/>);
    });

    describe("Login Component", () => {
        it('renders without crashing', () => {
            shallow(<Login store={store}/>);
        });
    });

    describe("Register Component", () => {
        it('renders without crashing', () => {
            shallow(<Register store={store}/>);
        });
    });
});


