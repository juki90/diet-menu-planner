import React from 'react';
import { connect } from 'react-redux';
import 'react-datepicker/dist/react-datepicker.css';
import PropTypes from 'prop-types';
import TimePicker from 'react-time-picker';
import { saveNewMeal as saveNewMealAction, editMeal as editMealAction } from '../actions';

class MealModal extends React.Component {
  state = {
    name: null,
    error: false,
    time: '',
    timeExists: false,
    type: '',
    substances: false,
    ingredients: false,
  };

  times = (() => {
    const { dayId, days } = this.props;
    const [day] = days.filter((d) => d.id === dayId);

    return day.meals.map((m) => {
      return `${
        new Date(m.time).getHours().toString().length === 2
          ? new Date(m.time).getHours()
          : `0${new Date(m.time).getHours()}`
      }:${
        new Date(m.time).getMinutes().toString().length === 2
          ? new Date(m.time).getMinutes()
          : `0${new Date(m.time).getMinutes()}`
      }`;
    });
  })();

  types = (() => {
    const { days, dayId } = this.props;
    const [day] = days.filter((d) => d.id === dayId);

    return day.meals.map((m) => m.type);
  })();

  componentDidMount = () => {
    const html = document.getElementById('document-root');
    html.classList.add('no-overflow');
  };

  componentWillUnmount = () => {
    const html = document.getElementById('document-root');
    html.classList.remove('no-overflow');
  };

  handleNameChange = (e) => {
    this.setState({
      name: e.target.value,
      error: false,
    });
  };

  handleTimeChange = (time) => {
    const { isEdit } = this.props;
    if (!time) {
      return;
    }
    if (this.times.includes(time) && !isEdit) {
      this.setState({
        timeExists: true,
      });
      return;
    }
    this.setState({
      time,
      error: false,
      timeExists: false,
    });
  };

  handleTypeChange = (e) => {
    this.setState({
      type: e.target.value,
    });
  };

  handleSaveMeal = () => {
    const { time, name, type, substances, ingredients } = this.state;
    const {
      close,
      saveNewMeal,
      time: prevTime,
      name: prevName,
      type: prevType,
      days,
      dayId,
      isEdit,
      editMeal,
    } = this.props;
    const parts = time.split(':');
    if (parts.length !== 2 && !isEdit) {
      this.setState({
        error: true,
      });
      return;
    }
    const timeFormat = new Date(days.filter((d) => d.id === dayId)[0].date);
    timeFormat.setHours(parts[0]);
    timeFormat.setMinutes(parts[1]);
    if (
      (isEdit && !time && !name && !type && timeFormat !== prevTime) ||
      (!isEdit && (!time || !name || !type))
    ) {
      this.setState({
        error: true,
      });
      return;
    }

    if (isEdit) {
      this.setState({
        timeExists: false,
        error: false,
        substances: false,
        ingredients: false,
      });
      editMeal(
        dayId,
        {
          type: type || prevType,
          name: name || prevName,
          time: time ? timeFormat : prevTime,
        },
        prevType,
      );
      close();
      return;
    }

    if (!this.times.includes(time)) {
      this.setState({
        timeExists: false,
        error: false,
        substances: false,
        ingredients: false,
      });
      saveNewMeal(dayId, {
        type,
        name,
        time: timeFormat,
        substances: substances || {},
        ingredients: ingredients || [],
      });
      close();
    }
  };

  handleFromBookmarks = (e) => {
    const { savedMeals } = this.props;
    const [meal] = savedMeals.filter((m) => m.name === e.target.value);
    if (!e.target.value || !meal) {
      this.setState({
        name: '',
        substances: false,
        ingredients: false,
      });
      return;
    }

    if (e.target.value) {
      this.setState({
        name: meal.name,
        substances: meal.substances,
        ingredients: meal.ingredients,
      });
    }
  };

