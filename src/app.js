import * as yup from 'yup';
import axios from 'axios';
import i18next from 'i18next';
import _ from 'lodash';
import watch from './view';
import ru from './locales/ru.js';
import parserRss from './parser';

const i18nextInstance = i18next.createInstance();
i18nextInstance.init({
  lng: 'ru',
  resources: {
    ru,
  },
});
const validate = (url, urls) => yup.string()
  .required()
  .url('invalidUrl')
  .notOneOf(urls, 'existsUrl')
  .validate(url, urls);

const buildURL = (url) => {
  const newUrl = new URL('https://allorigins.hexlet.app/get');
  newUrl.searchParams.set('disableCache', true);
  newUrl.searchParams.set('url', url);
  return newUrl;
};

const addFeed = (url, data, state) => {
  const { feed, posts } = data;
  feed.id = _.uniqueId();
  feed.url = url;
  posts.forEach((post) => {
    post.id = _.uniqueId();
  });
  state.feeds.unshift(feed);
  state.posts.unshift(...posts);
  state.urls.push(url);
};

const fetchRss = (url, state) => {
  axios
    .get(buildURL(url))
    .then((response) => {
      const data = parserRss(response);
      addFeed(url, data, state);
      state.form = { status: 'success', message: 'success' };
    })
    .catch((err) => {
      if (err.isParsingError) {
        err.message = 'parseError';
      } else if (err.isAxiosError) {
        err.message = 'networkError';
      }
      state.form = { status: 'failed', message: err.message };
    });
};

const state = {
  form: {
    status: 'waiting',
    message: '',
  },
  urls: [],
  feeds: [],
  posts: [],
  postsIds: [],
  modalId: '',
};

const elements = {
  form: document.querySelector('form'),
  feedback: document.querySelector('.feedback'),
  input: document.querySelector('.form-control'),
  feedTitle: document.querySelector('.feed-title'),
  feedList: document.querySelector('.feed-list'),
  postsTitle: document.querySelector('.posts-title'),
  postsList: document.querySelector('.posts-list'),
  modal: document.querySelector('.modal'),
};
const watchedState = watch(state, elements, i18nextInstance);

const app = () => {
  elements.form.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const { value } = elements.input;
    validate(value.trim(), watchedState.urls)
      .then((url) => {
        fetchRss(url, watchedState);
      })
      .catch((err) => {
        watchedState.form = { status: 'failed', message: err.message };
      });
  });
};

const updatePosts = () => {
  const urls = watchedState.feeds.map((feed) => feed.url);
  const promises = urls.map((url) => axios
    .get(buildURL(url))
    .then((updatedResponse) => {
      const updatedParsedContent = parserRss(updatedResponse);
      const { posts: newPosts } = updatedParsedContent;
      const addedPostsLinks = watchedState.posts.map((post) => post.link);
      const addedNewPosts = newPosts.filter((post) => !addedPostsLinks.includes(post.link));
      watchedState.posts = addedNewPosts.concat(watchedState.posts);
    })
    .catch((err) => {
      throw err;
    }));
  Promise.all(promises).finally(() => setTimeout(() => updatePosts(), 5000));
};
updatePosts();

elements.postsList.addEventListener('click', (evt) => {
  if (evt.target.classList.contains('btn')) {
    watchedState.postsIds.push(evt.target.dataset.postId);
    watchedState.modalId = evt.target.dataset.postId;
  }
});

export default app;
