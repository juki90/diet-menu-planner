import React from 'react';
import PropTypes from 'prop-types';

const OkModal = ({ title, subtitle, click }) => (
  <div className="modal">
    <div className="modal-background"> </div>
    <div className="modal-card">
      <header className="modal-card-head">
        <h1 className="is-size-4">{title}</h1>
      </header>

      <section>
        <p className="is-size-5">{subtitle}</p>
        <br />
        <button type="button" className="button is-info" onClick={click}>
          OK
        </button>
      </section>
    </div>
  </div>
);

OkModal.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  click: PropTypes.func.isRequired,
};

export default OkModal;
