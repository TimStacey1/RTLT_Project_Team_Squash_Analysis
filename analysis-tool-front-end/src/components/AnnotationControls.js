import { React, useState } from 'react';

export default function AnnotationControls() {
  const [forehandSelected, setForehandSelected] = useState(false);
  const [backhandSelected, setBackhandSelected] = useState(false);
  const [volleySelected, setVolleySelected] = useState(false);
  const [bounceSelected, setBounceSelected] = useState(false);
  const [straightDriveSelected, setStraightDriveSelected] = useState(false);
  const [crosscourtSelected, setCrosscourtSelected] = useState(false);
  const [lobSelected, setLobSelected] = useState(false);
  const [dropSelected, setDropSelected] = useState(false);
  const [nickSelected, setNickSelected] = useState(false);
  const [killSelected, setKillSelected] = useState(false);

  const setForehand = () => {
    setForehandSelected(!forehandSelected);
    setBackhandSelected(false);

    if (!(forehandSelected || backhandSelected)) {
      setVolleySelected(false);
      setBounceSelected(false);
    }
  }

  const setBackhand = () => {
    setBackhandSelected(!backhandSelected);
    setForehandSelected(false);

    if (!(forehandSelected || backhandSelected)) {
      setVolleySelected(false);
      setBounceSelected(false);
    }
  }

  const setVolley = () => {
    setVolleySelected(!volleySelected);
    setBounceSelected(false);

    if (!(volleySelected || bounceSelected)) {
      setStraightDriveSelected(false);
      setCrosscourtSelected(false);
      setLobSelected(false);
      setDropSelected(false);
      setNickSelected(false);
      setKillSelected(false);
    }
  }

  const setBounce = () => {
    setBounceSelected(!bounceSelected);
    setVolleySelected(false);

    if (!(volleySelected || bounceSelected)) {
      setStraightDriveSelected(false);
      setCrosscourtSelected(false);
      setLobSelected(false);
      setDropSelected(false);
      setNickSelected(false);
      setKillSelected(false);
    }
  }

  const setStraightDrive = () => {
    setStraightDriveSelected(!straightDriveSelected);
    if (straightDriveSelected !== false) {
      setCrosscourtSelected(false);
      setLobSelected(false);
      setDropSelected(false);
      setNickSelected(false);
      setKillSelected(false);
    }
  }

  const setCrosscourt = () => {
    setCrosscourtSelected(!crosscourtSelected);
    setStraightDriveSelected(false);
    setLobSelected(false);
    setDropSelected(false);
    setNickSelected(false);
    setKillSelected(false);
  }

  const setLob = () => {
    setLobSelected(!lobSelected);
    setStraightDriveSelected(false);
    setCrosscourtSelected(false);
    setDropSelected(false);
    setNickSelected(false);
    setKillSelected(false);
  }

  const setDrop = () => {
    setDropSelected(!dropSelected);
    setStraightDriveSelected(false);
    setCrosscourtSelected(false);
    setLobSelected(false);
    setNickSelected(false);
    setKillSelected(false);
  }

  const setNick = () => {
    setNickSelected(!nickSelected);
    setStraightDriveSelected(false);
    setCrosscourtSelected(false);
    setLobSelected(false);
    setDropSelected(false);
    setKillSelected(false);
  }

  const setKill = () => {
    setKillSelected(!killSelected);
    setStraightDriveSelected(false);
    setCrosscourtSelected(false);
    setLobSelected(false);
    setDropSelected(false);
    setNickSelected(false);
  }

  return (
    <div className="h-full">
      <ul className="grid grid-cols-2 grid-rows-9 mx-4 py-4 gap-x-4 gap-y-6 h-full place-items-center">
        <li className="grid place-items-center w-full h-full rounded-xl cursor-pointer" onClick={setForehand}>
          <ForehandButton forehandSelected={forehandSelected} />
        </li>
        <li className="grid place-items-center w-full h-full rounded-xl cursor-pointer" onClick={setBackhand}>
          <BackhandButton backhandSelected={backhandSelected} />
        </li>
        <li className="grid place-items-center w-full h-full rounded-xl cursor-pointer" onClick={setVolley}>
          <VolleyButton handSelected={forehandSelected || backhandSelected} volleySelected={volleySelected} />
        </li>
        <li className="grid place-items-center w-full h-full rounded-xl cursor-pointer" onClick={setBounce}>
          <BounceButton handSelected={forehandSelected || backhandSelected} bounceSelected={bounceSelected} />
        </li>
        <li className="grid place-items-center w-full h-full rounded-xl cursor-pointer" onClick={setStraightDrive}>
          <StraightDriveButton disabled={!((forehandSelected || backhandSelected) && (volleySelected || bounceSelected))} straightDriveSelected={straightDriveSelected} />
        </li>
        <li className="grid place-items-center w-full h-full rounded-xl cursor-pointer" onClick={setCrosscourt}>
          <CrosscourtButton disabled={!((forehandSelected || backhandSelected) && (volleySelected || bounceSelected))} crosscourtSelected={crosscourtSelected} />
        </li>
        <li className="grid place-items-center w-full h-full rounded-xl cursor-pointer" onClick={setLob}>
          <LobButton disabled={!((forehandSelected || backhandSelected) && (volleySelected || bounceSelected))} lobSelected={lobSelected} />
        </li>
        <li className="grid place-items-center w-full h-full rounded-xl cursor-pointer" onClick={setDrop}>
          <DropButton disabled={!((forehandSelected || backhandSelected) && (volleySelected || bounceSelected))} dropSelected={dropSelected} />
        </li>
        <li className="grid place-items-center w-full h-full rounded-xl cursor-pointer" onClick={setNick}>
          <NickButton disabled={!((forehandSelected || backhandSelected) && (volleySelected || bounceSelected))} nickSelected={nickSelected} />
        </li>
        <li className="grid place-items-center w-full h-full rounded-xl cursor-pointer" onClick={setKill}>
          <KillButton disabled={!((forehandSelected || backhandSelected) && (volleySelected || bounceSelected))} killSelected={killSelected} />
        </li>
        <li className="grid place-items-center w-full h-full rounded-xl bg-yellow-500 col-span-2 hover:bg-yellow-300">Additional button</li>
        <li className="grid place-items-center w-full h-full rounded-xl bg-yellow-500 col-span-2 hover:bg-yellow-300">Additional button</li>
        <li className="grid place-items-center w-full h-full rounded-xl bg-yellow-500 col-span-2 hover:bg-yellow-300">Additional button</li>
        <li className="grid place-items-center w-full h-full rounded-xl bg-yellow-500 hover:bg-yellow-300">Additional button</li>
        <li className="grid place-items-center w-full h-full rounded-xl bg-yellow-500 hover:bg-yellow-300">Additional button</li>
      </ul>
    </div>
  );
}

