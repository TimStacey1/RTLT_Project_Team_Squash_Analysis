import React from 'react';
import AnnotationList from './AnnotationList';
import AnnotationVideo from './AnnotationVideo';
import AnnotationControls from './AnnotationControls';

const axios = require('axios').default;
const match_id = window.location.pathname.substring(7);

class AnnotationInterface extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      annotations: [],
      match_details: [],
      show: false,
      shotMsg: ' ',
      timeMsg: ' ',
      title: 'Edit Annotation'
    };
  }

  componentDidMount = () => {
    axios
      .get('http://localhost:3001/annotate/' + match_id + '/all')
      .then((res) => {
        const annotations = res.data;
        this.setState({ annotations });
      });

    axios.get('http://localhost:3001/match/all').then((res) => {
      const obj = res.data.filter((item) => item.id === match_id);
      const match_details = obj[0];

      this.setState({ match_details });
    });
  };
  handler = (annotation) => {
    this.state.annotations.push(annotation);
    this.setState((state) => ({
      ...state,
      annotations: this.state.annotations
    }));
  };

  render() {
    return (
      <>
        <div className="grid grid-cols-12 mx-2 w-full h-full">
          <div className="col-span-2 mr-1 h-desktop">
            <AnnotationList data={this.state} />
          </div>
          <div className="col-span-10 ml-1 mr-12 h-desktop">
            <AnnotationVideo />
          </div>
          <div className="w-controls h-desktop transition-all -right-96 fixed transform hover:-translate-x-96">
            <AnnotationControls handler={this.handler} />
          </div>
        </div>
      </>
    );
  }
}

export default AnnotationInterface;
