import React from 'react';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import PropTypes from 'prop-types';
import { editDay as editDayAction, saveNewDay as saveNewDayAction } from '../actions';

class DayModal extends React.Component {
  state = {
    date: null,
    isSelected: false,
    error: false,
    dateExists: false,
  };

  componentDidMount = () => {
    const html = document.getElementById('document-root');
    html.classList.add('no-overflow');
  };

  componentWillUnmount = () => {
    const html = document.getElementById('document-root');
    html.classList.remove('no-overflow');
  };

  handleDateChange = (date) => {
    const { days } = this.props;
    const dates = days.map((d) => {
      return new Date(d.date).getTime();
    });
    if (dates.includes(new Date(date).getTime())) {
      this.setState({
        date: null,
        dateExists: true,
      });
      return;
    }
    this.setState({
      date,
      isSelected: true,
      dateExists: false,
      error: false,
    });
  };

  handleSaveDay = () => {
    const { date, isSelected } = this.state;
    const { saveNewDay, close, isEdit, editDay, dayId } = this.props;

    if (!isSelected) {
      this.setState({
        error: true,
      });
      return;
    }

    if (isEdit) {
      this.setState({
        isSelected: false,
        dateExists: false,
      });
      editDay(dayId, date);
      close();
      return;
    }

    this.setState({
      isSelected: false,
      dateExists: false,
    });

    saveNewDay(date);
    close();
  };

  render() {
    const { date, error, dateExists } = this.state;
    const { isEdit, close } = this.props;

    return (
      <div className="modal">
        <div className="modal-background"> </div>
        <div className="modal-card">
          <header className="modal-card-head">
            <h1 className="is-size-4">{isEdit ? 'Edit day' : 'Add new day'}</h1>
          </header>
          <section>
            <div className="control">
              <h2 className="is-size-5 has-text-weight-semibold">Select date:</h2>
              <DatePicker
                className="input"
                selected={date}
                onChange={this.handleDateChange}
                shouldCloseOnSelect
              />
            </div>
            {error && <p className="has-text-danger">Select date before saving</p>}
            {dateExists && <p className="has-text-danger">This day is already set</p>}
            <br />
            <button type="submit" className="button is-success" onClick={close}>
              Back
            </button>
            <button type="submit" className="button is-info" onClick={this.handleSaveDay}>
              Save
            </button>
          </section>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  editDay: (dayId, date) => dispatch(editDayAction(dayId, date)),
  saveNewDay: (date) => dispatch(saveNewDayAction(date)),
});

const mapStateToProps = (state) => {
  const { days } = state;
  return {
    days,
    state,
  };
};

DayModal.propTypes = {
  editDay: PropTypes.func.isRequired,
  saveNewDay: PropTypes.func.isRequired,
  dayId: PropTypes.number.isRequired,
  isEdit: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  days: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(DayModal);
