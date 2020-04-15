import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { login as loginAction } from '../actions';
import { routes } from '../routes';

class Login extends React.Component {
  state = {
    error: '',
    email: '',
    password: '',
    loginError: false,
  };

  handleInputChange = (e) => {
    const [, attr] = e.target.getAttribute('id').split('-');
    this.setState({
      error: '',
      loginError: false,
      [attr]: e.target.value,
    });
  };

  handleLoginButton = () => {
    const { email, password } = this.state;
    const { login, history } = this.props;
    if (!email || !password) {
      this.setState({
        error: 'Provide correct data and try again',
      });
      return;
    }

    login(
      email,
      password,
      (e) => {
        this.setState({ loginError: e });
      },
      () => {
        history.push(routes.dashboard);
      },
    );
  };

  render() {
    const { email, password, error, loginError } = this.state;
    return (
      <div className="card-form">
        <div className="card">
          <div className="card-content has-text-centered">
            <p className="title">Log in</p>
            <p className="subtitle">
              Please, log in filling your e-mail address and password given by registration.
            </p>
            <div className="field has-text-left">
              <p className="control has-icons-left has-icons-right">
                <label className="label" htmlFor="user-email">
                  User e-mail address
                  <input
                    id="user-email"
                    className="input"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={this.handleInputChange}
                  />
                  <span className="icon is-small is-left">
                    <i className="fas fa-envelope" />
                  </span>
                  <span className="icon is-small is-right">
                    <i className="fas fa-check" />
                  </span>
                </label>
              </p>
            </div>
            <div className="field has-text-left">
              <p className="control has-icons-left">
                <label className="label" htmlFor="user-password">
                  User password
                  <input
                    id="user-password"
                    className="input"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={this.handleInputChange}
                  />
                  <span className="icon is-small is-left">
                    <i className="fas fa-lock" />
                  </span>
                </label>
              </p>
              {error && <p className="has-text-danger">{error}</p>}
              {loginError && <p className="has-text-danger">{loginError}</p>}
            </div>
            <div className="field">
              <p className="control">
                <button
                  className="button is-success"
                  type="submit"
                  onClick={this.handleLoginButton}
                >
                  Login
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
  history: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  login: (email, password, error, loginSuccess) =>
    dispatch(loginAction(email, password, error, loginSuccess)),
});

export default withRouter(connect(null, mapDispatchToProps)(Login));
