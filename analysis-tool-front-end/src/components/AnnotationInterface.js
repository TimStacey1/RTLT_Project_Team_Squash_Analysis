import React from 'react';
import { useParams } from 'react-router';

import AnnotationControls from './AnnotationControls';
import AnnotationList from './AnnotationList';
const axios = require('axios').default;
let match_id = window.location.pathname;
match_id = match_id.substring(7);

class AnnotationInterface extends React.Component {
  constructor(props){
    super(props);

  this.state = {
    annotations: [],
    match_details: [],
    show: false,
    shotMsg: " ",
    timeMsg: " ",
    title: "Edit Annotation",
  }
}


  componentDidMount = () => {
    axios.get('http://localhost:3001/annotate/'+match_id+'/all')
      .then(res => {
        const annotations = res.data;
        this.setState({ annotations });
      })

    axios.get('http://localhost:3001/match/all').then(res => {
      const obj = res.data.filter(item => item.id === match_id);
      const match_details = obj[0];

      this.setState({match_details});
    })
  }
  handler = (annotation) => {
    console.log(annotation);
    console.log(this.state.annotations);
    this.state.annotations.push(annotation);
    console.log(this.state.annotations);
    this.setState(state => ({...state, annotations: this.state.annotations}));

    console.log(this.state.annotations);

  }

  render() {
    return (
      <>
        <div className="grid grid-cols-12 grid-rows-4 gap-4 mx-4 h-desktop">
            <div className="col-span-2 row-span-4 h-full bg-blue-500">
                <AnnotationList data={this.state}/>
            </div>
            <div className="col-span-7 row-span-3 h-full bg-blue-500">
              Video goes here
            </div>
            <div className="col-span-3 row-span-4 h-full bg-gray-300">
              <AnnotationControls handler={this.handler} />
            </div>
            <div className="col-span-7 row-span-1 h-full bg-blue-500">
              Video Controls/Additional Annotation Controls go here
            </div>
        </div>
        </>
    );
  }
}

export default AnnotationInterface;
