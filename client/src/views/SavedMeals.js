import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Card from '../templates/Card';
import MealSnippet from '../components/MealSnippet';

const SavedMeals = ({ savedMeals }) => {
  const meals = savedMeals.map((m) => (
    <MealSnippet
      key={`${m.name}-${m.type}`}
      name={m.name}
      substances={m.substances}
      ingredients={m.ingredients}
      path={m.path}
      isRemovable
    />
  ));

  return (
    <Card title="Saved Meals" subtitle="You can organize here your saved meals">
      {meals.length === 0 && (
        <p className="subtitle is-size-4 has-text-centered">No saved meals at the moment</p>
      )}
      {meals}
    </Card>
  );
};

const mapStateToProps = (state) => {
  const { savedMeals } = state;
  return { savedMeals };
};

SavedMeals.propTypes = {
  savedMeals: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default connect(mapStateToProps)(SavedMeals);
