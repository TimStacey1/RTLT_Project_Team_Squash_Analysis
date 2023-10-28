import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { Player } from 'video-react';

export default function AnnotationList({
    baseUrl,
    match,
    annotations,
    annotationsUpdated,
    jumpToAnnotation,
    clearFilter,
    pauseVideo,
}) {
    const [filterAnnotations, setFilterAnnotations] = useState([]);
    const [annotationToRemove, setAnnotationToRemove] = useState({});
    const [annotationToEdit, setAnnotationToEdit] = useState({});
    const [show, setShow] = useState(false);
    const [showFilter, setFilterShow] = useState(false);
    const [filterTime, setFilterTime] = useState({
        startTimeM: 0,
        startTimeS: 0,
        endTimeM: 0,
        endTimeS: 0,
    });
    const [checkedState, setCheckedState] = useState(new Array(12).fill(false));
    const [modalContent, setModalContent] = useState({});
    const gameZoneLabels = ['Front Left', 'Front Right', 'Back Left', 'Back Right', 'T-Zone'];


    var unique_shots = [
        ...new Set(
            annotations
                .filter((annotation) => annotation.components.type === 'shot')
                .map((annotation) => annotation.components.id)
        ),
    ];

    useEffect(() => {
        setFilterAnnotations(annotations);

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
                    setAnnotationToRemove({});
                    annotationsUpdated();
                });
        }
        if (Object.entries(annotationToEdit).length !== 0) {
            const timeinSecs =
                Number(annotationToEdit.timeTextH) * 3600 +
                Number(annotationToEdit.timeTextM) * 60 +
                Number(annotationToEdit.timeTextS);
            annotationToEdit.annotation.timestamp = timeinSecs;
            annotationToEdit.annotation.playerPos = annotationToEdit.playerPosition;
            annotationToEdit.annotation.opponentPos = annotationToEdit.opponentPosition;

            axios
                .post(
                    baseUrl +
                    '/annotate/' +
                    match.id +
                    '/' +
                    annotationToEdit.annotation.id +
                    '/edit',
                    annotationToEdit.annotation
                )
                .then((res) => {
                    setAnnotationToEdit({});
                    annotationsUpdated();
                });
        }
    }, [
        annotationToRemove,
        annotationToEdit,
        annotations,
        annotationsUpdated,
        baseUrl,
        match,
    ]);

    const clearFilters = () => {
        const updatedCheckedState = new Array(12).fill(false);
        setCheckedState(updatedCheckedState);
        clearFilter();
        setFilterAnnotations(annotations);
        setFilterTime({
            startTimeM: 0,
            startTimeS: 0,
            endTimeM: 0,
            endTimeS: 0,
        });
    };


    // I have no idea how this works other than the fact that it does
    const [player1IsChecked, player1SetIsChecked] = useState(false);
    const [player2IsChecked, player2SetIsChecked] = useState(false);

    const playerFilterChange1 = () => {
        
        if (!player1IsChecked && player2IsChecked) {
            let newAnnotations = annotations.filter((annotation) => (annotation.playerNumber === 1 || annotation.playerNumber === 2));
            setFilterAnnotations(newAnnotations);
        } else if (!player1IsChecked) {
            let newAnnotations = annotations.filter((annotation) => annotation.playerNumber === 1);
            setFilterAnnotations(newAnnotations);
        } else if (player2IsChecked) {
            let newAnnotations = annotations.filter((annotation) => annotation.playerNumber === 2);
            setFilterAnnotations(newAnnotations);
        } else {
            clearFilters();
        }
        player1SetIsChecked(!player1IsChecked)
    }

    const playerFilterChange2 = () => {
        player2SetIsChecked(!player2IsChecked)
        if (player1IsChecked && !player2IsChecked) {
            let newAnnotations = annotations.filter((annotation) => (annotation.playerNumber === 1 || annotation.playerNumber === 2));
            setFilterAnnotations(newAnnotations);
        } else if (player1IsChecked) {
            let newAnnotations = annotations.filter((annotation) => annotation.playerNumber === 1);
            setFilterAnnotations(newAnnotations);
        } else if (!player2IsChecked) {
            let newAnnotations = annotations.filter((annotation) => annotation.playerNumber === 2);
            setFilterAnnotations(newAnnotations);
        } else {
            clearFilters();
        }

    }

    const shotFilterChange = (position) => {
        const updatedCheckedState = checkedState.map((item, index) =>
            index === position ? !item : item
        );

        const indices = updatedCheckedState.reduce(
            (out, bool, index) => (bool ? out.concat(index) : out),
            []
        );
        var unique = [];
        for (var i = 0; i < indices.length; i++) {
            unique.push(unique_shots[indices[i]]);
        }

        let newAnnotations = annotations.filter((item) =>
            unique.includes(item.components.id)
        );

        setFilterAnnotations(newAnnotations);

        setCheckedState(updatedCheckedState);

        let checker = (checkedState) => checkedState.every((v) => v === false);
        if (checker(updatedCheckedState)) {
            setFilterAnnotations(annotations);
        }
    };

    const filterTimeChange = (evt, field) => {
        let newAnnotations = filterTime;
        newAnnotations[field] = evt.target.value;
        const startS =
            Number(newAnnotations.startTimeM) * 60 +
            Number(newAnnotations.startTimeS);
        const endS =
            Number(newAnnotations.endTimeM) * 60 + Number(newAnnotations.endTimeS);
        newAnnotations = annotations.filter(
            (item) => item.timestamp >= startS && item.timestamp <= endS
        );
        setFilterAnnotations(newAnnotations);
    };

    const toggleFilter = () => {
        setFilterShow(!showFilter);
        pauseVideo();
    };

    const showModal = (shotText, timeText, annotation, playerPosition, opponentPosition) => {
        if (shotText && timeText) {
            const hours = Math.floor(timeText / 3600);
            const minutes = Math.floor((timeText % 3600) / 60);
            const seconds = Math.floor((timeText % 3600) % 60);

            setModalContent({
                annotation: annotation,
                shotText: shotText,
                timeTextH: hours,
                timeTextM: minutes,
                timeTextS: seconds,
                playerPosition: playerPosition,
                opponentPosition: opponentPosition,

            });
        } else {
            const hours = 0;
            const minutes = 0;
            const seconds = 0;

            setModalContent({
                annotation: annotation,
                shotText: shotText,
                timeTextH: hours,
                timeTextM: minutes,
                timeTextS: seconds,
                playerPosition: playerPosition,
                opponentPosition: opponentPosition,
            });
        }
        setShow(!show);
    };

    const handleTimeChange = (event, timeTextX) => {
        let newTime = modalContent;
        newTime[timeTextX] = event.target.value;

        setModalContent({
            annotation: newTime['annotation'],
            shotText: newTime.shotText,
            timeTextH: newTime.timeTextH,
            timeTextM: newTime.timeTextM,
            timeTextS: newTime.timeTextS,
            playerPosition: newTime.playerPosition,
            opponentPosition: newTime.opponentPosition,
        });
    };

    const handleNewChange = (event, newText) => {
        let newChange = modalContent;
        newChange[newText] = event.target.value;

        setModalContent({
            annotation: newChange['annotation'],
            shotText: newChange.shotText,
            timeTextH: newChange.timeTextH,
            timeTextM: newChange.timeTextM,
            timeTextS: newChange.timeTextS,
            playerPosition: newChange.playerPosition,
            opponentPosition: newChange.opponentPosition,
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

    const Filter = () => (
        <div className="modal" id="modal">
            <h2 className="text-center">Filter Annotations</h2>
            <div className="content">
                <div className="container">
                    <div className="grid grid-cols-12">
                        <div className="col-start-1 col-end-13 border-2 p-2">
                            <h3 className="font-bold text-lg mb-1 text-left">
                                Filter by Player
                            </h3>
                            <div className="grid grid-cols-10">
                                <label className="col-start-1 col-end-5 p-2">
                                    <input
                                        type="checkbox"
                                        className="form-checkbox"
                                        checked={player1IsChecked}
                                        name={match.players['player1']}
                                        onChange={playerFilterChange1}
                                    />
                                    <span className="ml-2">{match.players['player1']}</span>
                                </label>

                                <label className="col-start-6 col-end-10 p-2">
                                    <input
                                        type="checkbox"
                                        className="form-checkbox"
                                        name={match.players['player2']}
                                        checked={player2IsChecked}
                                        onChange={playerFilterChange2}
                                    />
                                    <span className="ml-2">{match.players['player2']}</span>
                                </label>
                            </div>

                        </div>
                        <br></br>
                        <div className="col-start-1 col-end-6  border-2 p-2">
                            <h3 className="font-bold text-lg mb-1 text-center">
                                Filter by shot
                            </h3>
                            {unique_shots.map((shot, index) => {
                                return (
                                    <>
                                        <div key={shot.id}>
                                            <label className="block">
                                                <input
                                                    type="checkbox"
                                                    className="form-checkbox"
                                                    checked={checkedState[index]}
                                                    onChange={() => shotFilterChange(index, shot)}
                                                />
                                                <span className="ml-2">{shot}</span>
                                            </label>
                                        </div>
                                    </>
                                );
                            })}
                        </div>

                        <div className="col-start-7 col-end-13 border-2 p-2">
                            <h3 className="font-bold text-lg mb-1 text-center">
                                Filter by time
                            </h3>
                            <h5 className="">Start Time:</h5>

                            <div className="">
                                <label className="inline">
                                    <span className="">Min</span>

                                    <input
                                        type="number"
                                        min="0"
                                        name="startTimeM"
                                        value={filterTime.startTimeM}
                                        onChange={(event) => filterTimeChange(event, 'startTimeM')}
                                        className="w-1/4 ml-2 form-text border-2 mr-1 pl-1"
                                    />
                                </label>

                                <label className="inline">
                                    <span className="">Sec</span>

                                    <input
                                        type="number"
                                        max="60"
                                        min="0"
                                        name="startTimeS"
                                        value={filterTime.startTimeS}
                                        onChange={(event) => filterTimeChange(event, 'startTimeS')}
                                        className="w-1/4 ml-2 form-text border-2 pl-1"
                                    />
                                </label>
                            </div>
                            <h5 className="">End Time:</h5>

                            <div className="">
                                <label className="inline">
                                    <span className="">Min</span>

                                    <input
                                        type="number"
                                        min="0"
                                        name="endTimeM"
                                        value={filterTime.endTimeM}
                                        onChange={(event) => filterTimeChange(event, 'endTimeM')}
                                        className="w-1/4 ml-2 form-text border-2 mr-1 pl-1"
                                    />
                                </label>

                                <label className="inline">
                                    <span className="">Sec</span>

                                    <input
                                        type="number"
                                        max="60"
                                        name="endTimeS"
                                        value={filterTime.endTimeS}
                                        onChange={(event) => filterTimeChange(event, 'endTimeS')}
                                        className="w-1/4 ml-2 form-text border-2 pl-1"
                                    />
                                </label>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <div className="actions">
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2"
                    onClick={clearFilters}
                >
                    {' '}
                    Clear Filters{' '}
                </button>
                <button
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4"
                    onClick={toggleFilter}
                >
                    {' '}
                    Close{' '}
                </button>
            </div>
        </div>
    );

    return ( //This is the left hand side of the screen. The annotation log and resulting menus
        <>
            <div className="h-full flex flex-col">
                <div className="flex-grow w-full p-1 border-2 border-gray-500 overflow-auto">
                    <h1 className="text-center text-lg font-bold mb-1">{match.title}</h1>
                    <table className="table-fixed w-full">
                        <thead>
                            <tr>
                                <th className="w-6/8 border border-white bg-yellow-600 rounded">Player 1 </th>
                                <th className="w-2/8 border border-white bg-green-600 rounded">Player 2</th>
                            </tr>
                        </thead>
                    </table>
                    <table className="table-fixed w-full">
                        <thead>
                            <tr>
                                <th className="w-6/8">Annotation </th>
                                <th className="w-2/8">Time</th>
                                <th className="w-2/8">Player Position</th>
                                <th className="w-2/8">Opponent Position</th>
                            </tr>
                        </thead>
                        <tbody>
                            <Modal onClose={showModal} show={show} title={'Edit Annotation'}>
                                <div className="content">
                                    <div className="border-2 p-2">
                                        <h3 className="text-lg mb-1 inline">
                                            {' '}
                                            <span className="font-bold"> Annotation: </span>{' '}
                                            {modalContent.shotText}{' '}
                                        </h3>{' '}
                                        <br />
                                        <h3 className="font-bold text-lg mb-1 inline"> Time: </h3>
                                        <label className="inline">
                                            <span className="ml-2">H:</span>

                                            <input
                                                type="number"
                                                min="0"
                                                value={modalContent.timeTextH}
                                                onChange={(event) =>
                                                    handleTimeChange(event, 'timeTextH')
                                                }
                                                className="w-1/5 ml-1 form-text border-2 pl-1"
                                            />
                                        </label>
                                        <label className="inline ml-2">
                                            <span className="">M:</span>

                                            <input
                                                type="number"
                                                min="0"
                                                value={modalContent.timeTextM}
                                                onChange={(event) =>
                                                    handleTimeChange(event, 'timeTextM')
                                                }
                                                className="w-1/5 ml-1 form-text border-2 pl-1"
                                            />
                                        </label>
                                        <label className="inline ml-2">
                                            <span className="">S:</span>

                                            <input
                                                type="number"
                                                max="60"
                                                min="0"
                                                value={modalContent.timeTextS}
                                                onChange={(event) =>
                                                    handleTimeChange(event, 'timeTextS')
                                                }
                                                className="w-1/5 ml-1 form-text border-2 pl-1"
                                            />
                                        </label>
                                        <br></br>
                                        <h3 className="font-bold text-lg mb-1 inline"> Player Location: </h3>
                                        <label className="inline ml-2">
                                            <input
                                                type="number"
                                                max="5"
                                                min="1"
                                                value={modalContent.playerPosition}
                                                onChange={(event) =>
                                                    handleNewChange(event, 'playerPosition')
                                                }
                                                className="w-1/5 ml-1 form-text border-2 pl-1"
                                            />   
                                        </label>
                                        <br></br>
                                        <h3 className="font-bold text-lg mb-1 inline"> Opponent Location: </h3>
                                        <label className="inline ml-2">
                                            <input
                                                type="number"
                                                max="5"
                                                min="1"
                                                value={modalContent.opponentPosition}
                                                onChange={(event) =>
                                                    handleNewChange(event, 'opponentPosition')
                                                }
                                                className="w-1/5 ml-1 form-text border-2 pl-1"
                                            />
                                        </label>
                                        <br></br>
                                        <h3 className="font-bold text-lg mb-1 inline">Locations: </h3>
                                        <ol class="list-group list-group-numbered">
                                            <li class="list-group-item">1. Front Left</li>
                                            <li class="list-group-item">2. Front Right</li>
                                            <li class="list-group-item">3. Back Left</li>
                                            <li class="list-group-item">4. Back Right</li>
                                            <li class="list-group-item">5. T-Zone</li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="actions">
                                    <button
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2"
                                        onClick={(e) => {
                                            setAnnotationToEdit(modalContent);
                                        }}
                                    >
                                        Save
                                    </button>
                                    <button
                                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4"
                                        onClick={showModal}
                                    >
                                        Close
                                    </button>
                                </div>
                            </Modal>
                            {filterAnnotations.map((annotation) => {
                                return (
                                    <tr
                                        className="hasTooltip text-center border-t-2 border-fuchsia-600"
                                        key={annotation.id}
                                    >
                                        <td className="w-1/2">
                                            <div className="tooltip-container has-tooltip">
                                                <div className="overflow-hidden text-center">
                                                    {annotation.components.id === 'New Game' && (
                                                        <span className="grid place-items-center text-red-600 font-bold overflow-x-hidden w-full px-2">
                                                            {annotation.components.id}
                                                        </span>
                                                    )}
                                                    {(annotation.components.type === 'shot' || annotation.components.type === 'score') && annotation.playerNumber === 1 && (
                                                        <span className="grid place-items-center bg-yellow-600 overflow-x-hidden w-full px-2">
                                                            {annotation.components.id}
                                                        </span>
                                                    )}
                                                    {(annotation.components.type === 'shot' || annotation.components.type === 'score') && annotation.playerNumber === 2 && (
                                                        <span className="grid place-items-center bg-green-600 overflow-x-hidden w-full px-2">
                                                            {annotation.components.id}
                                                        </span>
                                                    )}
                                                    {(annotation.components.type === 'rally') && (
                                                        <span className="grid place-items-center overflow-x-hidden w-full px-2">
                                                            {annotation.components.id}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="tooltip shadow-lg px-3 py-1 bg-blue-600 text-white">
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            showModal(
                                                                annotation.components.id,
                                                                annotation.timestamp,
                                                                annotation, 
                                                                annotation.playerPos,
                                                                annotation.opponentPos,
                                                            );
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
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <button
                                                className="hover:text-blue-500"
                                                onClick={() =>
                                                    jumpToAnnotation(
                                                        annotation.timestamp,
                                                        filterAnnotations
                                                    )
                                                }
                                            >
                                                {convertSecondsToMS(annotation.timestamp)}
                                            </button>
                                        </td>
                                        <td>
                                            {gameZoneLabels[annotation.playerPos-1]}
                                        </td>
                                        <td>
                                            {gameZoneLabels[annotation.opponentPos - 1]}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="w-full mt-auto">
                    <div className="mt-1">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold border-r-4 border-white py-2 px-4 w-1/2"
                            onClick={toggleFilter}
                        >
                            {' '}
                            Filter{' '}
                        </button>
                        <a href={'/stats/' + match.id}>
                            <button className="bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-4 w-1/2">
                                Statistics
                            </button>
                        </a>
                    </div>
                </div>
                {showFilter ? <Filter /> : null}
            </div>
        </>
    );
}