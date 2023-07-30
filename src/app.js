import * as yup from 'yup';
import watch from './view';

const globalFunction = () => {
  console.log('Start!');
};

const validate = (url, urls) => yup.string().required().url('Invalid URL').notOneOf(urls, 'url exists').validate(url, urls);

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
const watchedState = watch(state, elements);
elements.form.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const { value } = elements.input;
  validate(value, watchedState.urls)
    .then((url) => {
      watchedState.form = { status: 'success', message: 'Успешно загружено' };
      watchedState.urls.push(url);
    })
    .catch((err) => {
      if (err.message === 'Invalid URL') {
        watchedState.form = { status: 'failed', message: 'Невалидная ссылка' };
      }
      if (err.message === 'url exists') {
        watchedState.form = { status: 'failed', message: 'Ссылка уже добалена' };
      }
    });
});

export default globalFunction;
