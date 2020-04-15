import React from 'react';
import PropTypes from 'prop-types';

const Card = ({ children, title, subtitle }) => (
  <>
    <div className="card">
      <h1 className="title has-text-centered">{title}</h1>
      <p className="subtitle has-text-centered">{subtitle}</p>
    </div>
    <div className="card">
      <div className="card-content">{children}</div>
    </div>
    <div className="has-text-centered">
      <a href="https://world.openfoodfacts.org/">Powered By OpenFoodFacts.org</a>
    </div>
  </>
);

Card.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default Card;
