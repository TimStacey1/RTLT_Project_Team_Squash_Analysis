// React dependencies
import { React, useState, useEffect } from 'react';

// Third party dependencies
import axios from 'axios';

// Custom Components
import AnnotationButton from './AnnotationButton';

export default function AnnotationControls({
  baseUrl,
  match,
  annotationsUpdated,
  getAnnotationTimestamp,
}) {
    const [annotationComponents, setAnnotationComponents] = useState([

        { type: 'score', id: 'Point Won' },
        { type: 'rally', id: 'New Rally' },
    { type: 'game', id: 'New Game' },
    { type: 'shot', id: 'BH Drive', hand: 'Backhand' },
    { type: 'shot', id: 'FH Drive', hand: 'ForeHand' },
    { type: 'shot', id: 'BH X-Court', hand: 'Backhand' },
    { type: 'shot', id: 'FH X-Court', hand: 'ForeHand' },
    { type: 'shot', id: 'BH Boast', hand: 'Backhand' },
    { type: 'shot', id: 'FH Boast', hand: 'ForeHand' },
    { type: 'shot', id: 'BH Drop', hand: 'Backhand' },
    { type: 'shot', id: 'FH Drop', hand: 'ForeHand' },
    {
      type: 'shot',
      id: 'BH Volley Drop',
      hand: 'Backhand',
      approach: 'Volley',
    },
    {
      type: 'shot',
      id: 'FH Volley Drop',
      hand: 'ForeHand',
      approach: 'Volley',
    },
    { type: 'shot', id: 'BH Kill', hand: 'Backhand' },
    { type: 'shot', id: 'FH Kill', hand: 'ForeHand' },
  ]);
  const [selectedAnnotation, setSelectedAnnotation] = useState({});
  const [selectedPlayer, setSelectedPlayer] = useState({});

  const updateSelectedAnnotation = (selectedAnnotationComponent) => {
    if (
        (selectedAnnotationComponent.type === 'shot' || selectedAnnotationComponent.type === 'score') &&
      Object.entries(selectedPlayer).length > 0
    ) {
      setSelectedAnnotation({
        timestamp: getAnnotationTimestamp(),
        playerNumber: selectedPlayer.playerNumber,
        components: selectedAnnotationComponent,
      });
    } else if (selectedAnnotationComponent.type === 'game' || selectedAnnotationComponent.type === 'rally') {
      setSelectedAnnotation({
        timestamp: getAnnotationTimestamp(),
        components: selectedAnnotationComponent,
      });
    }
  };

  const updateSelectedPlayer = (player) => {
    if (Object.entries(selectedPlayer).length > 0) {
      if (selectedPlayer === player) {
        setSelectedPlayer({});
      } else {
        setSelectedPlayer(player);
      }
    } else {
      setSelectedPlayer(player);
    }
  };

  useEffect(() => {
    if (
      Object.entries(match).length > 0 &&
      annotationComponents.filter((component) => component.type === 'player')
        .length === 0
    ) {
      setAnnotationComponents([
        ...annotationComponents,
        {
          type: 'player',
          id: 'Player 1',
          text: `Player 1: ${match.players.player1}`,
          playerNumber: 1,
        },
        {
          type: 'player',
          id: 'Player 2',
          text: `Player 2: ${match.players.player2}`,
          playerNumber: 2,
        },
      ]);
    }

    if (Object.entries(selectedAnnotation).length > 0) {
      axios
        .post(baseUrl + '/annotate/' + match.id + '/new', selectedAnnotation)
        .then(setSelectedAnnotation({}))
        .then(annotationsUpdated());
    }
  }, [
    selectedAnnotation,
    match,
    annotationComponents,
    annotationsUpdated,
    baseUrl,
  ]);

  return (
    <>
      <div className="h-full bg-gray-300 flex">
        <div className="w-12 h-full grid place-content-center">
          <div className="w-96 transform -rotate-90 text-xl grid place-content-center">
            Annotation Controls
          </div>
        </div>
        <ul className="w-full grid grid-cols-2 grid-rows-9 mx-2 py-4 gap-x-3 gap-y-4 h-full place-items-center">
          {annotationComponents
            .filter((component) => component.type === 'game')
            .map((game) => (
              <li
                className="w-full h-full col-span-2 text-white font-semibold"
                onClick={() => updateSelectedAnnotation(game)}
                key={game.id}
              >
                <AnnotationButton
                  key={game.id}
                  name={game.id}
                  type={game.type}
                  selected={selectedAnnotation.id === game.id}
                  disabled={false}
                />
              </li>
            ))}
            {annotationComponents
                .filter((component) => component.type === 'rally')
                .map((rally) => (
                    <li
                        className="w-full h-full col-span-2 text-white font-semibold"
                        onClick={() => updateSelectedAnnotation(rally)}
                        key={rally.id}
                    >
                        <AnnotationButton
                            key={rally.id}
                            name={rally.id}
                            type={rally.type}
                            selected={selectedAnnotation.id === rally.id}
                            disabled={false}
                        />
                    </li>
                ))}
          {annotationComponents
            .filter((component) => component.type === 'player')
            .map((player) => (
              <li
                className="w-full h-full col-span-2 text-white font-semibold"
                onClick={() => updateSelectedPlayer(player)}
                key={player.id}
              >
                <AnnotationButton
                  key={player.id}
                  name={player.text}
                  type={player.type}
                  selected={selectedPlayer.id === player.id}
                  disabled={false}
                />
              </li>
            ))}
          {annotationComponents
            .filter((component) => component.type === 'shot')
            .map((shot) => (
              <li
                className="w-full h-full"
                onClick={() => updateSelectedAnnotation(shot)}
                key={shot.id}
              >
                <AnnotationButton
                  key={shot.id}
                  type={shot.type}
                  name={shot.id}
                  selected={selectedAnnotation.id === shot.id}
                  disabled={!(Object.entries(selectedPlayer).length > 0)}
                />
              </li>
            ))}
            {annotationComponents
                .filter((component) => component.type === 'score')
                      .map((score) => (
                    <li
                        className="w-full h-full col-span-2 text-black font-semibold"
                        onClick={() => updateSelectedAnnotation(score)}
                        key={score.id}
                    >
                    <AnnotationButton
                        key={score.id}
                        type={score.type}
                        name={score.id}
                        selected={selectedAnnotation.id === score.id}
                        disabled={!(Object.entries(selectedPlayer).length > 0)}
                        />
                    </li>
                ))}
        </ul>
      </div>
    </>
  );
}
