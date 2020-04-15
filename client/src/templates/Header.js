import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import logo from '../assets/logo.svg';
import { routes } from '../routes';
import { logout as logoutAction } from '../actions';

class Header extends React.Component {
  state = {
    navOpened: false,
  };

  handleNavClick = () => {
    this.setState((prevState) => ({
      navOpened: !prevState.navOpened,
    }));
  };

  render() {
    const { loggedAs, logout, history } = this.props;
    const { navOpened } = this.state;
    return (
      <header>
        <nav className="navbar">
          <div className="container">
            <div className="navbar-brand">
              <Link className="navbar-item" to={routes.home}>
                <img src={logo} alt="Diet menu planner logo" />
                <span className="navbar-title">Diet menu planner</span>
              </Link>
              <button
                type="button"
                className="navbar-burger burger"
                aria-label="menu"
                aria-expanded={`${navOpened}`}
                data-target="mainNavbar"
                onClick={this.handleNavClick}
              >
                <span aria-hidden="true" />
                <span aria-hidden="true" />
                <span aria-hidden="true" />
              </button>
            </div>
            <div id="mainNavbar" className={`navbar-menu ${navOpened ? 'active' : ''}`}>
              <div className="navbar-start">
                <Link className="navbar-item" to={routes.dashboard}>
                  Dashboard
                </Link>
                <Link className="navbar-item" to={routes.meals}>
                  Meals
                </Link>
                <Link className="navbar-item" to={routes.ingredients}>
                  Ingredients
                </Link>
                <Link className="navbar-item" to={routes.config}>
                  Configuration
                </Link>
              </div>
              <div className="navbar-end">
                <div className="navbar-item">
                  <div className="buttons">
                    <Link className="button is-primary" to={routes.register}>
                      Register
                    </Link>
                    {!loggedAs && (
                      <Link className="button is-light" to={routes.login}>
                        Log in
                      </Link>
                    )}
                    {loggedAs && (
                      <button
                        onClick={() => {
                          logout();
                          history.push(routes.dashboard);
                        }}
                        type="button"
                        className="button is-light"
                      >
                        Log out
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logoutAction()),
});

const mapStateToProps = (state) => {
  const { loggedAs } = state;
  return {
    loggedAs,
  };
};

Header.propTypes = {
  logout: PropTypes.func.isRequired,
  loggedAs: PropTypes.string,
  history: PropTypes.arrayOf(PropTypes.string).isRequired,
};

Header.defaultProps = {
  loggedAs: '',
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
