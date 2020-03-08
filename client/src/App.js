import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { CSSTransition, TransitionGroup } from "react-transition-group";

// routes
import Routes from "./components/routing/Routes";

import "./App.scss";

import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";

// redux
import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./actions/auth";
import setAuthToken from "./utils/setAuthToken";

if (localStorage.token) {
    setAuthToken(localStorage.token);
}

const App = () => {
    useEffect(() => {
        store.dispatch(loadUser());
    }, []);

    return (
        <Provider store={store}>
            <Router>
                <Navbar />
                <Route
                    render={({ location }) => (
                        <TransitionGroup component={null} className="page">
                            <CSSTransition
                                key={location.key}
                                timeout={{
                                    enter: 300,
                                    exit: 0,
                                    appear: 300
                                }}
                                classNames="fade"
                                unmountOnExit
                            >
                                <Switch>
                                    <Route exact path="/" component={Landing} />
                                    <Route component={Routes} />
                                </Switch>
                            </CSSTransition>
                        </TransitionGroup>
                    )}
                />
            </Router>
        </Provider>
    );
};

export default App;
