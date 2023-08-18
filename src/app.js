import * as yup from 'yup';
import axios from 'axios';
import i18next from 'i18next';
import watch from './view';
import ru from './locales/ru.js';
import parserRss from './parser';

const i18nextInstance = i18next.createInstance();
i18nextInstance.init({
  lng: 'ru',
  debug: true,
  resources: {
    ru,
  },
});
const validate = (url, urls) => yup.string().required().url('invalidUrl').notOneOf(urls, 'existsUrl').validate(url, urls);

const state = {
  form: {
    status: 'waiting',
    message: '',
  },
  urls: [],
  feeds: [],
  posts: [],
};

const elements = {
  form: document.querySelector('form'),
  feedback: document.querySelector('.feedback'),
  input: document.querySelector('.form-control'),
  feedsContainer: document.querySelector('.feeds'),
  postsContainer: document.querySelector('.posts'),
};
const watchedState = watch(state, elements, i18nextInstance);
const app = () => {
  elements.form.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const { value } = elements.input;
    validate(value, watchedState.urls)
      .then((url) => {
        watchedState.form = { status: 'success', message: 'success' };
        watchedState.urls.push(url);
        return url;
      })
      .then((url) => {
        return axios.get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(`${url}`)}`);
      })
      .then((res) => {
        const { feed, posts } = parserRss(res);
        watchedState.feeds.push(feed);
        watchedState.posts.push(...posts);
      })
      .catch((err) => {
        watchedState.form = { status: 'failed', message: err.message };
      });
  });
};
export default app;
