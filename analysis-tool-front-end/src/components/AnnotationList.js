import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

export default function AnnotationList(props) {
  const { baseUrl, match, updateAnnotations, jumpToAnnotation } = props;
  const [annotations, setAnnotations] = useState([]);
  const [filterAnnotations, setFilterAnnotations] = useState([]);
  const [annotationToRemove, setAnnotationToRemove] = useState({});
  const [show, setShow] = useState(false);
  const [showFilter, setFilterShow] = useState(false);
  const [filterTime, setFilterTime] = useState({
    startTimeM: 0,
    startTimeS: 0,
    endTimeM: 0,
    endTimeS: 0
  });
  const [checkedState, setCheckedState] = useState(
    new Array(12).fill(false)
    );

    
  const [modalContent, setModalContent] = useState({});
  var unique_shots = [...new Set(annotations.map(item => item.shot.id))];

  useEffect(() => {
    if (Object.entries(annotationToRemove).length !== 0) {
      axios
        .post(
          baseUrl +
            '/annotate/' +
            match.id +
            '/' +
            annotationToRemove.id +
            '/remove'
        )
        .then((res) => {
          console.log(res.data);
          setAnnotationToRemove({});
          updateAnnotations();
        });
    }

    if (match.id) {
      axios
        .get(baseUrl + '/annotate/' + match.id + '/all')
        .then((res) => res.data)
        .then((annotations) => {
          setAnnotations(annotations);
          setFilterAnnotations(annotations);
        });
    }
  }, [annotationToRemove, props]);

  const clearFilters = () => {
    const updatedCheckedState =  new Array(12).fill(false);
    setCheckedState(updatedCheckedState);
    setFilterAnnotations(annotations);
    setFilterTime({
      startTimeM: 0,
      startTimeS: 0,
      endTimeM: 0,
      endTimeS: 0,

    })
  }

  const shotFilterChange = (position) => {

    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );

    const indices = updatedCheckedState.reduce(
  (out, bool, index) => bool ? out.concat(index) : out,
  []
)
  var unique = [];
  for (var i = 0; i < indices.length; i++) {
    unique.push(unique_shots[indices[i]]) ;

  }

  let newAnnotations = annotations.filter(item => unique.includes(item.shot.id));

  console.log(newAnnotations);
  setFilterAnnotations(newAnnotations);

  setCheckedState(updatedCheckedState);

  let checker = checkedState => checkedState.every(v => v === false);
  if (checker(updatedCheckedState)) {
      setFilterAnnotations(annotations);
    }
};

  const filterTimeChange = (evt,field) => {
    let newAnnotations = filterTime;
    newAnnotations[field] = evt.target.value;
    const startS = (Number(newAnnotations.startTimeM)*60)+Number(newAnnotations.startTimeS);
    const endS = (Number(newAnnotations.endTimeM)*60)+Number(newAnnotations.endTimeS);
    newAnnotations = annotations.filter(item => (item.timestamp >= startS) && item.timestamp <= endS);
    setFilterAnnotations(newAnnotations);
}

const toggleFilter = () => setFilterShow(!showFilter);

