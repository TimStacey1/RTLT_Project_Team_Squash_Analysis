export default function AnnotationButton(props) {
  if (props.disabled) {
    return (
      <button className="w-full h-full rounded-xl bg-gray-500 focus:outline-none text-lg">
        {props.name}
      </button>
    );
  } else if (props.selected) {
    return (
      <button
        className={
          'w-full h-full rounded-xl focus:outline-none text-lg bg-' +
          (props.type === 'game'
            ? 'red-700'
            : props.type === 'player'
            ? 'blue-700'
            : 'yellow-600')
        }
      >
        {props.name}
      </button>
    );
  } else {
    return (
      <button
        className={
          'w-full h-full rounded-xl focus:outline-none text-lg bg-' +
          (props.type === 'game'
            ? 'red-600'
            : props.type === 'player'
            ? 'blue-500'
            : 'yellow-500') +
          ' hover:bg-' +
          (props.type === 'game'
            ? 'red-500'
            : props.type === 'player'
            ? 'blue-400'
            : 'yellow-400')
        }
      >
        {props.name}
      </button>
    );
  }
}
