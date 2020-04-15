import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import RemoveModal from './RemoveModal';
import { removeBookmarkedMeal as removeBookmarkedMealAction } from '../actions';
import { floorToOne } from '../utils';

class MealSnippet extends React.Component {
  state = {
    removeModalShow: false,
  };

  handleRemoveButton = (e) => {
    e.preventDefault();
    this.setState({
      removeModalShow: true,
    });
  };

  handleBackButton = () => {
    this.setState({
      removeModalShow: false,
    });
  };

  handleRemoveModal = (sure) => {
    const { type, name, removeBookmarkedMeal } = this.props;
    if (sure) {
      removeBookmarkedMeal(type, name);
    }
    this.setState({
      removeModalShow: false,
    });
  };

  render() {
    const { name, type, time, substances, ingredients, isRemovable } = this.props;
    const { removeModalShow } = this.state;
    const thetime = new Date(time);
    const ingredientsList = ingredients.map((i) => i.name).join(', ');
    return (
      <>
        {isRemovable && removeModalShow && (
          <RemoveModal
            title="Are you sure?"
            subtitle={`Do you really want to delete saved meal called: ${name}`}
            click={this.handleRemoveModal}
          />
        )}
        <div className="box meal-snippet has-text-grey-darker">
          <h3 className="title is-size-5">{name}</h3>
          {time && (
            <h4 className="subtitle has-text-grey is-size-6">
              {`${type} ${
                thetime.getHours().toString().length === 2
                  ? thetime.getHours()
                  : `0${thetime.getHours()}`
              }:${
                thetime.getMinutes().toString().length === 2
                  ? thetime.getMinutes()
                  : `0${thetime.getMinutes()}`
              } `}
            </h4>
          )}
          {isRemovable && <h4 className="subtitle has-text-grey is-size-6">{ingredientsList}</h4>}
          {isRemovable && (
            <a href="/" onClick={this.handleRemoveButton} className="has-text-danger">
              Remove
            </a>
          )}
          <footer className="is-size-7">
            <p>
              <span>
                Proteins:
                <b> {substances.proteins ? floorToOne(substances.proteins) : '-- '}g</b>
              </span>
              <span>
                Fats:
                <b> {substances.fats ? floorToOne(substances.fats) : '-- '}g</b>
              </span>
              <span>
                Carbs:
                <b> {substances.carbs ? floorToOne(substances.carbs) : '-- '}g</b>
              </span>
              <span>
                kcal:
                <b> {substances.calories ? floorToOne(substances.calories) : '-- '}kcal</b>
              </span>
            </p>
          </footer>
        </div>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  removeBookmarkedMeal: (type, name) => dispatch(removeBookmarkedMealAction(type, name)),
});

MealSnippet.propTypes = {
  time: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  removeBookmarkedMeal: PropTypes.func.isRequired,
  isRemovable: PropTypes.bool,
  ingredients: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      substrances: PropTypes.object.isRequired,
    }),
  ),
  substances: PropTypes.shape({
    proteins: PropTypes.number.isRequired,
    fats: PropTypes.number.isRequired,
    carbs: PropTypes.number.isRequired,
    calories: PropTypes.number.isRequired,
  }).isRequired,
};

MealSnippet.defaultProps = {
  isRemovable: false,
  ingredients: [],
  type: '',
};

export default connect(null, mapDispatchToProps)(MealSnippet);
