import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Card from '../templates/Card';
import IngredientSnippet from '../components/IngredientSnippet';
import MealNote from '../components/MealNote';
import MealModal from '../components/MealModal';

class Day extends React.Component {
  state = {
    modalOpened: false,
  };

  handleAddNew = (e) => {
    e.preventDefault();
    this.setState({
      modalOpened: true,
    });
  };

  handleCloseModal = () => {
    this.setState({
      modalOpened: false,
    });
  };

  render() {
    const { days, match } = this.props;
    const { modalOpened } = this.state;
    const dayParam = match.params.day;
    const thisDate = `/${dayParam}`;
    const thisDay = days.filter((d) => d.path === thisDate)[0];

    const mealList = !thisDay.meals.length ? (
      <p className="subtitle is-size-4 has-text-centered">No meals in this day yet</p>
    ) : (
      thisDay.meals.map((m) => {
        const ingredientList = !m.ingredients.length ? (
          <p className="subtitle is-size-4 has-text-centered">No ingredients in this meal yet</p>
        ) : (
          m.ingredients.map((i) => (
            <IngredientSnippet
              key={`${i.name}-${m.time}`}
              name={i.name}
              substances={i.substances}
              ingredientNames={m.ingredients.map((v) => v.name)}
              quantity={i.quantity}
              path={i.path}
              mealType={m.type}
              dayId={thisDay.id}
            />
          ))
        );
        return (
          <MealNote
            key={`mn${m.time}`}
            substances={m.substances}
            ingredients={m.ingredients}
            name={m.name}
            time={m.time}
            path={m.path}
            type={m.type}
            dayId={thisDay.id}
            days={days}
          >
            {ingredientList}
          </MealNote>
        );
      })
    );
    return (
      <>
        {modalOpened && <MealModal days={days} dayId={thisDay.id} close={this.handleCloseModal} />}
        <Card title={`Day ${dayParam}`} subtitle="Organize your meals in this day">
          <div className="add-new has-text-centered">
            <p className="subtitle has-text-centered">Add new meal to this day:</p>
            <button type="button" className="button" onClick={this.handleAddNew}>
              Add meal
            </button>
          </div>
          {mealList}
        </Card>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  const { days } = state;
  return {
    days,
  };
};

Day.propTypes = {
  days: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.shape({
    params: PropTypes.object.isRequired,
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    isExact: PropTypes.bool.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps)(Day);
