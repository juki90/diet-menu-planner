import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { register as registerAction } from '../actions';
import { routes } from '../routes';

class Register extends React.Component {
  state = {
    errorPswd: false,
    errorEmail: false,
    password: '',
    password2: '',
    email: '',
    registerError: false,
  };

  handleInputChange = (e) => {
    const [, attr] = e.target.getAttribute('id').split('-');
    if (attr === 'email') {
      this.setState({
        errorEmail: false,
        registerError: false,
        [attr]: e.target.value,
      });
      return;
    }
    this.setState({
      errorPswd: false,
      [attr]: e.target.value,
    });
  };

  handleInputBlur = (e) => {
    const { password, password2, email } = this.state;
    const [, attr] = e.target.getAttribute('id').split('-');
    if (attr === 'email' && !/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email) && email) {
      this.setState({
        errorEmail: true,
      });
      return;
    }
    if (
      (attr === 'password2' || (attr === 'password' && password && password2)) &&
      (password !== password2 || password.length < 8 || password2.length < 8)
    ) {
      this.setState({
        errorPswd: true,
      });
    }
  };

  handleRegisterButton = () => {
    const { errorEmail, errorPswd, email, password, password2 } = this.state;
    const { state, register, history } = this.props;
    if (errorEmail || errorPswd || !email || !password || !password2) {
      return;
    }

    register(
      email,
      password,
      state,
      (e) => {
        this.setState({ registerError: e });
      },
      () => {
        history.push(routes.dashboard);
      },
    );
  };

  render() {
    const { password, password2, email, errorPswd, errorEmail, registerError } = this.state;
    return (
      <div className="card-form">
        <div className="card">
          <div className="card-content has-text-centered">
            <p className="title">Registration</p>
            <p className="subtitle">
              You only need to provide e-mail address and password to create account and
              automatically log in. All days and meals you provided before registration will be
              added to your accout.
            </p>
            <div className="field has-text-left">
              <p className="control has-icons-left has-icons-right">
                <label className="label" htmlFor="user-email">
                  User e-mail address
                  <input
                    className="input"
                    id="user-email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={this.handleInputChange}
                    onBlur={this.handleInputBlur}
                  />
                  <span className="icon is-small is-left">
                    <i className="fas fa-envelope" />
                  </span>
                </label>
              </p>
              {errorEmail && <p className="has-text-danger">This is not valid email address</p>}
            </div>
            <div className="field has-text-left">
              <p className="control has-icons-left">
                <label className="label" htmlFor="user-password">
                  User password
                  <input
                    className="input"
                    id="user-password"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={this.handleInputChange}
                    onBlur={this.handleInputBlur}
                  />
                  <span className="icon is-small is-left">
                    <i className="fas fa-lock" />
                  </span>
                </label>
              </p>
            </div>
            <div className="field has-text-left">
              <p className="control has-icons-left">
                <label className="label" htmlFor="user-password2">
                  Confirm password
                  <input
                    className="input"
                    id="user-password2"
                    type="password"
                    placeholder="Repeat password"
                    value={password2}
                    onChange={this.handleInputChange}
                    onBlur={this.handleInputBlur}
                  />
                  <span className="icon is-small is-left">
                    <i className="fas fa-lock" />
                  </span>
                </label>
              </p>
              {errorPswd && (
                <p className="has-text-danger">
                  Password must match in both fields and consist at least of 8 characters
                </p>
              )}
            </div>
            <div className="field">
              <p className="control">
                <button
                  className="button is-success"
                  type="submit"
                  onClick={this.handleRegisterButton}
                >
                  Register
                </button>
              </p>
              {registerError && <p className="has-text-danger">{registerError}</p>}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Register.propTypes = {
  register: PropTypes.func.isRequired,
  history: PropTypes.arrayOf(PropTypes.string).isRequired,
  state: PropTypes.shape({
    days: PropTypes.arrayOf(PropTypes.object).isRequired,
    savedMeals: PropTypes.arrayOf(PropTypes.object).isRequired,
    savedIngredients: PropTypes.arrayOf(PropTypes.object).isRequired,
    history: PropTypes.arrayOf(PropTypes.string).isRequired,
    config: PropTypes.shape({
      BMR: PropTypes.number.isRequired,
      goal: PropTypes.number.isRequired,
      ratioP: PropTypes.number.isRequired,
      ratioF: PropTypes.number.isRequired,
      ratioC: PropTypes.number.isRequired,
      Pmin: PropTypes.number.isRequired,
      Pmax: PropTypes.number.isRequired,
      Fmin: PropTypes.number.isRequired,
      Fmax: PropTypes.number.isRequired,
      Cmin: PropTypes.number.isRequired,
      Cmax: PropTypes.number.isRequired,
    }),
    loggedAs: PropTypes.string,
  }).isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  register: (email, password, state, registerErr, registerSuccess) =>
    dispatch(registerAction(email, password, state, registerErr, registerSuccess)),
});

const mapStateToProps = (state) => {
  return {
    state,
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Register));
