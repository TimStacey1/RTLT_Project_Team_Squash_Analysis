import { React, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import test1 from '../assets/test1.mp4';

const axios = require('axios').default;

export default function MainMenu() {
  const apiUrl = 'http://localhost:3001/match/all';
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    axios
      .get(apiUrl)
      .then((res) => res.data)
      .then((matches) => setMatches(matches.reverse()));
  }, []);

  return (
    <div className="container mx-auto mb-10">
      <div className="grid grid-cols-12">
        <div className="px-5 py-3 col-span-12">
          <h2 className="text-2xl sm:text-3xl font-bold leading-7 text-gray-900">
            <span className="align-middle">Matches</span>
            <Link to="new/match/">
              <button
                className="
                float-right text-xl hidden sm:block bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-4 mx-1
              "
              >
                New Match
              </button>
            </Link>
            <button
              className="
                float-right text-xl block sm:hidden bg-green-700 hover:bg-green-600 text-white font-bold pb-2 px-4 mx-1
              "
            >
              <span className="align-middle">+</span>
            </button>
          </h2>
        </div>

        {matches.map((match) => {
          return (
            <div className="p-5 col-span-12 sm:col-span-6 lg:col-span-4">
              <div className="overflow-hidden shadow-lg">
                <div className="p-4">
                  <div className="font-bold text-xl mb-3">{match.title}</div>
                  <video src={test1} autoPlay muted preload={'auto'}></video>
                  <p className="text-gray-700 mt-2 text-base">
                    <strong>
                      {match.players.player1} vs {match.players.player2}
                    </strong>
                  </p>
                  <p>{match.description}</p>
                  <div className="pt-3 pb-2">
                    <a href={''}>
                      <button className="bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-4 mx-1">
                        View
                      </button>
                    </a>
                    <a href={'/match/' + match.id}>
                      <button className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 mx-1">
                        Edit
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