export function ForehandButton(props) {
  if (props.forehandSelected) {
    return (
      <div className="grid place-items-center w-full h-full rounded-xl bg-yellow-300">
        Forehand
      </div>
    );
  } else {
    return (
      <div className="grid place-items-center w-full h-full rounded-xl bg-yellow-500 hover:bg-yellow-300">
        Forehand
      </div>
    );
  }
}

export function BackhandButton(props) {
  if (props.backhandSelected) {
    return (
      <div className="grid place-items-center w-full h-full rounded-xl bg-yellow-300">
        Backhand
      </div>
    );
  } else {
    return (
      <div className="grid place-items-center w-full h-full rounded-xl bg-yellow-500 hover:bg-yellow-300">
        Backhand
      </div>
    );
  }
}

export function VolleyButton(props) {
  if (props.handSelected) {
      if (props.volleySelected) {
        return (
          <div className="grid place-items-center w-full h-full rounded-xl bg-yellow-300">
            Volley
          </div>
        );
      } else {
        return (
          <div className="grid place-items-center w-full h-full rounded-xl bg-yellow-500 hover:bg-yellow-300">
            Volley
          </div>
        );
      }
  } else {
    return (
      <div className="grid place-items-center w-full h-full rounded-xl bg-gray-500">
        Volley
      </div>
    );
  }
}

