import axios from 'axios';

export const SAVE_BMR = 'SAVE_BMR';
export const SAVE_PROPORTIONS = 'SAVE_PROPORTIONS';
export const SAVE_GOAL = 'SAVE_GOAL';
export const SAVE_NEW_DAY = 'SAVE_NEW_DAY';
export const EDIT_DAY = 'EDIT_DAY';
export const SAVE_NEW_MEAL = 'SAVE_NEW_MEAL';
export const EDIT_MEAL = 'EDIT_MEAL';
export const REMOVE_DAY = 'REMOVE_DAY';
export const REMOVE_MEAL = 'REMOVE_MEAL';
export const RECOUNT_SUBSTANCES = 'RECOUNT_SUBSTANCES';
export const ADD_INGREDIENT = 'ADD_INGREDIENT';
export const REMOVE_INGREDIENT = 'REMOVE_INGREDIENT';
export const EDIT_INGREDIENT = 'EDIT_INGREDIENT';
export const BOOKMARK_MEAL = 'BOOKMARK_MEAL';
export const BOOKMARK_INGREDIENT = 'BOOKMARK_INGREDIENT';
export const REMOVE_BOOKMARKED_MEAL = 'REMOVE_BOOKMARKED_MEAL';
export const REMOVE_BOOKMARKED_INGREDIENT = 'REMOVE_BOOKMARKED_INGREDIENT';

export const USER_REGISTER = 'USER_REGISTER';
export const USER_LOGIN = 'USER_LOGIN';
export const USER_LOGOUT = 'USER_LOGOUT';

const urlOrigin = window.location.origin;

export const saveBMR = (BMRresult) => {
  return {
    type: SAVE_BMR,
    payload: {
      BMRresult,
    },
  };
};

export const saveProportions = (properties) => {
  return {
    type: SAVE_PROPORTIONS,
    payload: {
      properties,
    },
  };
};

export const saveGoal = (goal) => {
  return {
    type: SAVE_GOAL,
    payload: {
      goal,
    },
  };
};

export const saveNewDay = (date) => {
  return {
    type: SAVE_NEW_DAY,
    payload: {
      date,
    },
  };
};

export const editDay = (dayId, date) => {
  return {
    type: EDIT_DAY,
    payload: {
      dayId,
      date,
    },
  };
};

export const removeDay = (id) => {
  return {
    type: REMOVE_DAY,
    payload: {
      id,
    },
  };
};

export const removeMeal = (dayId, mealType) => {
  return {
    type: REMOVE_MEAL,
    payload: {
      dayId,
      mealType,
    },
  };
};

export const removeIngredient = (dayId, mealType, name) => {
  return {
    type: REMOVE_INGREDIENT,
    payload: {
      dayId,
      mealType,
      name,
    },
  };
};

export const saveNewMeal = (dayId, properties) => {
  return {
    type: SAVE_NEW_MEAL,
    payload: {
      dayId,
      properties,
    },
  };
};

export const editMeal = (dayId, properties, prevType) => {
  return {
    type: EDIT_MEAL,
    payload: {
      dayId,
      properties,
      prevType,
    },
  };
};

export const recountSubstances = () => {
  return {
    type: RECOUNT_SUBSTANCES,
  };
};

export const removeBookmarkedMeal = (type, name) => {
  return {
    type: REMOVE_BOOKMARKED_MEAL,
    payload: {
      type,
      name,
    },
  };
};

export const addIngredient = (dayId, mealType, name, quantity, substances) => {
  return {
    type: ADD_INGREDIENT,
    payload: {
      dayId,
      mealType,
      name,
      quantity,
      substances,
    },
  };
};

export const editIngredient = (dayId, mealType, name, quantity, substances, prevName) => {
  return {
    type: EDIT_INGREDIENT,
    payload: {
      dayId,
      mealType,
      name,
      quantity,
      substances,
      prevName,
    },
  };
};

export const bookmarkMeal = (name, substances, ingredients) => {
  return {
    type: BOOKMARK_MEAL,
    payload: {
      name,
      substances,
      ingredients,
    },
  };
};

export const removeBookmarkedIngredient = (name) => {
  return {
    type: REMOVE_BOOKMARKED_INGREDIENT,
    payload: {
      name,
    },
  };
};

export const bookmarkIngredient = (name, substances) => {
  return {
    type: BOOKMARK_INGREDIENT,
    payload: {
      name,
      substances,
    },
  };
};

export const register = (email, password, state, registerErr, registerSuccess) => (dispatch) => {
  const newState = {
    ...state,
    loggedAs: email,
  };
  return axios
    .post(`${urlOrigin}/api/register`, { email, password, state: newState })
    .then((payload) => {
      if (payload.data.error) {
        registerErr(payload.data.error);
        return;
      }
      dispatch({
        type: USER_REGISTER,
        payload,
      });
      registerSuccess();
    })
    .catch(() => {
      registerErr('An error occured during processing your request. Check if you are online');
    });
};

export const login = (email, password, error, loginSuccess) => (dispatch) => {
  return axios
    .post(`${urlOrigin}/api/login`, {
      email,
      password,
    })
    .then((payload) => {
      if (payload.data.error) {
        error(payload.data.error);
        return;
      }
      dispatch({
        type: USER_LOGIN,
        payload,
      });
      loginSuccess();
    })
    .catch(() => {
      error('An error occured during processing your request. Check if you are online');
    });
};

export const logout = () => {
  return {
    type: USER_LOGOUT,
  };
};
