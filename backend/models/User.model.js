const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  state: {
    days: {
      type: Array,
      required: true,
    },
    savedMeals: {
      type: Array,
      required: true,
    },
    savedIngredients: {
      type: Array,
      required: true,
    },
    config: {
      BMR: {
        type: Number,
        required: true,
      },
      goal: {
        type: Number,
        required: true,
      },
      ratioP: {
        type: Number,
        required: true,
      },
      ratioF: {
        type: Number,
        required: true,
      },
      ratioC: {
        type: Number,
        required: true,
      },
      Pmin: {
        type: Number,
        required: true,
      },
      Pmax: {
        type: Number,
        required: true,
      },
      Fmin: {
        type: Number,
        required: true,
      },
      Fmax: {
        type: Number,
        required: true,
      },
      Cmin: {
        type: Number,
        required: true,
      },
      Cmax: {
        type: Number,
        required: true,
      },
    },
    loggedAs: {
      type: String,
      required: true,
    },
  },
});

module.exports = mongoose.model('user', userSchema);
