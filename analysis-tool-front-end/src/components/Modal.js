import React from 'react';

export default class Modal extends React.Component {
  onClose = (e) => {
    this.props.onClose && this.props.onClose(e);
  };
  render() {
    if (!this.props.show) {
      return null;
    }
    return (
      <div className="modal" id="modal">
        <h2 className="text-center">{this.props.title}</h2>
        {this.props.children}
      </div>
    );
  }
}
