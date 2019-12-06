import React from 'react';
import { render } from "react-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import AllRoutes from './routes/Routes'

import * as serviceWorker from './serviceWorker';

render(
    <Provider store={store}>
        <AllRoutes />
    </Provider>,
    document.getElementById("root")
);
serviceWorker.unregister(); 
