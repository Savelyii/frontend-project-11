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
const watch = (state, elements, i18n) =>
  onChange(state, (path, value) => {
    switch (path) {
      case 'form':
        renderForm(value, elements, i18n);
        break;
      default:
        console.log('Default');
    }
  });

export default watch;
