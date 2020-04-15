import {
  SAVE_BMR,
  SAVE_PROPORTIONS,
  SAVE_GOAL,
  SAVE_NEW_DAY,
  EDIT_DAY,
  REMOVE_DAY,
  SAVE_NEW_MEAL,
  EDIT_MEAL,
  REMOVE_MEAL,
  RECOUNT_SUBSTANCES,
  ADD_INGREDIENT,
  REMOVE_INGREDIENT,
  EDIT_INGREDIENT,
  BOOKMARK_MEAL,
  BOOKMARK_INGREDIENT,
  REMOVE_BOOKMARKED_MEAL,
  REMOVE_BOOKMARKED_INGREDIENT,
  USER_REGISTER,
  USER_LOGIN,
  USER_LOGOUT,
} from '../actions';
import { floorToOne, saveDB } from '../utils';

const initialState = {
  days: [
    {
      id: 0,
      date: new Date(2020, 3, 26),
      path: '/2020-03-26',
      substances: {
        proteins: 111,
        fats: 52.1,
        carbs: 227,
        calories: 1798.9,
      },
      meals: [
        {
          type: 'Breakfast',
          name: 'Oatmeal with cheese',
          time: new Date(2020, 3, 26, 7, 30).toString(),
          substances: {
            proteins: 27.8,
            fats: 13.6,
            carbs: 74.1,
            calories: 543,
          },
          ingredients: [
            {
              name: 'Milk',
              quantity: 200,
              substances: {
                proteins: 6.4,
                fats: 6.4,
                carbs: 9.4,
                calories: 120,
              },
            },
            {
              name: 'Oatmeal',
              quantity: 100,
              substances: {
                proteins: 11.9,
                fats: 7.2,
                carbs: 63,
                calories: 378,
              },
            },
            {
              name: 'Cottage cheese',
              quantity: 50,
              substances: {
                proteins: 9.5,
                fats: 0,
                carbs: 1.7,
                calories: 45,
              },
            },
          ],
        },
        {
          type: 'Lunch',
          name: 'Chicken with rice and salad',
          time: new Date(2020, 3, 26, 12, 30).toString(),
          substances: {
            proteins: 48.66,
            fats: 52.1,
            carbs: 74.4,
            calories: 463.5,
          },
          ingredients: [
            {
              name: 'Chicken',
              quantity: 150,
              substances: {
                proteins: 34.5,
                fats: 2.5,
                carbs: 9.4,
                calories: 160.5,
              },
            },
            {
              name: 'Rice',
              quantity: 75,
              substances: {
                proteins: 11.9,
                fats: 0.5,
                carbs: 58.5,
                calories: 262.5,
              },
            },
            {
              name: 'Carrot',
              quantity: 50,
              substances: {
                proteins: 0.46,
                fats: 0.22,
                carbs: 3.05,
                calories: 18,
              },
            },
            {
              name: 'Green beans',
              quantity: 75,
              substances: {
                proteins: 1.8,
                fats: 0.15,
                carbs: 3.45,
                calories: 22.5,
              },
            },
          ],
        },
        {
          type: 'Snack 1',
          name: 'Apple and hazelnuts',
          time: new Date(2020, 3, 26, 17, 0).toString(),
          substances: {
            proteins: 5.93,
            fats: 25,
            carbs: 21.5,
            calories: 340.4,
          },
          ingredients: [
            {
              name: 'Apple',
              quantity: 150,
              substances: {
                proteins: 0.33,
                fats: 0.2,
                carbs: 17.1,
                calories: 75,
              },
            },
            {
              name: 'Hazelnuts',
              quantity: 40,
              substances: {
                proteins: 5.6,
                fats: 24.8,
                carbs: 4.4,
                calories: 265.4,
              },
            },
          ],
        },
        {
          type: 'Supper',
          name: 'Sandwiches with ham and salad',
          time: new Date(2020, 3, 26, 20, 0).toString(),
          substances: {
            proteins: 28.6,
            fats: 10.14,
            carbs: 57,
            calories: 452.4,
          },
          ingredients: [
            {
              name: 'Bread',
              quantity: 120,
              substances: {
                proteins: 10.2,
                fats: 6.24,
                carbs: 55.2,
                calories: 335,
              },
            },
            {
              name: 'Ham',
              quantity: 80,
              substances: {
                proteins: 16.8,
                fats: 2.4,
                carbs: 0.4,
                calories: 90.4,
              },
            },
            {
              name: 'Salad',
              quantity: 20,
              substances: {
                proteins: 1.6,
                fats: 1.5,
                carbs: 1.4,
                calories: 27.2,
              },
            },
          ],
        },
      ],
    },
  ],
  savedMeals: [
    {
      type: 'Breakfast',
      name: 'Oatmeal with cheese',
      substances: {
        proteins: 27.8,
        fats: 13.6,
        carbs: 74.1,
        calories: 543,
      },
      ingredients: [
        {
          name: 'Milk',
          quantity: 200,
          substances: {
            proteins: 6.4,
            fats: 6.4,
            carbs: 9.4,
            calories: 120,
          },
        },
        {
          name: 'Oatmeal',
          quantity: 100,
          substances: {
            proteins: 11.9,
            fats: 7.2,
            carbs: 63,
            calories: 378,
          },
        },
        {
          name: 'Cottage cheese',
          quantity: 50,
          substances: {
            proteins: 9.5,
            fats: 0,
            carbs: 1.7,
            calories: 45,
          },
        },
      ],
    },
    {
      type: 'Lunch',
      name: 'Chicken with rice and salad',
      time: new Date(2020, 3, 26, 12, 30).toString(),
      substances: {
        proteins: 48.66,
        fats: 3.37,
        carbs: 74.4,
        calories: 463.5,
      },
      ingredients: [
        {
          name: 'Chicken',
          quantity: 150,
          substances: {
            proteins: 34.5,
            fats: 2.5,
            carbs: 9.4,
            calories: 160.5,
          },
        },
        {
          name: 'Rice',
          quantity: 75,
          substances: {
            proteins: 11.9,
            fats: 0.5,
            carbs: 58.5,
            calories: 262.5,
          },
        },
        {
          name: 'Carrot',
          quantity: 50,
          substances: {
            proteins: 0.46,
            fats: 0.22,
            carbs: 3.05,
            calories: 18,
          },
        },
        {
          name: 'Green beans',
          quantity: 75,
          substances: {
            proteins: 1.8,
            fats: 0.15,
            carbs: 3.45,
            calories: 22.5,
          },
        },
      ],
    },
    {
      type: 'Snack',
      name: 'Apple and hazelnuts',
      time: new Date(2020, 3, 26, 17, 0).toString(),
      substances: {
        proteins: 5.93,
        fats: 25,
        carbs: 21.5,
        calories: 340.4,
      },
      ingredients: [
        {
          name: 'Apple',
          quantity: 150,
          substances: {
            proteins: 0.33,
            fats: 0.2,
            carbs: 17.1,
            calories: 75,
          },
        },
        {
          name: 'Hazelnuts',
          quantity: 40,
          substances: {
            proteins: 5.6,
            fats: 24.8,
            carbs: 4.4,
            calories: 265.4,
          },
        },
      ],
    },
    {
      type: 'Supper',
      name: 'Sandwiches with ham and salad',
      time: new Date(2020, 3, 26, 20, 0).toString(),
      substances: {
        proteins: 28.6,
        fats: 10.14,
        carbs: 57,
        calories: 452.4,
      },
      ingredients: [
        {
          name: 'Bread',
          quantity: 120,
          substances: {
            proteins: 10.2,
            fats: 6.24,
            carbs: 55.2,
            calories: 335,
          },
        },
        {
          name: 'Ham',
          quantity: 80,
          substances: {
            proteins: 16.8,
            fats: 2.4,
            carbs: 0.4,
            calories: 90.4,
          },
        },
        {
          name: 'Salad',
          quantity: 20,
          substances: {
            proteins: 1.6,
            fats: 1.5,
            carbs: 1.4,
            calories: 27.2,
          },
        },
      ],
    },
  ],
  savedIngredients: [
    {
      name: 'Apple',
      substances: {
        proteins: 0.26,
        fats: 0.17,
        carbs: 11.41,
        calories: 50,
      },
    },
    {
      name: 'Chicken',
      substances: {
        proteins: 21,
        fats: 1.5,
        carbs: 0,
        calories: 100,
      },
    },
  ],
  config: {
    BMR: 2200,
    goal: 0,
    ratioP: 2,
    ratioF: 1,
    ratioC: 3,
    Pmin: 174,
    Pmax: 191,
    Fmin: 38,
    Fmax: 42,
    Cmin: 262,
    Cmax: 287,
  },
  loggedAs: '',
};

