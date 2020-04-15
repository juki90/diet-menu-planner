import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Card from '../templates/Card';
import {
  saveBMR as saveBMRAction,
  saveProportions as saveProportionsAction,
  saveGoal as saveGoalAction,
} from '../actions';
import { floorToOne } from '../utils';

class Configuration extends React.Component {
  state = {
    bmrForm: {
      bodyMass: 0,
      bodyHeight: 0,
      age: 0,
      activity: 0,
      sex: 0,
      error: false,
      result: null,
    },
    proportionsForm: {
      proteins: 0,
      fats: 0,
      carbs: 0,
      error: false,
    },
    goal: {
      value: -2,
      error: false,
    },
  };

  handleMassChange = (e) => {
    e.persist();
    this.setState((prevState) => ({
      ...prevState,
      bmrForm: {
        ...prevState.bmrForm,
        bodyMass: +e.target.value,
      },
    }));
  };

  handleHeightChange = (e) => {
    e.persist();
    this.setState((prevState) => ({
      ...prevState,
      bmrForm: {
        ...prevState.bmrForm,
        bodyHeight: +e.target.value,
      },
    }));
  };

  handleAgeChange = (e) => {
    e.persist();
    this.setState((prevState) => ({
      ...prevState,
      bmrForm: {
        ...prevState.bmrForm,
        age: +e.target.value,
      },
    }));
  };

  handleActivityChange = (e) => {
    e.persist();
    this.setState((prevState) => ({
      ...prevState,
      bmrForm: {
        ...prevState.bmrForm,
        activity: +e.target.value,
      },
    }));
  };

  handleSexChange = (e) => {
    e.persist();
    const sex = +e.target.value;
    let sexTo = null;
    if (sex === 1) {
      sexTo = 1;
    }
    if (sex === 2) {
      sexTo = 2;
    }
    this.setState((prevState) => ({
      ...prevState,
      bmrForm: {
        ...prevState.bmrForm,
        sex: sexTo,
      },
    }));
  };

  handleCalculateButton = () => {
    const { bmrForm } = this.state;
    if (Object.values(bmrForm).indexOf(0) > -1) {
      this.setState((prevState) => ({
        ...prevState,
        bmrForm: {
          ...prevState.bmrForm,
          error: true,
          result: null,
        },
      }));
      return;
    }

    const { bodyMass, bodyHeight, age, activity, sex } = bmrForm;
    let result;

    if (sex === 1) {
      result = (9.99 * bodyMass + 6.25 * bodyHeight - 4.92 * age - 161) * activity;
    }
    if (sex === 2) {
      result = (9.99 * bodyMass + 6.25 * bodyHeight - 4.92 * age + 5) * activity;
    }

    this.setState((prevState) => ({
      ...prevState,
      bmrForm: {
        ...prevState.bmrForm,
        error: false,
        result: floorToOne(result),
      },
    }));
  };

  handleProteinChange = (e) => {
    e.persist();
    this.setState((prevState) => ({
      ...prevState,
      proportionsForm: {
        ...prevState.proportionsForm,
        proteins: +e.target.value,
        error: false,
      },
    }));
  };

  handleFatsChange = (e) => {
    e.persist();
    this.setState((prevState) => ({
      ...prevState,
      proportionsForm: {
        ...prevState.proportionsForm,
        fats: +e.target.value,
      },
    }));
  };

  handleCarbsChange = (e) => {
    e.persist();
    this.setState((prevState) => ({
      ...prevState,
      proportionsForm: {
        ...prevState.proportionsForm,
        carbs: +e.target.value,
        error: false,
      },
    }));
  };

  handleSaveBMR = () => {
    const { yourProteins, yourFats, yourCarbs, yourGoal, saveBMR, saveProportions } = this.props;
    const { bmrForm } = this.state;

    const minProteins = floorToOne(
      ((yourProteins / (yourProteins + yourFats + yourCarbs)) *
        (bmrForm.result - 100 + yourGoal * 300)) /
        4,
    );
    const maxProteins = floorToOne(
      ((yourProteins / (yourProteins + yourFats + yourCarbs)) *
        (bmrForm.result + 100 + yourGoal * 300)) /
        4,
    );
    const minFats = floorToOne(
      ((yourFats / (yourProteins + yourFats + yourCarbs)) *
        (bmrForm.result - 100 + yourGoal * 300)) /
        9,
    );
    const maxFats = floorToOne(
      ((yourFats / (yourProteins + yourFats + yourCarbs)) *
        (bmrForm.result + 100 + yourGoal * 300)) /
        9,
    );
    const minCarbs = floorToOne(
      ((yourCarbs / (yourProteins + yourFats + yourCarbs)) *
        (bmrForm.result - 100 + yourGoal * 300)) /
        4,
    );
    const maxCarbs = floorToOne(
      ((yourCarbs / (yourProteins + yourFats + yourCarbs)) *
        (bmrForm.result + 100 + yourGoal * 300)) /
        4,
    );

    saveBMR(bmrForm.result);
    saveProportions({
      ratioP: yourProteins,
      ratioF: yourFats,
      ratioC: yourCarbs,
      Pmin: minProteins,
      Pmax: maxProteins,
      Fmin: minFats,
      Fmax: maxFats,
      Cmin: minCarbs,
      Cmax: maxCarbs,
    });
  };

