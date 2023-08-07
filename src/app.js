import * as yup from 'yup';
import watch from './view';
import i18next from 'i18next';
import ru from './locales/ru.js';

// const globalFunction = () => {
//   console.log('Start!');
// };

const i18nextInstance = i18next.createInstance();
i18nextInstance.init({
  lng: 'ru',
  debug: true,
  resources: {
    ru,
  },
});
console.log(i18nextInstance.t('title'));
const validate = (url, urls) => yup.string().required().url('invalidUrl').notOneOf(urls, 'existsUrl').validate(url, urls);

const state = {
  form: {
    status: 'waiting',
    message: '',
  },
  urls: [],
};

const elements = {
  form: document.querySelector('form'),
  feedback: document.querySelector('.feedback'),
  input: document.querySelector('.form-control'),
};
const watchedState = watch(state, elements, i18nextInstance);
elements.form.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const { value } = elements.input;
  validate(value, watchedState.urls)
    .then((url) => {
      watchedState.form = { status: 'success', message: 'success' };
      watchedState.urls.push(url);
      return url;
    })
    // .then((url) => {
    //   axios;
    // })
    .catch((err) => {
      watchedState.form = { status: 'failed', message: err.message };
      console.log(i18nextInstance.t('title'));
    });
});

// export default globalFunction;