  render() {
    const { name, time, error, timeExists, substances, ingredients } = this.state;
    const { isEdit, close, savedMeals } = this.props;

    return (
      <div className="modal">
        <div className="modal-background"> </div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-header-title is-size-4">{isEdit ? 'Edit meal' : 'Add new meal'}</p>
            <button type="button" className="delete" aria-label="close" onClick={close} />
          </header>
          <section>
            <div className="columns">
              <div className="column is-half">
                <div className="control">
                  <label htmlFor="meal-name" className="is-size-5 has-text-weight-semibold">
                    Name of meal:
                    <input
                      id="meal-name"
                      className="input"
                      type="text"
                      onChange={this.handleNameChange}
                      value={name}
                    />
                  </label>
                </div>
                <div className="control">
                  <p className="is-size-5 has-text-weight-semibold">
                    Time of meal:
                    <TimePicker
                      className="input"
                      id="meal-time"
                      onChange={this.handleTimeChange}
                      value={time}
                      maxDetail="minute"
                      clearIcon={null}
                    />
                  </p>
                </div>
                <div className="control">
                  <label htmlFor="meal-type" className="is-size-5 has-text-weight-semibold">
                    Select type of meal
                    <div className="select">
                      <select onChange={this.handleTypeChange} id="meal-type">
                        <option value={null}>Select meal&apos;s type</option>
                        {!this.types.includes('Breakfast') && (
                          <option value="Breakfast">Breakfast</option>
                        )}
                        {!this.types.includes('Second breakfast') && (
                          <option value="Second breakfast">Second Breakfast</option>
                        )}
                        {!this.types.includes('Lunch') && <option value="Lunch">Lunch</option>}
                        {!this.types.includes('Dinner') && <option value="Dinner">Dinner</option>}
                        {!this.types.includes('Snack 1') && (
                          <option value="Snack 1">Snack 1</option>
                        )}
                        {!this.types.includes('Snack 2') && (
                          <option value="Snack 2">Snack 2</option>
                        )}
                        {!this.types.includes('Snack 3') && (
                          <option value="Snack 3">Snack 3</option>
                        )}
                        {!this.types.includes('Supper') && <option value="Supper">Supper</option>}
                      </select>
                    </div>
                  </label>
                </div>
              </div>
              <div className="column is-half">
                <div className="control">
                  <label htmlFor="meal-bookmarks" className="is-size-5 has-text-weight-semibold">
                    Select from bookmarks
                    <div className="select">
                      <select onChange={this.handleFromBookmarks} id="meal-bookmarks">
                        <option>None</option>
                        {savedMeals.map((m) => (
                          <option value={m.name}>{m.name}</option>
                        ))}
                      </select>
                    </div>
                  </label>
                </div>
                {substances && ingredients && (
                  <p className="has-text-link is-size-5">
                    <span className="has-text-weight-semibold">
                      Following ingredients will be applied:{' '}
                    </span>
                    <br />
                    {ingredients.map((i) => (
                      <>
                        <span>
                          {i.name} - {i.quantity}g
                        </span>
                        <br />
                      </>
                    ))}
                  </p>
                )}
              </div>
            </div>
            {error && <p className="has-text-danger">Fill all fields correctly</p>}
            {timeExists && <p className="has-text-danger">This time has already meal</p>}
            <br />
            <button type="submit" className="button is-success" onClick={close}>
              Back
            </button>
            <button type="submit" className="button is-info" onClick={this.handleSaveMeal}>
              Save
            </button>
          </section>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  saveNewMeal: (dayId, properties) => dispatch(saveNewMealAction(dayId, properties)),
  editMeal: (dayId, properties, prevType) => dispatch(editMealAction(dayId, properties, prevType)),
});

const mapStateToProps = (state) => {
  const { days, savedMeals } = state;
  return {
    days,
    savedMeals,
  };
};

MealModal.propTypes = {
  saveNewMeal: PropTypes.func.isRequired,
  editMeal: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  dayId: PropTypes.number.isRequired,
  isEdit: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  days: PropTypes.arrayOf(PropTypes.object).isRequired,
  savedMeals: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(MealModal);
