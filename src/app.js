import * as yup from 'yup';
import axios from 'axios';
import i18next from 'i18next';
import watch from './view';
import ru from './locales/ru.js';
import parserRss from './parser';
import _ from 'lodash';

const i18nextInstance = i18next.createInstance();
i18nextInstance.init({
  lng: 'ru',
  debug: true,
  resources: {
    ru,
  },
});
const validate = (url, urls) => yup.string().required().url('invalidUrl').notOneOf(urls, 'existsUrl').validate(url, urls);
const fetchRss = (url) => {
  return axios.get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(`${url}`)}`);
};
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
  feedTitle: document.querySelector('.feed-title'),
  feedList: document.querySelector('.feed-list'),
  postsTitle: document.querySelector('.posts-title'),
  postsList: document.querySelector('.posts-list'),
};
const watchedState = watch(state, elements, i18nextInstance);
const app = () => {
  elements.form.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const { value } = elements.input;
    validate(value, watchedState.urls)
      .then((url) => {
        watchedState.form = { status: 'loading', message: 'loading' };
        return fetchRss(url);
      })
      .then((res) => {
        const { feed, posts } = parserRss(res);
        feed.id = _.uniqueId();
        posts.forEach((post) => {
          post.id = _.uniqueId();
        });

        watchedState.urls.push(res.data.status.url);
        watchedState.feeds.unshift(feed);
        watchedState.posts.unshift(...posts);
        watchedState.form = { status: 'success', message: 'success' };
      })
      .catch((err) => {
        if (err.isParsingError) {
          err.message = 'parseError';
        } else if (err.isAxiosError) {
          err.message = 'networkError';
        }
        watchedState.form = { status: 'failed', message: err.message };
      });
  });
};
export default app;
