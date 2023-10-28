import { React, useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';

const axios = require('axios').default;

export default function MainMenu(props) {
  const history = useHistory();
  const { baseUrl } = props;
  const [matches, setMatches] = useState([]);

  const removeMatch = (matchId) => {
    const confirmed = window.confirm(
      'Are you sure you want to remove this match?'
    );

    if (confirmed) {
      axios
        .post(`${baseUrl}/match/${matchId}/remove`)
        .then((res) => alert(res.data))
        .then(setMatches([]));
    }
  };

  useEffect(() => {
    if (matches.length === 0 || history.location.state?.from === '/new/match/') {
      axios
        .get(baseUrl + '/match/all')
        .then((res) => res.data)
        .then((matches) => setMatches(matches.reverse()));
    }
  }, [baseUrl, matches.length, history.location.state]);

  return (
    <div className="container mx-auto mb-10">
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

          <Link to="/all/stats">
                <button
                    className="float-right text-xl hidden sm:block bg-green-700
                        hover:bg-green-600 text-white font-bold py-2 px-4 mx-1">
                    All Statistics
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

      <div className="grid grid-cols-12">
        {matches.map((match) => {
          return (
            <div
              key={match.id}
              className="p-5 col-span-12 sm:col-span-6 lg:col-span-4"
            >
              <div className="overflow-hidden shadow-xl border-2 border-gray-100">
                <div className="p-4">
                  <div className="font-bold text-xl mb-3">{match.title}</div>
                  <video
                    src={baseUrl + '/video/' + match.id + '/stream'}
                    muted
                    preload={'auto'}
                  ></video>
                  <p className="text-gray-700 mt-2 text-base">
                    <strong>
                      {match.players.player1} vs {match.players.player2}
                    </strong>
                  </p>
                  <p className="whitespace-normal">{match.description}</p>
                  <div className="pt-3 pb-2">
                    <a href={'/view_video/' + match.id}>
                      <button className="bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-4 mx-1">
                        View
                      </button>
                    </a>
                    <a href={'/match/' + match.id}>
                      <button className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 mx-1">
                        Edit
                      </button>
                    </a>
                    <button
                      onClick={() => removeMatch(match.id)}
                      className="bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-4 mx-1"
                    >
                      Remove
                    </button>
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
