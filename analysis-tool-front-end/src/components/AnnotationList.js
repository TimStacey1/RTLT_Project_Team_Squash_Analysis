import React from 'react';
import Modal from './Modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

let match_id = window.location.pathname;
match_id = match_id.substring(7);

const axios = require('axios').default;

class AnnotationList extends React.Component {
  constructor(props){
    super(props);
  this.state = props.data;
}



    showModal = (shotText, timeText) => {
    this.setState({
      show: !this.state.show,
      shotMsg: shotText,
      timeMsg: timeText,
      title: "Edit Annotation",

    });
  };

  handleChange = (event, field) => {
    this.setState({ [field]: event.target.value });
  }


  onDeleteByIndex = (index) => {
      const newCountries = [...this.state.annotations];
      newCountries.splice(index, 1);

      this.setState(state => ({
          annotations: newCountries
      }));
  }

    render() {

      return (
          <>

                  <div className="container mx-auto mb-10 overflow-y-auto h-full p-1	">
                  <h1 className="text-white text-center text-lg font-bold mb-1" > {this.props.data.match_details.title} Annotations </h1>

<table className="table-fixed bg-white w-full">
  <thead>
    <tr>
      <th className="w-6/8 ...">Annotation </th>
      <th className="w-2/8 ...">Time</th>


    </tr>
  </thead>
  <tbody >

  <Modal onClose={this.showModal} show={this.state.show} title={this.state.title}> Shot: {this.state.shotMsg} <br /> Time: <input type="number" onChange={(event)=>this.handleChange(event, "timeMsg")} value={this.state.timeMsg} /></Modal>

    {
    this.props.data.annotations.map((annotation, index) => {

      return( <>


        <tr className="text-center border-t-2 border-fuchsia-600">
        <div class='has-tooltip'>
    <span class='tooltip shadow-lg px-3 py-1 bg-blue-600 text-white -mt-8'>

    <button type="button" onClick={e => {
              this.showModal((annotation.components.hand + "-" + annotation.components.approach + "-" + annotation.components.shot),(annotation.timestamp));
         }}><FontAwesomeIcon className="pr-1" icon={faEdit} />Edit </button> |
    <button type="button" className="pl-2" onClick={() => this.onDeleteByIndex(index)}>
                <FontAwesomeIcon  icon={faTrash} /> Remove
              </button></span>
      <td className=""> <span className="overflow-x-hidden w-full px-2" >{annotation.components.hand}-{annotation.components.approach}-{annotation.components.shot}</span> </td>
      </div>

      <td><a className="hover:text-blue-500" href="" >{annotation.timestamp}</a>

      </td>
        </tr>
</>
      )
        } )
    }
  </tbody>
</table>
</div>


        </>

      );
    }
}

export default AnnotationList;
