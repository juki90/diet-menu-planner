import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Card from '../templates/Card';
import IngredientSnippet from '../components/IngredientSnippet';

const SavedIngredients = ({ savedIngredients }) => {
  const ingredients = savedIngredients.map((i) => (
    <IngredientSnippet key={i.name} name={i.name} substances={i.substances} isntEditable />
  ));

  return (
    <Card title="Saved Ingredients" subtitle="You can organize here your saved ingredients">
      {ingredients.length === 0 && (
        <p className="subtitle is-size-4 has-text-centered">No saved ingredients at the moment</p>
      )}
      {ingredients}
    </Card>
  );
};

const mapStateToProps = (state) => {
  const { savedIngredients } = state;
  return { savedIngredients };
};

SavedIngredients.propTypes = {
  savedIngredients: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default connect(mapStateToProps)(SavedIngredients);
