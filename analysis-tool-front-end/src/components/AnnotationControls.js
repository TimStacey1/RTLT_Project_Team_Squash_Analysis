import { React, useState, useEffect } from 'react';
import AnnotationButton from './AnnotationButton';

const axios = require('axios').default;
const match_id = window.location.pathname.substring(7);

export default function AnnotationControls(props) {
  const apiUrl = 'http://localhost:3001/annotate/' + match_id + '/new';
  const [hand, setHand] = useState('');
  const [approach, setApproach] = useState('');
  const [shot, setShot] = useState('');
  const HandEnum = Object.freeze({
    forehand: 'Forehand',
    backhand: 'Backhand'
  });
  const ApproachEnum = Object.freeze({ volley: 'Volley', bounce: 'Bounce' });
  const ShotEnum = Object.freeze({
    straightDrive: 'Straight Drive',
    crossCourt: 'Cross-Court',
    lob: 'Lob',
    drop: 'Drop',
    nick: 'Nick',
    kill: 'Kill',
    boast: 'Boast'
  });
  const [shotButtons, setShotButtons] = useState([]);
  const numAdditionalButtons = 9;
  const additionalButton = [
    <li className="w-full h-full">
      <AnnotationButton
        name={'Additional Button'}
        disabled={true}
        selected={false}
      />
    </li>
  ];
  const additionalButtons = Array(numAdditionalButtons).fill(additionalButton);

  const updateShotButtons = () => {
    let buttons = [];
    Object.values(ShotEnum).forEach((value) => {
      buttons.push(
        <li className="w-full h-full" onClick={() => updateShot(value)}>
          <AnnotationButton
            key={value}
            name={value}
            disabled={approach === ''}
            selected={shot === value}
          />
        </li>
      );
    });
    setShotButtons(buttons);
  };

  const updateHand = (selectedHand) => {
    if (hand !== selectedHand) setHand(selectedHand);
    else {
      setHand('');
      setApproach('');
      setShot('');
    }
  };

  const updateApproach = (selectedApproach) => {
    if (hand && approach !== selectedApproach) setApproach(selectedApproach);
    else {
      setApproach('');
      setShot('');
    }
  };

  const updateShot = (selectedShot) => {
    if (hand && approach && shot !== selectedShot) {
      setShot(selectedShot);
    } else setShot('');
  };

  const resetControls = () => {
    setHand('');
    setApproach('');
    setShot('');
  };

  useEffect(() => {
    updateShotButtons();

    if (hand !== '' && approach !== '' && shot !== '') {
      const annotation = {
        timestamp: 1000,
        playerNumber: 1,
        movement: 'shot',
        components: {
          hand: hand,
          approach: approach,
          shot: shot
        }
      };
      axios
        .post(apiUrl, annotation)
        .then((res) => console.log(res.data))
        .then(resetControls());
      props.handler(annotation);
    }
  }, [hand, approach, shot]);

  return (
    <>
      <div className="h-full bg-gray-300 flex">
        <div className="w-12 h-full grid place-content-center">
          <div className="w-96 transform -rotate-90 text-xl grid place-content-center">
            Annotation Controls
          </div>
        </div>
        <ul className="w-full grid grid-cols-2 grid-rows-9 mx-2 py-4 gap-x-3 gap-y-4 h-full place-items-center">
          <li
            className="w-full h-full"
            onClick={() => updateHand(HandEnum.forehand)}
          >
            <AnnotationButton
              name={HandEnum.forehand}
              disabled={false}
              selected={hand === HandEnum.forehand}
            />
          </li>
          <li
            className="w-full h-full"
            onClick={() => updateHand(HandEnum.backhand)}
          >
            <AnnotationButton
              name={HandEnum.backhand}
              disabled={false}
              selected={hand === HandEnum.backhand}
            />
          </li>
          <li
            className="w-full h-full"
            onClick={() => updateApproach(ApproachEnum.volley)}
          >
            <AnnotationButton
              name={ApproachEnum.volley}
              disabled={hand === ''}
              selected={approach === ApproachEnum.volley}
            />
          </li>
          <li
            className="w-full h-full"
            onClick={() => updateApproach(ApproachEnum.bounce)}
          >
            <AnnotationButton
              name={ApproachEnum.bounce}
              disabled={hand === ''}
              selected={approach === ApproachEnum.bounce}
            />
          </li>
          {shotButtons}
          {additionalButtons}
        </ul>
      </div>
    </>
  );
}