const rootReducer = (state = initialState, action) => {
  let helper;
  switch (action.type) {
    case SAVE_BMR:
      return saveDB({
        ...state,
        config: {
          ...state.config,
          BMR: action.payload.BMRresult,
        },
      });
    case SAVE_PROPORTIONS:
      return saveDB({
        ...state,
        config: { ...state.config, ...action.payload.properties },
      });
    case SAVE_GOAL:
      return saveDB({
        ...state,
        config: {
          ...state.config,
          goal: action.payload.goal,
        },
      });
    case SAVE_NEW_DAY:
      return saveDB({
        ...state,
        days: [
          ...state.days,
          {
            id: Math.max(...state.days.map((d) => d.id)) + 1,
            date: action.payload.date,
            substances: {
              proteins: 0,
              fats: 0,
              carbs: 0,
              calories: 0,
            },
            path: `/${action.payload.date.getFullYear()}-${
              action.payload.date.getMonth().toString().length === 2
                ? action.payload.date.getMonth() + 1
                : `0${action.payload.date.getMonth() + 1}`
            }-${
              action.payload.date.getDate().toString().length === 2
                ? action.payload.date.getDate()
                : `0${action.payload.date.getDate()}`
            }`,
            meals: [],
          },
        ].sort((a, b) => new Date(a.date) > new Date(b.date)),
      });
    case EDIT_DAY:
      [helper] = state.days.filter((d) => d.id === action.payload.dayId);
      helper.date = action.payload.date;
      helper.path = `/${action.payload.date.getFullYear()}-${
        action.payload.date.getMonth().toString().length === 2
          ? action.payload.date.getMonth() + 1
          : `0${action.payload.date.getMonth() + 1}`
      }-${
        action.payload.date.getDate().toString().length === 2
          ? action.payload.date.getDate()
          : `0${action.payload.date.getDate()}`
      }`;
      return saveDB({
        ...state,
        days: [...state.days.filter((d) => d.id !== action.payload.dayId), helper].sort(
          (a, b) => new Date(a.date) > new Date(b.date),
        ),
      });
    case REMOVE_DAY:
      return saveDB({
        ...state,
        days: state.days
          .filter((d) => d.id !== action.payload.id)
          .sort((a, b) => new Date(a.date) > new Date(b.date)),
      });
    case REMOVE_MEAL:
      [helper] = state.days.filter((d) => d.id === action.payload.dayId);
      helper.meals = helper.meals.filter((m) => m.type !== action.payload.mealType);
      return saveDB({
        ...state,
        days: [...state.days.filter((d) => d.id !== action.payload.dayId), helper],
      });
    case SAVE_NEW_MEAL:
      [helper] = state.days.filter((d) => d.id === action.payload.dayId);
      helper.meals.push({
        ...action.payload.properties,
      });
      helper.meals.sort((a, b) => {
        return new Date(a.time) > new Date(b.time);
      });
      return saveDB({
        ...state,
        days: [...state.days.filter((d) => d.id !== action.payload.dayId), helper],
      });
    case EDIT_MEAL:
      [helper] = state.days.filter((d) => d.id === action.payload.dayId);
      helper.meals = helper.meals
        .map((m) => {
          if (m.type === action.payload.prevType) {
            return {
              ...m,
              ...action.payload.properties,
            };
          }
          return m;
        })
        .sort((a, b) => new Date(a.time) > new Date(b.time));
      return saveDB({
        ...state,
        days: [...state.days.filter((d) => d.id !== action.payload.dayId), helper].sort(
          (a, b) => new Date(a.date) > new Date(b.date),
        ),
      });
    case RECOUNT_SUBSTANCES:
      helper = state.days.map((d) => {
        const day = d;
        day.meals = d.meals.map((m) => {
          const meal = m;
          meal.substances.proteins = floorToOne(
            meal.ingredients.reduce((p, n) => p + n.substances.proteins, 0),
          );
          meal.substances.fats = floorToOne(
            meal.ingredients.reduce((p, n) => p + n.substances.fats, 0),
          );
          meal.substances.carbs = floorToOne(
            meal.ingredients.reduce((p, n) => p + n.substances.carbs, 0),
          );
          meal.substances.calories = floorToOne(
            meal.ingredients.reduce((p, n) => p + n.substances.calories, 0),
          );
          return meal;
        });
        day.substances.proteins = floorToOne(
          d.meals.reduce((p, n) => p + n.substances.proteins, 0),
        );
        day.substances.fats = floorToOne(d.meals.reduce((p, n) => p + n.substances.fats, 0));
        day.substances.carbs = floorToOne(d.meals.reduce((p, n) => p + n.substances.carbs, 0));
        day.substances.calories = floorToOne(
          d.meals.reduce((p, n) => p + n.substances.calories, 0),
        );
        return day;
      });
      return saveDB({
        ...state,
        helper,
      });
    case REMOVE_BOOKMARKED_MEAL:
      return saveDB({
        ...state,
        savedMeals: state.savedMeals.filter(
          (m) => m.name !== action.payload.name && m.type !== action.payload.type,
        ),
      });
    case ADD_INGREDIENT:
      [helper] = state.days.filter((d) => d.id === action.payload.dayId);
      helper.meals = helper.meals.map((m) => {
        if (m.type === action.payload.mealType) {
          m.ingredients.push({
            name: action.payload.name,
            quantity: action.payload.quantity,
            substances: action.payload.substances,
          });
        }
        return m;
      });
      return saveDB({
        ...state,
        days: [...state.days.filter((d) => d.id !== action.payload.dayId), helper].sort(
          (a, b) => new Date(a.date) > new Date(b.date),
        ),
      });
    case REMOVE_INGREDIENT:
      helper = state.days.map((d) => {
        if (d.id === action.payload.dayId) {
          d.meals.map((m) => {
            const meal = m;
            if (m.type === action.payload.mealType) {
              meal.ingredients = [...m.ingredients.filter((i) => i.name !== action.payload.name)];
            }
            return meal;
          });
          return d;
        }
        return d;
      });
      return saveDB({
        ...state,
        days: helper,
      });
    case EDIT_INGREDIENT:
      [helper] = state.days.filter((d) => d.id === action.payload.dayId);
      helper.meals = helper.meals.map((m) => {
        const meal = m;
        if (m.type === action.payload.mealType) {
          meal.ingredients = m.ingredients.map((i) => {
            const ingredient = i;
            if (
              i.name === action.payload.prevName &&
              (action.payload.name === action.payload.prevName || action.payload.name === '')
            ) {
              ingredient.quantity = action.payload.quantity;
              ingredient.substances = action.payload.substances;
            }
            if (
              i.name === action.payload.prevName &&
              action.payload.name !== action.payload.prevName
            ) {
              ingredient.name = action.payload.name;
            }
            return i;
          });
        }
        return m;
      });
      return saveDB({
        ...state,
        days: [...state.days.filter((d) => d.id !== action.payload.dayId), helper].sort(
          (a, b) => new Date(a.date) > new Date(b.date),
        ),
      });
    case BOOKMARK_MEAL:
      return saveDB({
        ...state,
        savedMeals: [
          {
            name: action.payload.name,
            substances: action.payload.substances,
            ingredients: action.payload.ingredients,
          },
          ...state.savedMeals,
        ],
      });
    case REMOVE_BOOKMARKED_INGREDIENT:
      helper = state.savedIngredients.filter((i) => i.name !== action.payload.name);
      return saveDB({
        ...state,
        savedIngredients: helper,
      });
    case BOOKMARK_INGREDIENT:
      return saveDB({
        ...state,
        savedIngredients: [
          { name: action.payload.name, substances: action.payload.substances },
          ...state.savedIngredients,
        ],
      });
    case USER_REGISTER: {
      if (action.payload.data.error) {
        return state;
      }
      localStorage.removeItem('token');
      localStorage.removeItem('loggedAs');
      localStorage.setItem('token', action.payload.data.token);
      localStorage.setItem('loggedAs', action.payload.data.email);
      return { ...state, loggedAs: action.payload.data.email };
    }
    case USER_LOGIN: {
      if (action.payload.data.error) {
        return state;
      }
      localStorage.removeItem('token');
      localStorage.removeItem('loggedAs');
      localStorage.setItem('token', action.payload.data.token);
      localStorage.setItem('loggedAs', action.payload.data.state.loggedAs);
      return action.payload.data.state;
    }
    case USER_LOGOUT: {
      localStorage.removeItem('token');
      localStorage.removeItem('loggedAs');
      return initialState;
    }
    default:
      return state;
  }
};

export default rootReducer;
