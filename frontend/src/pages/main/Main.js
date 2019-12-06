import React from 'react';
import Navbar from '../../common/Navbar';
import Status from "./Status";
import Followed from "./Followed";
import Articles from "./Posts"
import NewPost from "./NewPost"
import '../../style.css';

class Main extends React.Component {
    render() {
        return (
            <div>
                <Navbar/>
                <div className="container">
                    <div className="row" id="main">
                        <div className="col">
                            <div className="stick">
                                <Status/>
                                <Followed/>
                            </div>
                        </div>
                        <div className="col-6">
                           <Articles/>
                        </div>
                        <div className="col">
                            <div className="stick">
                                <NewPost/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Main;
