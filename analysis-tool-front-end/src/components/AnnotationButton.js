export default function AnnotationButton(props) {
  if (props.disabled) {
    return (
      <button className="w-full h-full rounded-xl bg-gray-500 focus:outline-none">
        {props.name}
      </button>
    );
  } else if (props.selected) {
    return (
      <button className="w-full h-full rounded-xl bg-yellow-300 focus:outline-none">
        {props.name}
      </button>
    );
  } else {
    return (
      <button className="w-full h-full rounded-xl bg-yellow-500 hover:bg-yellow-300 focus:outline-none">
        {props.name}
      </button>
    );
  }
}