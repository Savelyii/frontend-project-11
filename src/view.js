import onChange from 'on-change';

const clear = (elements) => {
  const { feedback, input } = elements;
  feedback.classList.remove('text-danger');
  feedback.classList.remove('text-success');
  input.classList.remove('is-invalid');
};
const render = (state, elements) => {
  const { feedback, input } = elements;
  feedback.textContent = state.message;
  if (state.status === 'success') {
    clear(elements);
    feedback.classList.add('text-success');
    input.value = '';
    input.focus();
  }
  if (state.status === 'failed') {
    clear(elements);
    feedback.classList.add('text-danger');
    input.classList.add('is-invalid');
  }
};
const watch = (state, elements) =>
  onChange(state, (path, value) => {
    console.log(elements);
    switch (path) {
      case 'form':
        console.log(value);
        render(value, elements);
        break;
      default:
        console.log('Default');
    }
  });

export default watch;
