export default function AnnotationButton(props) {
    // If button is disabled have it greyed out. These are typically the shot type buttons
  if (props.disabled) {
    return (
      <button className="w-full h-full rounded-xl bg-gray-500 focus:outline-none text-lg">
        {props.name}
      </button>
    );
  }
  // What happens to the buttons if they are selected
  else if (props.selected) {
    return (
      <button
        className={
          'w-full h-full rounded-xl focus:outline-none text-lg bg-' +
          (props.type === 'game'
            ? 'red-700'
            : props.type === 'player'
            ? 'blue-900'
            : props.type === 'rally'
             ? 'yellow-700'
            : props.type === 'score'
            ? 'green-600'
            : 'yellow-600')
        }
      >
        {props.name}
      </button>
    );
  } // What happens to the buttons if they aren't disabled or selected
  else {
      return (
      <button
        className={
          'w-full h-full rounded-xl focus:outline-none text-lg bg-' +
          (props.type === 'game'
            ? 'red-600'
            : props.type === 'player'
                          ? 'blue-500'
            : props.type === 'rally'
            ? 'yellow-600'
            : props.type === 'score'
            ? 'green-500'
            : 'yellow-500') +
          ' hover:bg-' +
          (props.type === 'game'
            ? 'red-500'
            : props.type === 'player'
            ? 'blue-400'
            : props.type === 'rally'
            ? 'yellow-500'
            : props.type === 'score'
            ? 'green-400'
            : 'yellow-400')
        }
      >
        {props.name}
      </button>
    );
  }
}