export function BounceButton(props) {
  if (props.handSelected) {
    if (props.bounceSelected) {
      return (
        <div className="grid place-items-center w-full h-full rounded-xl bg-yellow-300">
          Bounce
        </div>
      );
    } else {
      return (
        <div className="grid place-items-center w-full h-full rounded-xl bg-yellow-500 hover:bg-yellow-300">
          Bounce
        </div>
      );
    }
  } else {
    return (
      <div className="grid place-items-center w-full h-full rounded-xl bg-gray-500">
        Bounce
      </div>
    );
  }
}

export function StraightDriveButton(props) {
  if (props.disabled) {
    return (
      <div className="grid place-items-center w-full h-full rounded-xl bg-gray-500">
        Straight Drive
      </div>
    );
  } else {
    if (props.straightDriveSelected) {
      return (
        <div className="grid place-items-center w-full h-full rounded-xl bg-yellow-300">
          Straight Drive
        </div>
      );
    } else {
      return (
        <div className="grid place-items-center w-full h-full rounded-xl bg-yellow-500 hover:bg-yellow-300">
          Straight Drive
        </div>
      );
    }
  }
}

export function CrosscourtButton(props) {
  if (props.disabled) {
    return (
      <div className="grid place-items-center w-full h-full rounded-xl bg-gray-500">
        Crosscourt
      </div>
    );
  } else {
    if (props.crosscourtSelected) {
        return (
          <div className="grid place-items-center w-full h-full rounded-xl bg-yellow-300">
            Crosscourt
          </div>
        );
      } else {
        return (
          <div className="grid place-items-center w-full h-full rounded-xl bg-yellow-500 hover:bg-yellow-300">
            Crosscourt
          </div>
        );
      }
  }
}

export function LobButton(props) {
  if (props.disabled) {
    return (
      <div className="grid place-items-center w-full h-full rounded-xl bg-gray-500">
        Lob
      </div>
    );
  } else {
    if (props.lobSelected) {
        return (
          <div className="grid place-items-center w-full h-full rounded-xl bg-yellow-300">
            Lob
          </div>
        );
      } else {
        return (
          <div className="grid place-items-center w-full h-full rounded-xl bg-yellow-500 hover:bg-yellow-300">
            Lob
          </div>
        );
      }
  }
}

export function DropButton(props) {
  if (props.disabled) {
    return (
      <div className="grid place-items-center w-full h-full rounded-xl bg-gray-500">
        Drop
      </div>
    );
  } else {
    if (props.dropSelected) {
        return (
          <div className="grid place-items-center w-full h-full rounded-xl bg-yellow-300">
            Drop
          </div>
        );
      } else {
        return (
          <div className="grid place-items-center w-full h-full rounded-xl bg-yellow-500 hover:bg-yellow-300">
            Drop
          </div>
        );
      }
  }
}

export function NickButton(props) {
  if (props.disabled) {
    return (
      <div className="grid place-items-center w-full h-full rounded-xl bg-gray-500">
        Nick
      </div>
    );
  } else {
    if (props.nickSelected) {
      return (
        <div className="grid place-items-center w-full h-full rounded-xl bg-yellow-300">
          Nick
        </div>
      );
    } else {
      return (
        <div className="grid place-items-center w-full h-full rounded-xl bg-yellow-500 hover:bg-yellow-300">
          Nick
        </div>
      );
    }
  }
}

export function KillButton(props) {
  if (props.disabled) {
    return (
      <div className="grid place-items-center w-full h-full rounded-xl bg-gray-500">
        Kill
      </div>
    );
  } else {
    if (props.killSelected) {
      return (
        <div className="grid place-items-center w-full h-full rounded-xl bg-yellow-300">
          Kill
        </div>
      );
    } else {
      return (
        <div className="grid place-items-center w-full h-full rounded-xl bg-yellow-500 hover:bg-yellow-300">
          Kill
        </div>
      );
    }
  }
}