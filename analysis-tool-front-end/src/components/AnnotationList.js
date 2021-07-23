import React from 'react';
import Modal from './Modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';


const annotations = [
    ["FH-V-Lob", "00:02:35"],
    ["FH-B-Crosscourt", "00:02:35"],
    ["FH-B-Kill", "00:02:35"],

];

class AnnotationList extends React.Component {
  state = {
      show: false,
      message: " ",
      title: "Edit Annotation",
    };
    showModal = (messageText) => {
    this.setState({
      show: !this.state.show,
      message: messageText,
      title: "Edit Annotation",

    });
  };

  constructor(props) {

      super(props);

      this.state = {
          annotations: annotations,
      }
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

<table className="table-fixed bg-white w-full">
  <thead>
    <tr>
      <th className="w-6/8 ...">Annotation</th>
      <th className="w-2/8 ...">Time</th>


    </tr>
  </thead>
  <tbody >

  <Modal onClose={this.showModal} show={this.state.show} title={this.state.title}> {this.state.message}</Modal>

    {
    this.state.annotations.map((key, index) => {

      return( <>


        <tr className="text-center border-t-2 border-fuchsia-600">
        <div class='has-tooltip'>
    <span class='tooltip shadow-lg px-3 py-1 bg-blue-600 text-white -mt-8'>

    <button type="button" onClick={e => {
              this.showModal(annotations[index][0]);
         }}><FontAwesomeIcon className="pr-1" icon={faEdit} />Edit </button> |
    <button type="button" className="pl-2" onClick={() => this.onDeleteByIndex(index)}>
                <FontAwesomeIcon  icon={faTrash} /> Remove
              </button></span>
      <td className=""> <span className="overflow-x-hidden w-full px-2" >{key[0]} </span> </td>
      </div>

      <td><a className="hover:text-blue-500" href="" >{annotations[index][1]}</a>

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
