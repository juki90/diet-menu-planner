import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import logo from '../assets/logo.svg';
import { routes } from '../routes';
import { logout as logoutAction } from '../actions';
import ReactDOM from 'react-dom';

class Header extends React.Component {
  state = {
    navOpened: false,
  };

  componentDidMount = () => {
    document.addEventListener('click', this.handleClickOutside, true);
  };

  componentWillUnmount = () => {
    document.removeEventListener('click', this.handleClickOutside, true);
  };

  handleNavClick = (e) => {
    const width = document.body.clientWidth;
    if (width < 1024) {
      this.setState((prevState) => ({
        navOpened: !prevState.navOpened,
      }));
    }
  };

  handleClickOutside = (e) => {
    const domNode = ReactDOM.findDOMNode(this);

    if (!domNode || !domNode.contains(e.target)) {
      this.setState({
        navOpened: false,
      });
    }
  };

  render() {
    const { loggedAs, logout, history } = this.props;
    const { navOpened } = this.state;
    return (
      <header>
        <nav className="navbar">
          <div className="container">
            <div className="navbar-brand">
              <Link className="navbar-item" to={routes.home} onClick={this.handleNavClick}>
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
                <Link className="navbar-item" to={routes.dashboard} onClick={this.handleNavClick}>
                  Dashboard
                </Link>
                <Link className="navbar-item" to={routes.meals} onClick={this.handleNavClick}>
                  Meals
                </Link>
                <Link className="navbar-item" to={routes.ingredients} onClick={this.handleNavClick}>
                  Ingredients
                </Link>
                <Link className="navbar-item" to={routes.config} onClick={this.handleNavClick}>
                  Configuration
                </Link>
              </div>
              <div className="navbar-end">
                <div className="navbar-item">
                  <div className="buttons">
                    <Link
                      className="button is-primary"
                      to={routes.register}
                      onClick={this.handleNavClick}
                    >
                      Register
                    </Link>
                    {!loggedAs && (
                      <Link
                        className="button is-light"
                        to={routes.login}
                        onClick={this.handleNavClick}
                      >
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
