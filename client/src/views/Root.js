import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { routes } from '../routes';
import Header from '../templates/Header';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import SavedMeals from './SavedMeals';
import SavedIngredients from './SavedIngredients';
import Configuration from './Configuration';
import Day from './Day';
import store from '../store';

const Root = () => (
  <Provider store={store.store}>
    <PersistGate persistor={store.persistor}>
      <Router>
        <Header />
        <main>
          <div className="container">
            <Switch>
              <Route exact path={routes.home}>
                <Redirect to={routes.dashboard} />
              </Route>
              <Route exact path={routes.login} component={Login} />
              <Route exact path={routes.register} component={Register} />
              <Route exact path={routes.dashboard} component={Dashboard} />
              <Route exact path={routes.meals} component={SavedMeals} />
              <Route exact path={routes.ingredients} component={SavedIngredients} />
              <Route exact path={routes.config} component={Configuration} />
              <Route exact path={routes.day} component={Day} />
            </Switch>
          </div>
        </main>
      </Router>
    </PersistGate>
  </Provider>
);

export default Root;
