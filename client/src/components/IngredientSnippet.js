import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  removeIngredient as removeIngredientAction,
  removeBookmarkedIngredient as removeBookmarkedIngredientAction,
  recountSubstances as recountSubstancesAction,
  bookmarkIngredient as bookmarkIngredientAction,
} from '../actions';
import RemoveModal from './RemoveModal';
import IngredientModal from './IngredientModal';
import OkModal from './OkModal';
import { floorToOne } from '../utils';

class IngredientSnippet extends React.Component {
  state = {
    removeModalShow: false,
    editModalShow: false,
    bookmarkModalShow: false,
  };

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

  handleRemoveModal = (sure) => {
    const {
      dayId,
      mealType,
      name,
      removeIngredient,
      recountSubstances,
      removeBookmarkedIngredient,
      isntEditable,
    } = this.props;

    if (sure && isntEditable) {
      removeBookmarkedIngredient(name);
      this.setState({
        removeModalShow: false,
      });
      return;
    }

    if (sure) {
      removeIngredient(dayId, mealType, name);
      recountSubstances();
    }
    this.setState({
      removeModalShow: false,
    });
  };

  handleBookmarkIngredient = (e) => {
    const { name, substances, bookmarkIngredient, quantity } = this.props;
    e.preventDefault();
    bookmarkIngredient(name, {
      proteins: floorToOne((substances.proteins * 100) / quantity),
      fats: floorToOne((substances.fats * 100) / quantity),
      carbs: floorToOne((substances.carbs * 100) / quantity),
      calories: floorToOne((substances.calories * 100) / quantity),
    });
    this.setState({
      bookmarkModalShow: true,
    });
  };

  render() {
    const {
      name,
      substances,
      quantity,
      ingredientNames,
      dayId,
      mealType,
      savedIngredients,
      isntEditable,
    } = this.props;
    const { removeModalShow, editModalShow, bookmarkModalShow } = this.state;

    return (
      <>
        {removeModalShow && (
          <RemoveModal
            title="Are you sure?"
            subtitle={`Do you really want to remove this ingredient: ${name}?`}
            click={this.handleRemoveModal}
          />
        )}
        {editModalShow && (
          <IngredientModal
            name={name}
            quantity={quantity}
            substances={substances}
            close={this.handleBackButton}
            ingredientNames={ingredientNames}
            dayId={dayId}
            mealType={mealType}
            isEdit
          />
        )}
        {bookmarkModalShow && (
          <OkModal
            title="Ingredient bookmarked"
            subtitle="You ingredient has been added to ingredients page"
            click={() => this.setState({ bookmarkModalShow: false })}
          />
        )}
        <div className="box meal-snippet has-text-white has-text-grey-darker">
          <h3 className="title is-size-5">{name}</h3>
          {!isntEditable && <h4 className="subtitle has-text-grey is-size-6">{`${quantity}g`}</h4>}
          <div>
            {!isntEditable && (
              <a href="/" onClick={this.handleEditButton}>
                Edit
              </a>
            )}
            {!savedIngredients.map((i) => i.name).includes(name) && (
              <a href="/" onClick={this.handleBookmarkIngredient}>
                Bookmark
              </a>
            )}
            <a href="/" onClick={this.handleRemoveButton} className="has-text-danger">
              Remove
            </a>
          </div>
          <footer className="is-size-7">
            <p>
              <span>
                Proteins:
                <b> {floorToOne(substances.proteins)}g</b>
              </span>
              <span>
                Fats:
                <b> {floorToOne(substances.fats)}g</b>
              </span>
              <span>
                Carbs:
                <b> {floorToOne(substances.carbs)}g</b>
              </span>
              <span>
                kcal:
                <b> {floorToOne(substances.calories)}</b>
              </span>
            </p>
          </footer>
        </div>
      </>
    );
  }
}

IngredientSnippet.propTypes = {
  name: PropTypes.string.isRequired,
  mealType: PropTypes.string.isRequired,
  quantity: PropTypes.number,
  dayId: PropTypes.number.isRequired,
  ingredientNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  removeIngredient: PropTypes.func.isRequired,
  bookmarkIngredient: PropTypes.func.isRequired,
  removeBookmarkedIngredient: PropTypes.func.isRequired,
  recountSubstances: PropTypes.func.isRequired,
  savedIngredients: PropTypes.arrayOf(PropTypes.object).isRequired,
  substances: PropTypes.shape({
    proteins: PropTypes.number,
    fats: PropTypes.number,
    carbs: PropTypes.number,
    calories: PropTypes.number,
  }),
  isntEditable: PropTypes.bool,
};

IngredientSnippet.defaultProps = {
  quantity: 0,
  substances: {
    proteins: 0,
    fats: 0,
    carbs: 0,
    calories: 0,
  },
  isntEditable: false,
};

const mapStateToProps = (state) => {
  const { savedIngredients } = state;
  return {
    savedIngredients,
  };
};

const mapDispatchToProps = (dispatch) => ({
  removeIngredient: (dayId, mealType, name) =>
    dispatch(removeIngredientAction(dayId, mealType, name)),
  recountSubstances: () => dispatch(recountSubstancesAction()),
  removeBookmarkedIngredient: (name) => dispatch(removeBookmarkedIngredientAction(name)),
  bookmarkIngredient: (name, substances) => dispatch(bookmarkIngredientAction(name, substances)),
});

export default connect(mapStateToProps, mapDispatchToProps)(IngredientSnippet);
