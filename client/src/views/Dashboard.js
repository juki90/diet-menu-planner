import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Card from '../templates/Card';
import MealSnippet from '../components/MealSnippet';
import DayNote from '../components/DayNote';
import DayModal from '../components/DayModal';

class Dashboard extends React.Component {
  state = {
    modalOpened: false,
  };

  handleAddNew = (e) => {
    e.preventDefault();
    this.setState({
      modalOpened: true,
    });
  };

  handleCloseModal = () => {
    this.setState({
      modalOpened: false,
    });
  };

  render() {
    const { days, config, loggedAs } = this.props;
    const { modalOpened } = this.state;
    const dayList = !days.length ? (
      <p className="subtitle is-size-4 has-text-centered">No days in menu yet</p>
    ) : (
      days.map((d) => {
        const mealList = !d.meals.length ? (
          <p className="subtitle is-size-4 has-text-centered">No meals in this day yet</p>
        ) : (
          d.meals.map((m) => (
            <MealSnippet
              key={`${m.name}-${d.id}`}
              type={m.type}
              name={m.name}
              time={m.time}
              substances={m.substances}
            />
          ))
        );
        return (
          <>
            <DayNote
              key={`${d.id}`}
              identity={d.id}
              date={d.date}
              path={d.path}
              substances={d.substances}
              config={config}
            >
              {mealList}
            </DayNote>
          </>
        );
      })
    );
    return (
      <>
        {modalOpened && <DayModal days={days} close={this.handleCloseModal} />}
        <Card
          title="Dashboard"
          subtitle={`${loggedAs && `Logged as ${loggedAs}. `} Organize your meals in each day`}
        >
          <div className="add-new has-text-centered">
            <p className="subtitle has-text-centered">Add one day to menu:</p>
            <button type="button" className="button" onClick={this.handleAddNew}>
              Add day
            </button>
          </div>
          {dayList}
        </Card>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  const { days, config, loggedAs } = state;
  return {
    days,
    config,
    loggedAs,
  };
};

Dashboard.propTypes = {
  days: PropTypes.arrayOf(PropTypes.object).isRequired,
  config: PropTypes.shape({
    Pmin: PropTypes.number.isRequired,
    Pmax: PropTypes.number.isRequired,
    Fmin: PropTypes.number.isRequired,
    Fmax: PropTypes.number.isRequired,
    Cmin: PropTypes.number.isRequired,
    Cmax: PropTypes.number.isRequired,
    BMR: PropTypes.number.isRequired,
    goal: PropTypes.number.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps)(Dashboard);
