import React from 'react';
import PropTypes from 'prop-types';

const RemoveModal = ({ title, subtitle, click }) => (
  <div className="modal">
    <div className="modal-background" />
    <div className="modal-card">
      <header className="modal-card-head">
        <p className="modal-card-title">{title}</p>
      </header>
      <section className="modal-card-body">
        <p className="subtitle">{subtitle}</p>

        <button type="button" onClick={() => click(true)} className="button is-danger">
          Delete
        </button>
        <button type="button" onClick={() => click(false)} className="button is-success">
          Cancel
        </button>
      </section>
    </div>
  </div>
);

RemoveModal.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  click: PropTypes.func.isRequired,
};

export default RemoveModal;
