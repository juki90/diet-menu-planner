import axios from 'axios';

const floorToOne = (n) => {
  const temp = Math.floor(n * 10);
  return temp / 10;
};

const saveDB = (state) => {
  const urlOrigin = window.location.origin;
  let token = localStorage.getItem('token');
  if (Array.isArray(token)) {
    token = token.join('');
  }

  if (token) {
    axios({
      url: `${urlOrigin}/api/`,
      method: 'post',
      data: {
        state,
      },
      headers: {
        'x-auth-token': token,
        'Content-Type': 'application/json',
      },
    });
  }
  return state;
};

export { floorToOne, saveDB };