  handleSaveProportions = () => {
    const { proportionsForm } = this.state;
    const { proteins, fats, carbs } = proportionsForm;
    const { saveProportions, yourBMR, yourGoal } = this.props;
    if (proteins > 0 && fats >= 0 && carbs > 0) {
      const minProteins = floorToOne(
        ((proteins / (proteins + fats + carbs)) * (yourBMR - 100 + yourGoal * 300)) / 4,
      );
      const maxProteins = floorToOne(
        ((proteins / (proteins + fats + carbs)) * (yourBMR + 100 + yourGoal * 300)) / 4,
      );
      const minFats = floorToOne(
        ((fats / (proteins + fats + carbs)) * (yourBMR - 100 + yourGoal * 300)) / 9,
      );
      const maxFats = floorToOne(
        ((fats / (proteins + fats + carbs)) * (yourBMR + 100 + yourGoal * 300)) / 9,
      );
      const minCarbs = floorToOne(
        ((carbs / (proteins + fats + carbs)) * (yourBMR - 100 + yourGoal * 300)) / 4,
      );
      const maxCarbs = floorToOne(
        ((carbs / (proteins + fats + carbs)) * (yourBMR + 100 + yourGoal * 300)) / 4,
      );
      saveProportions({
        ratioP: proteins,
        ratioF: fats,
        ratioC: carbs,
        Pmin: minProteins,
        Pmax: maxProteins,
        Fmin: minFats,
        Fmax: maxFats,
        Cmin: minCarbs,
        Cmax: maxCarbs,
      });
      this.setState((prevState) => ({
        ...prevState,
        proportionsForm: {
          proteins: 0,
          fats: 0,
          carbs: 0,
          error: false,
        },
      }));
      return;
    }
    this.setState((prevState) => ({
      ...prevState,
      proportionsForm: {
        ...prevState.proportionsForm,
        error: true,
      },
    }));
  };

  handleGoalChange = (e) => {
    e.persist();
    this.setState((prevState) => ({
      ...prevState,
      goal: {
        value: +e.target.value,
        error: false,
      },
    }));
  };

  handleSaveGoal = () => {
    const { goal } = this.state;
    if (+goal.value === -2) {
      this.setState((prevState) => ({
        ...prevState,
        goal: {
          ...prevState.goal,
          error: true,
        },
      }));
      return;
    }
    const { saveGoal } = this.props;
    saveGoal(goal.value);
    this.setState((prevState) => ({
      ...prevState,
      goal: {
        value: -2,
        error: false,
      },
    }));
  };