const showModal = (shotText, timeText) => {
    if (shotText && timeText) {
      setModalContent({
        shotText: shotText,
        timeText: timeText
      });
    }
    setShow(!show);
  };

  const handleTimeChange = (newTimeValue) => {
    console.log(newTimeValue);
    setModalContent({
      shotText: modalContent.shotText,
      timeText: newTimeValue
    });
  };

  const removeAnnotation = (annotation) => {
    setAnnotationToRemove(annotation);
  };

  const convertSecondsToMS = (numSeconds) => {
    numSeconds = Number(numSeconds);
    const hours = Math.floor(numSeconds / 3600);
    const minutes = Math.floor((numSeconds % 3600) / 60);
    const seconds = Math.floor((numSeconds % 3600) % 60);
    const hoursDisplay = hours > 0 ? (hours >= 10 ? hours : '0' + hours) : '00';
    const minutesDisplay =
      minutes > 0 ? (minutes >= 10 ? minutes : '0' + minutes) : '00';
    const secondsDisplay =
      seconds > 0 ? (seconds >= 10 ? seconds : '0' + seconds) : '00';
    return hoursDisplay + ':' + minutesDisplay + ':' + secondsDisplay;
  };


  const Filter = () =>

  <div className="modal" id="modal">
  <h2 className="text-center">Filter Annotations</h2>
  <div className="content">
  <div className="container">
  <div className="grid grid-cols-12">
  <div className="col-start-1 col-end-6  border-2 p-2">
        <h3 className="font-bold text-lg mb-1 text-center">Filter by shot</h3>
  {unique_shots.map((shot, index) => {
    return (
      <>
        <label className="block">
        <input type="checkbox" class="form-checkbox" checked={checkedState[index]} onChange={() => shotFilterChange(index, shot)} />
          <span className="ml-2">{shot}</span> 
        </label>
      </>)
   })}
           </div>

   <div className="col-start-7 col-end-13 border-2 p-2">
          <h3 className="font-bold text-lg mb-1 text-center">Filter by time</h3>
          <h5 className="">Start Time:</h5>
        
        <div className="">
        <label className="inline">
        <span className="">Min</span> 

        <input type="number" min="0" name="startTimeM" value={filterTime.startTimeM} onChange={(event) => filterTimeChange(event, 'startTimeM')} className="w-1/4 ml-2 form-text border-2 mr-1 pl-1" />
        </label>

        <label className="inline">
        <span className="">Sec</span> 

        <input type="number" max="60" min="0" name="startTimeS" value={filterTime.startTimeS}  onChange={(event) => filterTimeChange(event, 'startTimeS')} className="w-1/4 ml-2 form-text border-2 pl-1"/>
        </label>
        </div>
        <h5 className="">End Time:</h5>
        
        <div className="">
        <label className="inline">
        <span className="">Min</span> 

        <input type="number" min="0" name="endTimeM" value={filterTime.endTimeM} onChange={(event) => filterTimeChange(event, 'endTimeM')} className="w-1/4 ml-2 form-text border-2 mr-1 pl-1" />
        </label>

        <label className="inline">
        <span className="">Sec</span> 

        <input type="number" max="60" name="endTimeS" value={filterTime.endTimeS} onChange={(event) => filterTimeChange(event, 'endTimeS')} className="w-1/4 ml-2 form-text border-2 pl-1"/>
        </label>

        </div>
    </div>
    </div>
    </div>
   </div>

   <div className="actions">
   <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2" onClick={clearFilters}> Clear Filters </button>
   <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4" onClick={toggleFilter}> Cancel </button>

 </div>
</div>;

  return (
    <>
      <div className="overflow-y-auto h-full p-1 border-2 border-gray-500">
        <h1 className="text-center text-lg font-bold mb-1">{match.title}</h1>
        <table className="table-fixed w-full">
          <thead>
            <tr>
              <th className="w-6/8">Annotation </th>
              <th className="w-2/8">Time</th>
            </tr>
          </thead>
          <tbody>
            <Modal onClose={showModal} show={show} title={'Edit Annotation'}>
              {' '}
              Shot: {modalContent.shotText} <br /> Time:{' '}
              <input
                type="number"
                onChange={(event) => handleTimeChange(event.target.value)}
                value={modalContent.timeText}
              />
            </Modal>
            {filterAnnotations.map((annotation) => {
              return (
                <>
                  <tr className="text-center border-t-2 border-fuchsia-600">
                    <div className="has-tooltip">
                      <span className="tooltip shadow-lg px-3 py-1 bg-blue-600 text-white -mt-8">
                        <button
                          type="button"
                          onClick={(e) => {
                            showModal(annotation.shot.id, annotation.timestamp);
                          }}
                        >
                          <FontAwesomeIcon className="pr-1" icon={faEdit} />
                          Edit{' '}
                        </button>{' '}
                        |
                        <button
                          type="button"
                          className="pl-2"
                          onClick={() => removeAnnotation(annotation)}
                        >
                          <FontAwesomeIcon icon={faTrash} /> Remove
                        </button>
                      </span>
                      <td className="">
                        <span className="grid place-items-center overflow-x-hidden w-full px-2">
                          {annotation.shot.id}
                        </span>
                      </td>
                    </div>
                    <td>
                      <button
                        className="hover:text-blue-500"
                        onClick={() => jumpToAnnotation(annotation.timestamp)}
                      >
                        {convertSecondsToMS(annotation.timestamp)}
                      </button>
                    </td>

                  </tr>
                </>
              );
            })}
          </tbody>


        </table>

      </div>

      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 w-full" onClick={toggleFilter}> Filter  </button>


{showFilter ? <Filter /> : null}

    </>
  );
}
