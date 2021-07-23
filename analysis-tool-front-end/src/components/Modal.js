import React from "react";
export default class Modal extends React.Component {
  onClose = e => {
    this.props.onClose && this.props.onClose(e);
  };
  render() {
    if (!this.props.show) {
      return null;
    }
    return (

      <div class="modal" id="modal">
        <h2>{this.props.title}</h2>
        <div class="content">{this.props.children}</div>
        <div class="actions">
          <button  class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2" onClick={this.onClose}>
            Cancel
          </button>
          <button  class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Save
          </button>
        </div>
      </div>
    );
  }
}
