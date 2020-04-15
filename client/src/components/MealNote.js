import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { routes } from '../routes';
import {
  removeMeal as removeMealAction,
  recountSubstances as recountSubstancesAction,
  bookmarkMeal as bookmarkMealAction,
} from '../actions';
import RemoveModal from './RemoveModal';
import MealModal from './MealModal';
import IngredientModal from './IngredientModal';
import OkModal from './OkModal';

class MealNote extends React.Component {
  state = {
    removeModalShow: false,
    editModalShow: false,
    ingredientModalShow: false,
    bookmarkModal: false,
  };

  names = (() => {
    const { ingredients } = this.props;
    return ingredients.map((i) => i.name);
  })();

  componentDidUpdate() {
    const { ingredients } = this.props;
    this.names = ingredients.map((i) => i.name);
  }

  handleRemoveButton = (e) => {
    e.preventDefault();
    this.setState({
      removeModalShow: true,
    });
  };

  handleEditButton = (e) => {
    e.preventDefault();
    this.setState({
      editModalShow: true,
    });
  };

  handleBackButton = () => {
    this.setState({
      editModalShow: false,
    });
  };

  handleIngredientBackButton = () => {
    this.setState({
      ingredientModalShow: false,
    });
  };

  handleRemoveModal = (sure) => {
    const { dayId, type, removeMeal, recountSubstances } = this.props;
    if (sure) {
      removeMeal(dayId, type);
      recountSubstances();
    }
    this.setState({
      removeModalShow: false,
      editModalShow: false,
    });
  };

  handleAddIngredient = (e) => {
    e.preventDefault();
    this.setState({
      ingredientModalShow: true,
    });
  };

  handleBookmarkMeal = (e) => {
    e.preventDefault();
    const { name, substances, ingredients, bookmarkMeal } = this.props;
    this.setState({
      bookmarkModal: true,
    });
    bookmarkMeal(name, substances, ingredients);
  };

  render() {
    const { children, name, type, substances, time, dayId, savedMeals, ingredients } = this.props;
    const { removeModalShow, editModalShow, ingredientModalShow, bookmarkModal } = this.state;
    const timeObj = new Date(time);
    const rightTime = `${timeObj.getHours()}:${
      timeObj.getMinutes().toString().length === 2
        ? timeObj.getMinutes()
        : `0${timeObj.getMinutes()}`
    }`;

    return (
      <>
        {removeModalShow && (
          <RemoveModal
            title="Are you sure?"
            subtitle={`Do you really want to remove the following meal: ${name}`}
            click={this.handleRemoveModal}
          />
        )}
        {editModalShow && (
          <MealModal
            type={type}
            name={name}
            time={time}
            dayId={dayId}
            close={this.handleBackButton}
            isEdit
          />
        )}
        {ingredientModalShow && (
          <IngredientModal
            dayId={dayId}
            ingredientNames={this.names}
            mealType={type}
            close={this.handleIngredientBackButton}
          />
        )}
        {bookmarkModal && (
          <OkModal
            title="Meal bookmarked"
            subtitle="This meal now appears in your meals page"
            click={() => this.setState({ bookmarkModal: false })}
          />
        )}
        <div className="box day-box">
          <header className="card-header">
            <h2 className="card-header-title is-size-4">{`${type} at ${rightTime}: ${name}`}</h2>
            <div className="is-pulled-right has-text-right">
              <a
                href={routes.dashboard}
                onClick={this.handleAddIngredient}
                className="card-header-item"
              >
                Add
              </a>
              <a
                href={routes.dashboard}
                onClick={this.handleEditButton}
                className="card-header-item"
              >
                Edit
              </a>
              {!savedMeals.map((s) => s.name).includes(name) && !!ingredients.length && (
                <a
                  href={routes.dashboard}
                  className="card-header-item"
                  onClick={this.handleBookmarkMeal}
                >
                  Bookmark
                </a>
              )}
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
              <strong> {substances.proteins ? substances.proteins : '0'}g</strong>
            </p>
            <p className="card-footer-item is-size-7">
              Fats:
              <strong> {substances.fats ? substances.fats : '0'}g</strong>
            </p>
            <p className="card-footer-item is-size-7">
              Carbs:
              <strong> {substances.carbs ? substances.carbs : '0'}g</strong>
            </p>
            <p className="card-footer-item is-size-7">
              Calories:
              <strong> {substances.calories ? substances.calories : '0'} kcal</strong>
            </p>
          </footer>
        </div>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  removeMeal: (dayId, mealType) => dispatch(removeMealAction(dayId, mealType)),
  recountSubstances: () => dispatch(recountSubstancesAction()),
  bookmarkMeal: (name, substances, ingredients) =>
    dispatch(bookmarkMealAction(name, substances, ingredients)),
});

const mapStateToProps = (state) => {
  const { savedMeals } = state;
  return {
    savedMeals,
  };
};

MealNote.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  recountSubstances: PropTypes.func.isRequired,
  bookmarkMeal: PropTypes.func.isRequired,
  time: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  dayId: PropTypes.number.isRequired,
  removeMeal: PropTypes.func.isRequired,
  ingredients: PropTypes.arrayOf(PropTypes.object).isRequired,
  substances: PropTypes.shape({
    proteins: PropTypes.number,
    fats: PropTypes.number,
    carbs: PropTypes.number,
    calories: PropTypes.number,
  }),
  savedMeals: PropTypes.arrayOf(PropTypes.object).isRequired,
};

MealNote.defaultProps = {
  substances: PropTypes.shape({
    proteins: 0,
    fats: 0,
    carbs: 0,
    calories: 0,
  }),
};

export default connect(mapStateToProps, mapDispatchToProps)(MealNote);