  render() {
    const { bmrForm, proportionsForm, goal } = this.state;
    const { bodyMass, bodyHeight, age, activity, sex, error: errorBMR, result } = bmrForm;
    const { proteins, fats, carbs, error: propError } = proportionsForm;
    const { value, error: errorGoal } = goal;
    const { yourBMR, yourProteins, yourFats, yourCarbs, yourGoal } = this.props;

    const minProteins = floorToOne(
      ((yourProteins / (yourProteins + yourFats + yourCarbs)) * (yourBMR - 100 + yourGoal * 300)) /
        4,
    );
    const maxProteins = floorToOne(
      ((yourProteins / (yourProteins + yourFats + yourCarbs)) * (yourBMR + 100 + yourGoal * 300)) /
        4,
    );
    const minFats = floorToOne(
      ((yourFats / (yourProteins + yourFats + yourCarbs)) * (yourBMR - 100 + yourGoal * 300)) / 9,
    );
    const maxFats = floorToOne(
      ((yourFats / (yourProteins + yourFats + yourCarbs)) * (yourBMR + 100 + yourGoal * 300)) / 9,
    );
    const minCarbs = floorToOne(
      ((yourCarbs / (yourProteins + yourFats + yourCarbs)) * (yourBMR - 100 + yourGoal * 300)) / 4,
    );
    const maxCarbs = floorToOne(
      ((yourCarbs / (yourProteins + yourFats + yourCarbs)) * (yourBMR + 100 + yourGoal * 300)) / 4,
    );

    return (
      <>
        <Card
          title="Configuration"
          subtitle="You can configure your BMR width activity factor and Protein:Fat:Carbohydrates proportions based on your BMR and activity."
        >
          <div className="box">
            <h2 className="subtitle is-size-4 has-text-weight-semibold">
              {`Your current BMR: ${yourBMR} kcal`}
            </h2>
            <h2 className="subtitle is-size-4 has-text-weight-semibold">
              {` Your current proportions: ${yourProteins} : ${yourFats} : ${yourCarbs}`}
            </h2>
            <h2 className="subtitle is-size-4 has-text-weight-semibold">
              Your goal is to
              {yourGoal === -1 && ' loose weight'}
              {yourGoal === 0 && ' keep weight'}
              {yourGoal === 1 && ' gain weight'}
              , so you should eat:
              <br />
              <br />
              {` ${yourBMR - 100 + yourGoal * 300}-${yourBMR + 100 + yourGoal * 300}`} kcal
              <br />
              <br />
              {minProteins === maxProteins
                ? ` ~${maxProteins}g `
                : ` ~${minProteins}-${maxProteins + 1}g `}{' '}
              Proteins
              <br />
              {minFats === maxFats ? ` ~${maxFats}g ` : ` ~${minFats}-${maxFats + 1}g `} Fats
              <br />
              {minCarbs === maxCarbs ? ` ~${maxCarbs}g ` : ` ~${minCarbs}-${maxCarbs + 1}g `}{' '}
              Carbohydrates
            </h2>
          </div>
          <hr />
          <div className="box">
            <h2 className="subtitle is-size-3 has-text-weight-semibold">Calculate your BMR</h2>
            <p className="subtitle">
              Enter the following data to calculate your basal metabolic rate:
            </p>
            <div className="columns">
              <div className="column is-one-quarter">
                <div className="control">
                  <label htmlFor="body-mass" className="is-size-5 has-text-weight-semibold">
                    Body mass (in kg)
                    <input
                      id="body-mass"
                      className="input"
                      type="number"
                      min="0"
                      onChange={this.handleMassChange}
                      value={bodyMass}
                    />
                  </label>
                </div>
                <div className="control">
                  <label htmlFor="body-height" className="is-size-5 has-text-weight-semibold">
                    Body height (in cm)
                    <input
                      id="body-height"
                      className="input"
                      type="number"
                      min="0"
                      onChange={this.handleHeightChange}
                      value={bodyHeight}
                    />
                  </label>
                </div>
                <div className="control">
                  <label htmlFor="body-age" className="is-size-5 has-text-weight-semibold">
                    Age
                    <input
                      id="body-age"
                      className="input"
                      type="number"
                      min="0"
                      onChange={this.handleAgeChange}
                      value={age}
                    />
                  </label>
                </div>
              </div>
              <div className="column is-one-quarter">
                <div className="control">
                  <label htmlFor="physical-activity" className="is-size-5 has-text-weight-semibold">
                    Physical activity
                    <div className="select">
                      <select
                        onChange={this.handleActivityChange}
                        value={activity}
                        id="physical-activity"
                      >
                        <option value="0">Select activity level</option>
                        <option value="1.2">Almost none</option>
                        <option value="1.35">Little</option>
                        <option value="1.55">Medium</option>
                        <option value="1.75">Big</option>
                        <option value="2.05">Very heavy</option>
                      </select>
                    </div>
                  </label>
                </div>
                <br />
                <div className="control">
                  <label htmlFor="woman-button" className="radio is-size-5">
                    <input
                      id="woman-button"
                      type="radio"
                      name="woman"
                      value="1"
                      checked={sex === 1}
                      onChange={this.handleSexChange}
                    />
                    Woman
                  </label>
                  <label htmlFor="men-button" className="radio is-size-5">
                    <input
                      id="men-button"
                      type="radio"
                      name="men"
                      value="2"
                      checked={sex === 2}
                      onChange={this.handleSexChange}
                    />
                    Men
                  </label>
                </div>
              </div>
            </div>
            {errorBMR && (
              <p className="has-text-danger is-size-6">Please, fill up this form correctly</p>
            )}
            {result && <p className="has-text-info is-size-4">Your BMR is {result}</p>}
            <br />
            <button
              type="button"
              className="button is-primary"
              onClick={this.handleCalculateButton}
            >
              Calculate
            </button>
            {result && (
              <button type="button" className="button is-info" onClick={this.handleSaveBMR}>
                Save
              </button>
            )}
          </div>
          <hr />
          <div className="box">
            <h2 className="subtitle is-size-3 has-text-weight-semibold">
              Provide ingredients proportions
            </h2>
            <p className="subtitle">Enter the proportions of PROTEINS:FATS:CARBOHYDRATES:</p>
            <div className="columns">
              <div className="column is-one-quarter">
                <div className="control">
                  <label htmlFor="proteins" className="is-size-5 has-text-weight-semibold">
                    Proteins
                    <input
                      id="proteins"
                      className="input"
                      type="number"
                      min="0"
                      value={proteins}
                      onChange={this.handleProteinChange}
                    />
                  </label>
                </div>
                <div className="control">
                  <label htmlFor="fats" className="is-size-5 has-text-weight-semibold">
                    Fats
                    <input
                      id="fats"
                      className="input"
                      type="number"
                      min="0"
                      value={fats}
                      onChange={this.handleFatsChange}
                    />
                  </label>
                </div>
                <div className="control">
                  <label htmlFor="carbs" className="is-size-5 has-text-weight-semibold">
                    Carbohydrates
                    <input
                      id="carbs"
                      className="input"
                      type="number"
                      min="0"
                      value={carbs}
                      onChange={this.handleCarbsChange}
                    />
                  </label>
                </div>
              </div>
            </div>
            {propError && (
              <p className="has-text-danger is-size-6">
                Proteins and carbohydrates must be more than 0
              </p>
            )}
            {proteins > 0 && fats >= 0 && carbs > 0 && (
              <p className="has-text-info is-size-4">
                Your proportions are:
                {` ${proteins}:${fats}:${carbs}`}
              </p>
            )}
            <br />
            <button type="button" className="button is-info" onClick={this.handleSaveProportions}>
              Save
            </button>
          </div>

          <hr />

          <div className="box">
            <h2 className="subtitle is-size-3 has-text-weight-semibold">What is your goal?</h2>
            <p className="subtitle">Loose weight, Keep weight or gain weight</p>

            <div className="columns">
              <div className="column is-one-quarter">
                <div className="control">
                  <label htmlFor="goal" className="is-size-5 has-text-weight-semibold">
                    Your goal
                    <div className="select">
                      <select id="goal" onChange={this.handleGoalChange}>
                        <option value="-2">Select your goal</option>
                        <option value="-1">Loose weight</option>
                        <option value="0">Keep weight</option>
                        <option value="1">Gain weight</option>
                      </select>
                    </div>
                  </label>
                </div>
              </div>
            </div>
            {errorGoal && (
              <p className="has-text-danger is-size-6">
                Select option from dropdown menu before saving
              </p>
            )}
            {value > -2 && (
              <p className="has-text-info is-size-4">
                You selected to:
                {value === -1 && ' loose weight'}
                {value === 0 && ' keep weight'}
                {value === 1 && ' gain weight'}
              </p>
            )}
            <br />
            <button type="button" className="button is-info" onClick={this.handleSaveGoal}>
              Save
            </button>
          </div>
        </Card>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  const { BMR, ratioP, ratioF, ratioC, goal } = state.config;
  return {
    yourBMR: BMR,
    yourProteins: ratioP,
    yourFats: ratioF,
    yourCarbs: ratioC,
    yourGoal: goal,
  };
};

const mapDispatchToProps = (dispatch) => ({
  saveBMR: (BMRresult) => dispatch(saveBMRAction(BMRresult)),
  saveProportions: (properties) => dispatch(saveProportionsAction(properties)),
  saveGoal: (goal) => dispatch(saveGoalAction(goal)),
});

Configuration.propTypes = {
  yourBMR: PropTypes.number.isRequired,
  yourProteins: PropTypes.number.isRequired,
  yourFats: PropTypes.number.isRequired,
  yourCarbs: PropTypes.number.isRequired,
  yourGoal: PropTypes.number.isRequired,
  saveBMR: PropTypes.func.isRequired,
  saveProportions: PropTypes.func.isRequired,
  saveGoal: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Configuration);
