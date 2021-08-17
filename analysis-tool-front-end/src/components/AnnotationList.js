import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

export default function AnnotationList(props) {
  const { baseUrl, match, updateAnnotations, jumpToAnnotation } = props;
  const [annotations, setAnnotations] = useState([]);
  const [annotationToRemove, setAnnotationToRemove] = useState({});
  const [show, setShow] = useState(false);
  const [modalContent, setModalContent] = useState({});

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
        });
    }
  }, [annotationToRemove, props]);

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
            {annotations.map((annotation) => {
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
    </>
  );
}
