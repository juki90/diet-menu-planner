/* eslint-disable react/destructuring-assignment */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import {
  addIngredient as addIngredientAction,
  editIngredient as editIngredientAction,
  recountSubstances as recountSubstancesAction,
} from '../actions';
import { floorToOne } from '../utils';

class IngredientModal extends React.Component {
  state = {
    name: this.props.name || '',
    quantity: this.props.quantity || 0,
    proteins: this.props.substances.proteins || 0,
    fats: this.props.substances.fats || 0,
    carbs: this.props.substances.carbs || 0,
    calories: this.props.substances.calories || 0,
    error: false,
    nameExists: false,
    searchOpened: false,
    searchField: '',
    searchError: false,
    searchServerFail: false,
    searched: [],
  };

  prevName = (() => {
    const { name } = this.props;
    return name;
  })();

  componentDidMount = () => {
    const html = document.getElementById('document-root');
    html.classList.add('no-overflow');
  };

  componentWillUnmount = () => {
    const html = document.getElementById('document-root');
    html.classList.remove('no-overflow');
  };

  handleInputChange = (e) => {
    const { ingredientNames } = this.props;
    const [, value] = e.target.getAttribute('id').split('-');
    if (value === 'name' && !ingredientNames.includes(e.target.value)) {
      this.setState({
        [value]: e.target.value,
        nameExists: false,
      });
      return;
    }

    if (value === 'name' && ingredientNames.includes(e.target.value)) {
      this.setState({
        [value]: e.target.value,
        nameExists: true,
      });
      return;
    }

    if (value === 'search') {
      this.setState({
        searchField: e.target.value,
        searchError: false,
      });
    }

    this.setState({
      [value]: +e.target.value,
    });
  };

  handleSaveButton = () => {
    const { name, quantity, proteins, fats, carbs, calories, nameExists } = this.state;
    const {
      ingredientNames,
      addIngredient,
      dayId,
      mealType,
      close,
      isEdit,
      editIngredient,
      recountSubstances,
    } = this.props;

    if (ingredientNames.includes(name) && !isEdit) {
      this.setState({
        nameExists: true,
      });
      return;
    }

    if (
      name &&
      quantity &&
      proteins >= 0 &&
      fats >= 0 &&
      carbs >= 0 &&
      calories &&
      !nameExists &&
      !isEdit
    ) {
      this.setState({
        error: false,
        nameExists: false,
      });

      addIngredient(dayId, mealType, name, floorToOne(quantity), {
        proteins: floorToOne((proteins * quantity) / 100),
        fats: floorToOne((fats * quantity) / 100),
        carbs: floorToOne((carbs * quantity) / 100),
        calories: floorToOne((calories * quantity) / 100),
      });
      recountSubstances();
      close();
    }

    if (quantity && proteins >= 0 && fats >= 0 && carbs >= 0 && calories && !nameExists && isEdit) {
      this.setState({
        error: false,
        nameExists: false,
      });

      editIngredient(
        dayId,
        mealType,
        name,
        floorToOne(quantity),
        {
          proteins: floorToOne((proteins * quantity) / 100),
          fats: floorToOne((fats * quantity) / 100),
          carbs: floorToOne((carbs * quantity) / 100),
          calories: floorToOne((calories * quantity) / 100),
        },
        this.prevName,
      );
      recountSubstances();
      close();
    }
    this.setState({
      error: true,
    });
  };

  handleFromBookmarks = (e) => {
    const { savedIngredients } = this.props;
    const { value } = e.target;
    const [ingredient] = savedIngredients.filter((i) => i.name === value);
    if (ingredient && value) {
      this.setState({
        name: value,
        proteins: ingredient.substances.proteins,
        fats: ingredient.substances.fats,
        carbs: ingredient.substances.carbs,
        calories: ingredient.substances.calories,
      });
      return;
    }
    this.setState({
      name: '',
      proteins: 0,
      fats: 0,
      carbs: 0,
      calories: 0,
    });
  };

  handleOpenSearch = () => {
    this.setState((prevState) => ({
      searchOpened: !prevState.searchOpened,
      searchServerFail: false,
    }));
  };

  handleSearchProduct = () => {
    const { searchField } = this.state;
    if (searchField.length < 3) {
      this.setState({ searchError: true });
      return;
    }

    const urlOrigin = window.location.origin;
    const ua = window.navigator.oscpu;

    axios({
      url: `${urlOrigin}/api/search`,
      method: 'post',
      data: {
        search: searchField,
        ua,
      },
    })
      .then((data) => {
        this.setState((prevState) => ({
          searchServerFail: false,
          searchError: false,
          searched: data.data.products.map((p, i) => ({
            id: +i,
            name: p.generic_name || p.product_name || 'No name',
            img: p.image_small_url,
            substances: {
              proteins: +p.nutriments.proteins_100g || 0,
              fats: +p.nutriments.fat_100g || 0,
              carbs: +p.nutriments.carbohydrates_100g || 0,
              calories: +p.nutriments['energy-kcal_value'] || 0,
            },
          })),
        }));
      })
      .catch((e) => {
        console.log(e);
        this.setState({
          searchServerFail: true,
        });
      });
  };

