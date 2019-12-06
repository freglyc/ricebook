import React from 'react';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import Main from '../../pages/main/Main';
import Posts from '../../pages/main/Posts';
import Status from '../../pages/main/Status';
import Followed from "../../pages/main/Followed";
import NewPost from "../../pages/main/NewPost";

const mockStore = configureMockStore();
const store = mockStore({});

describe("Main Component", () => {
    it('renders without crashing', () => {
        shallow(<Main/>);
    });

    describe('Status Component', () => {
        it('renders without crashing', () => {
            shallow(<Status store={store}/>);
        });
    });

    describe('Followed Component', () => {
        it('renders without crashing', () => {
            shallow(<Followed store={store}/>);
        });
    });

    describe('Posts Component', () => {
        it('renders without crashing', () => {
            shallow(<Posts store={store}/>);
        });
    });

    describe('NewPost Component', () => {
        it('renders without crashing', () => {
            shallow(<NewPost store={store}/>);
        });
    });
});
