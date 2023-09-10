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
    elements.feedTitle.textContent = i18n.t('feedTitle');

    const titleEl = document.createElement('h3');
    titleEl.classList.add('h6', 'm-0');
    titleEl.textContent = feed.title;
    const descriptionEl = document.createElement('p');
    descriptionEl.classList.add('m-0', 'small', 'text-black-50');
    descriptionEl.textContent = feed.description;
    const feedEl = document.createElement('li');
    feedEl.classList.add('list-group-item', 'border-0', 'border-end-0');
    feedEl.append(titleEl, descriptionEl);
    return feedEl;
  });
  elements.feedList.innerHTML = '';
  elements.feedList.append(...feedsElements);
};

const renderPosts = (state, elements, i18n) => {
  const { posts, postsIds } = state;
  const postElements = posts.map((post) => {
    elements.postsTitle.textContent = i18n.t('postTitle');
    const liPosts = document.createElement('li');
    liPosts.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    const postLink = document.createElement('a');
    if (postsIds.includes(post.id)) {
      postLink.classList.add('fw-normal');
    } else {
      postLink.classList.add('fw-bold');
    }
    postLink.textContent = post.title;
    postLink.target = '_blank';
    postLink.href = post.link;
    const postButton = document.createElement('button');
    postButton.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    // postButton.setAttribute('data-post-id', post.id);
    postButton.setAttribute('data-post-id', post.id);
    postButton.setAttribute('data-bs-toggle', 'modal');
    postButton.setAttribute('data-bs-target', '#modal');
    postButton.textContent = i18n.t('buttonText');
    liPosts.append(postLink, postButton);
    return liPosts;
  });
  elements.postsList.innerHTML = '';
  elements.postsList.append(...postElements);
};

const renderModal = (state, elements, i18n) => {
  const { posts, modalId } = state;
  const post = posts.find((p) => p.id === modalId);
  if (post) {
    const modalTitle = elements.modal.querySelector('.modal-title');
    const modalBody = elements.modal.querySelector('.modal-body');
    const modalLink = elements.modal.querySelector('.open-article');
    // const titleText = i18n.t('modalTitle');
    // const descriptionText = i18n.t('modalDescription');
    modalTitle.textContent = post.title;
    modalBody.textContent = post.description;
    modalLink.setAttribute('href', post.link);
  }
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
        renderPosts(state, elements, i18n);
        break;
      case 'postsIds':
        renderPosts(state, elements, i18n);
        break;
      case 'modalId':
        renderModal(state, elements, i18n);
        break;
      default:
    }
  });

export default watch;