  handleUseProduct = (e) => {
    e.preventDefault();
    const id = +e.target.getAttribute('data-id');
    const products = this.state.searched;
    const [theProduct] = products.filter((p) => id === p.id);
    this.setState({
      name: theProduct.name,
      proteins: +theProduct.substances.proteins,
      fats: +theProduct.substances.fats,
      carbs: +theProduct.substances.carbs,
      calories: +theProduct.substances.calories,
      searchOpened: false,
    });
  };

  render() {
    const { close, savedIngredients, isEdit } = this.props;
    const {
      name,
      quantity,
      proteins,
      fats,
      carbs,
      calories,
      error,
      nameExists,
      searchOpened,
      searchField,
      searchError,
      searchServerFail,
      searched,
    } = this.state;
    const searchedProducts =
      searched.length &&
      searched.map((s) => (
        <div key={`${s.calories}$-${s.name}`} className="product box">
          <div className="columns">
            <div className="column is-half">
              <p className="is-size-5 has-text-weight-semibold">{s.name}</p>
              <p className="nutrients">
                <span>Proteins: {s.substances.proteins}g</span>
                <span>Fats: {s.substances.fats}g</span>
                <span>Carbs: {s.substances.carbs}g</span>
                <span>Calories: {s.substances.calories}g</span>
              </p>
            </div>
            <div className="column is-half">
              <div className="img">
                <img src={`${s.img}`} alt={s.name} />
              </div>
              <a
                type="button"
                className="button is-info"
                data-id={s.id}
                onClick={this.handleUseProduct}
                href="/"
              >
                Use
              </a>
            </div>
          </div>
        </div>
      ));
    return (
      <div className="modal">
        <div className="modal-background"> </div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-header-title is-size-4">{isEdit ? 'Edit' : 'Add new'} ingredient</p>
            <button type="button" className="delete" aria-label="close" onClick={close} />
          </header>
          {!searchOpened && (
            <section className="scrollable">
              <div className="columns">
                <div className="column is-half">
                  <div className="control">
                    <label htmlFor="ingredient-name" className="is-size-5 has-text-weight-semibold">
                      Name of ingredient:
                      <input
                        id="ingredient-name"
                        className="input"
                        type="text"
                        onChange={this.handleInputChange}
                        value={name}
                      />
                    </label>
                    {nameExists && (
                      <p className="has-text-danger">
                        This ingredient&apos;s name already exists. Enter different.
                      </p>
                    )}
                  </div>
                  <hr />
                  <div className="control">
                    <label
                      htmlFor="ingredient-proteins"
                      className="is-size-5 has-text-weight-semibold"
                    >
                      Proteins (in 100g):
                      <input
                        id="ingredient-proteins"
                        className="input"
                        type="number"
                        min="0"
                        onChange={this.handleInputChange}
                        value={proteins}
                      />
                    </label>
                  </div>
                  <div className="control">
                    <label htmlFor="ingredient-fats" className="is-size-5 has-text-weight-semibold">
                      Fats (in 100g):
                      <input
                        id="ingredient-fats"
                        className="input"
                        type="number"
                        min="0"
                        onChange={this.handleInputChange}
                        value={fats}
                      />
                    </label>
                  </div>
                  <div className="control">
                    <label
                      htmlFor="ingredient-carbs"
                      className="is-size-5 has-text-weight-semibold"
                    >
                      Carbs (in 100g):
                      <input
                        id="ingredient-carbs"
                        className="input"
                        type="number"
                        min="0"
                        onChange={this.handleInputChange}
                        value={carbs}
                      />
                    </label>
                  </div>
                  <div className="control">
                    <label
                      htmlFor="ingredient-calories"
                      className="is-size-5 has-text-weight-semibold"
                    >
                      Calories (kcal in 100g):
                      <input
                        id="ingredient-calories"
                        className="input"
                        type="number"
                        min="0"
                        onChange={this.handleInputChange}
                        value={calories}
                      />
                    </label>
                  </div>
                  <hr />
                  <div className="control">
                    <label
                      htmlFor="ingredient-quantity"
                      className="is-size-5 has-text-weight-semibold"
                    >
                      Quantity (in g):
                      <input
                        id="ingredient-quantity"
                        className="input"
                        type="number"
                        min="0"
                        onChange={this.handleInputChange}
                        value={quantity}
                      />
                    </label>
                  </div>
                </div>
                <div className="column is-half">
                  <div className="control">
                    <label
                      htmlFor="ingredient-bookmark"
                      className="is-size-5 has-text-weight-semibold"
                    >
                      Select from bookmarks
                      <div className="select">
                        <select onChange={this.handleFromBookmarks} id="ingredient-bookmark">
                          <option value={null}>Select meal&apos;s type</option>
                          {!!savedIngredients.length &&
                            savedIngredients.map((i) => (
                              <option key={`${i.name}-${i.calories}`} value={i.name}>
                                {i.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    </label>
                  </div>
                  <div className="control">
                    <p className="is-size-5 has-text-weight-semibold">
                      Search in OpenFoodFacts.org:
                    </p>
                    <br />
                    <button
                      id="search-ingredient"
                      className="button is-primary"
                      type="button"
                      onClick={this.handleOpenSearch}
                    >
                      Open Search
                    </button>
                  </div>
                </div>
              </div>
              <p className="subtitle has-text-link">
                <span className="has-text-weight-semibold">These substances will be saved:</span>
                <br />
                {`Proteins: ${floorToOne((proteins * quantity) / 100)}g, `}
                <br />
                {`Fats: ${floorToOne((fats * quantity) / 100)}g, `}
                <br />
                {`Carbs: ${floorToOne((carbs * quantity) / 100)}g, `}
                <br />
                {`Calories: ${floorToOne((calories * quantity) / 100)} kcal`}
              </p>
              {error && <p className="has-text-danger">Fill all fields correctly</p>}
              <button type="submit" className="button is-success" onClick={close}>
                Back
              </button>
              <button type="submit" className="button is-info" onClick={this.handleSaveButton}>
                Save
              </button>
            </section>
          )}
          {searchOpened && (
            <section className="scrollable">
              <div className="columns">
                <div className="column is-half">
                  <div className="control">
                    <label className="is-size-5 has-text-weight-semibold" htmlFor="product-search">
                      Search for product
                      <input
                        id="product-search"
                        className="input"
                        type="text"
                        onChange={this.handleInputChange}
                        value={searchField}
                      />
                    </label>
                    {searchError && (
                      <>
                        <p className="has-text-danger">
                          You must provide at least 3 character in length product name
                        </p>
                        <br />
                      </>
                    )}
                    {searchServerFail && (
                      <>
                        <p className="has-text-danger">Server failed loading products</p>
                        <br />
                      </>
                    )}
                    <button
                      className="button is-primary"
                      type="button"
                      onClick={this.handleSearchProduct}
                    >
                      Search
                    </button>
                    <button
                      className="button is-info"
                      type="button"
                      onClick={this.handleOpenSearch}
                    >
                      Back
                    </button>
                  </div>
                </div>
              </div>
              <div className="product-search">{searchedProducts ? searchedProducts : null}</div>
            </section>
          )}
        </div>
      </div>
    );
  }
}

IngredientModal.propTypes = {
  close: PropTypes.func.isRequired,
  addIngredient: PropTypes.func.isRequired,
  recountSubstances: PropTypes.func.isRequired,
  quantity: PropTypes.number,
  name: PropTypes.string,
  substances: PropTypes.shape({
    proteins: PropTypes.number,
    fats: PropTypes.number,
    carbs: PropTypes.number,
    calories: PropTypes.number,
  }),
  ingredientNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  mealType: PropTypes.string.isRequired,
  dayId: PropTypes.number.isRequired,
  editIngredient: PropTypes.func.isRequired,
  isEdit: PropTypes.bool,
  savedIngredients: PropTypes.arrayOf(PropTypes.object).isRequired,
};

IngredientModal.defaultProps = {
  name: '',
  quantity: 0,
  isEdit: false,
  substances: {
    proteins: 0,
    fats: 0,
    carbs: 0,
    calories: 0,
  },
};

const mapStateToProps = (state) => {
  const { savedIngredients } = state;
  return {
    savedIngredients,
  };
};

const mapDispatchToProps = (dispatch) => ({
  addIngredient: (dayId, mealType, name, quantity, substances) =>
    dispatch(addIngredientAction(dayId, mealType, name, quantity, substances)),
  editIngredient: (dayId, mealType, name, quantity, substances, prevName) =>
    dispatch(editIngredientAction(dayId, mealType, name, quantity, substances, prevName)),
  recountSubstances: () => dispatch(recountSubstancesAction()),
});

export default connect(mapStateToProps, mapDispatchToProps)(IngredientModal);
