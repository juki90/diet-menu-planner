import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { routes } from '../routes';
import { removeDay as removeDayAction } from '../actions';
import RemoveModal from './RemoveModal';
import DayModal from './DayModal';

class DayNote extends React.Component {
  state = {
    removeModalShow: false,
    editModalShow: false,
  };

  handleEditButton = (e) => {
    e.preventDefault();
    this.setState({
      editModalShow: true,
    });
  };

  handleRemoveButton = (e) => {
    e.preventDefault();
    this.setState({
      removeModalShow: true,
    });
  };

  handleBackButton = () => {
    this.setState({
      editModalShow: false,
    });
  };

  handleRemoveModal = (sure) => {
    const { identity, removeDay } = this.props;
    if (sure) {
      removeDay(identity);
    }
    this.setState({
      removeModalShow: false,
    });
  };

  render() {
    const { children, path, date, substances, config, identity } = this.props;
    const { removeModalShow, editModalShow } = this.state;
    const numdate = new Date(date);
    return (
      <>
        {removeModalShow && (
          <RemoveModal
            title="Are you sure?"
            subtitle="Do you really want to remove this day?"
            click={this.handleRemoveModal}
          />
        )}
        {editModalShow && (
          <DayModal
            title="Change day's date"
            subtitle="Enter the new date for this day"
            date={date}
            close={this.handleBackButton}
            dayId={identity}
            isEdit
          />
        )}
        <div className="box day-box">
          <header className="card-header">
            <h2 className="card-header-title is-size-4">
              {`${numdate.getFullYear()}.${
                numdate.getMonth().toString().length === 2
                  ? numdate.getMonth() + 1
                  : `0${numdate.getMonth() + 1}`
              }.${
                numdate.getDate().toString().length === 2
                  ? numdate.getDate()
                  : `0${numdate.getDate()}`
              }`}
            </h2>
            <div className="is-pulled-right has-text-right">
              <a href={`/dashboard/days${path}`} className="card-header-item">
                Show
              </a>
              <a
                href={routes.dashboard}
                onClick={this.handleEditButton}
                className="card-header-item"
              >
                Edit
              </a>
              <a
                href={routes.dashboard}
                onClick={this.handleRemoveButton}
                className="card-header-item has-text-danger"
              >
                Remove
              </a>
            </div>
          </header>
          <div className="card-content">
            <div className="content">{children}</div>
          </div>
          <footer className="card-footer ingredients">
            <p className="card-footer-item is-size-7">
              Proteins:
              {substances.proteins < config.Pmin && (
                <strong className="has-text-danger"> {substances.proteins}g (L)</strong>
              )}
              {substances.proteins > config.Pmax && (
                <strong className="has-text-danger"> {substances.proteins}g (H)</strong>
              )}
              {substances.proteins > config.Pmin && substances.proteins < config.Pmax && (
                <strong> {substances.proteins}g</strong>
              )}
            </p>
            <p className="card-footer-item is-size-7">
              Fats:
              {substances.fats < config.Fmin && (
                <strong className="has-text-danger"> {substances.fats}g (L)</strong>
              )}
              {substances.fats > config.Fmax && (
                <strong className="has-text-danger"> {substances.fats}g (H)</strong>
              )}
              {substances.fats > config.Fmin && substances.fats < config.Fmax && (
                <strong> {substances.fats}g</strong>
              )}
            </p>
            <p className="card-footer-item is-size-7">
              Carbs:
              {substances.carbs < config.Cmin && (
                <strong className="has-text-danger"> {substances.carbs}g (L)</strong>
              )}
              {substances.carbs > config.Cmax && (
                <strong className="has-text-danger"> {substances.carbs}g (H)</strong>
              )}
              {substances.carbs > config.Cmin && substances.carbs < config.Cmax && (
                <strong> {substances.carbs}g</strong>
              )}
            </p>
            <p className="card-footer-item is-size-7">
              Calories:
              {substances.calories < config.BMR - 100 + 300 * config.goal && (
                <strong className="has-text-danger"> {substances.calories}g (L)</strong>
              )}
              {substances.calories > config.BMR + 100 + 300 * config.goal && (
                <strong className="has-text-danger"> {substances.calories}g (H)</strong>
              )}
              {substances.calories > config.BMR - 100 + 300 * config.goal &&
                substances.calories < config.BMR + 100 + 300 * config.goal && (
                  <strong> {substances.calories} kcal</strong>
                )}
            </p>
          </footer>
        </div>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  removeDay: (id) => dispatch(removeDayAction(id)),
});

DayNote.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  date: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  identity: PropTypes.number.isRequired,
  removeDay: PropTypes.func.isRequired,
  substances: PropTypes.shape({
    proteins: PropTypes.number,
    fats: PropTypes.number,
    carbs: PropTypes.number,
    calories: PropTypes.number,
  }),
  config: PropTypes.shape({
    Pmin: PropTypes.number.isRequired,
    Pmax: PropTypes.number.isRequired,
    Fmin: PropTypes.number.isRequired,
    Fmax: PropTypes.number.isRequired,
    Cmin: PropTypes.number.isRequired,
    Cmax: PropTypes.number.isRequired,
    BMR: PropTypes.number.isRequired,
    goal: PropTypes.number.isRequired,
  }).isRequired,
};

DayNote.defaultProps = {
  substances: {
    proteins: 0,
    fats: 0,
    carbs: 0,
    calories: 0,
  },
};

export default connect(null, mapDispatchToProps)(DayNote);
