import onChange from 'on-change';

const clear = (elements) => {
  const { feedback, input } = elements;
  feedback.classList.remove('text-danger');
  feedback.classList.remove('text-success');
  input.classList.remove('is-invalid');
};
const renderForm = (state, elements, i18n) => {
  const { feedback, input } = elements;
  const { status, message } = state;
  feedback.textContent = i18n.t(`messages.${message}`);
  if (status === 'success') {
    clear(elements);
    feedback.classList.add('text-success');
    input.value = '';
    input.focus();
  }
  if (status === 'failed') {
    clear(elements);
    feedback.classList.add('text-danger');
    input.classList.add('is-invalid');
  }
};
const renderFeeds = (feeds, elements, i18n) => {
  const feedsElements = feeds.map((feed) => {
    const titleEl = document.createElement('h3');
    titleEl.textContent = feed.title;
    const descriptionEl = document.createElement('p');
    descriptionEl.textContent = feed.description;
    const feedEl = document.createElement('div');
    feedEl.append(titleEl, descriptionEl);
    return feedEl;
  });
  console.log(elements.feedsContainer);
  elements.feedsContainer.append(...feedsElements);
};
const renderPosts = (posts, elements, i18n) => {
  const postElements = posts.map((post) => {
    const postLink = document.createElement('a');
    postLink.textContent = post.title;
    postLink.href = post.link;
    const postButton = document.createElement('button');
    postButton.classList.add('btn', 'btn-outline-primary');
    postButton.textContent = 'Открыть';
    const postEl = document.createElement('div');
    postEl.append(postLink, postButton);
    return postEl;
  });
  elements.postsContainer.append(...postElements);
};

const watch = (state, elements, i18n) =>
  onChange(state, (path, value) => {
    switch (path) {
      case 'form':
        renderForm(value, elements, i18n);
        break;
      case 'feeds':
        renderFeeds(value, elements, i18n);
        break;
      case 'posts':
        renderPosts(value, elements, i18n);
        break;
      default:
        console.log('Default');
    }
  });

export default watch;
