import React from 'react';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';

//const axios = require('axios').default;

class NewMatch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      player1FName: '',
      player1LName: '',

      player2FName: '',
      player2LName: '',

      title: '',
      hours: '',
      minutes: '',
      seconds: '',
      description: '',
      selectedFile: '',

      player1FNameError: '',
      player1LNameError: '',

      player2FNameError: '',
      player2LNameError: '',

      titleError: '',
      durationError: '',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = (event, field) => {
    this.setState({ [field]: event.target.value });
    if (field === 'hours' || field === 'minutes' || field === 'seconds') {
      this.setState({
        durationError: '',
      });
    } else {
      this.setState({
        [field + 'Error']: '',
      });
    }
  };

  onFileChange = (event) => {
    this.setState({ selectedFile: event.target.files[0] });
  };

  formValidation = () => {
    let nameRegex = /^[a-zA-Z][a-zA-Z,.'-\s]*$/;
    let titleRegex = /^[\w\-\s]+$/;
    let error = false;

    // Testing player names

    if (!nameRegex.test(this.state.player1FName)) {
      this.setState({
        player1FNameError: 'Invalid characters in name, please try again.',
      });
      error = true;
    }

    if (this.state.player1FName.length > 50) {
      this.setState({
        player1FNameError: 'Name is too long, please try again.',
      });
      error = true;
    }

    if (!nameRegex.test(this.state.player1LName)) {
      this.setState({
        player1LNameError: 'Invalid characters in name, please try again.',
      });
      error = true;
    }

    if (this.state.player1LName.length > 50) {
      this.setState({
        player1LNameError: 'Name is too long, please try again.',
      });
      error = true;
    }

    if (!nameRegex.test(this.state.player2FName)) {
      this.setState({
        player2FNameError: 'Invalid characters in name, please try again.',
      });
      error = true;
    }

    if (this.state.player2FName.length > 50) {
      this.setState({
        player2FNameError: 'Name is too long, please try again.',
      });
      error = true;
    }

    if (!nameRegex.test(this.state.player2LName)) {
      this.setState({
        player2LNameError: 'Invalid characters in name, please try again.',
      });
      error = true;
    }

    if (this.state.player2LName.length > 50) {
      this.setState({
        player2LNameError: 'Name is too long, please try again.',
      });
      error = true;
    }

    // Testing match title

    if (!titleRegex.test(this.state.title)) {
      this.setState({
        titleError: 'Invalid characters in match title, please try again.',
      });
      error = true;
    }

    if (this.state.title.length > 100) {
      this.setState({
        titleError: 'Match title is too long, please try again.',
      });
      error = true;
    }

    if (this.state.title.length < 5) {
      this.setState({
        titleError: 'Match title is too short, please try again.',
      });
      error = true;
    }

    // Testing match description

    if (this.state.description.length > 250) {
      this.setState({
        descriptionError: 'Match description is too long, please try again.',
      });
      error = true;
    }

    // Testing match duration

    if (parseInt(this.state.hours) > 2) {
      this.setState({
        durationError: 'Match duration is too long, please try again.',
      });
      error = true;
    }

    if (parseInt(this.state.minutes) > 59) {
      this.setState({
        durationError: 'Invalid input for minutes, please try again.',
      });
      error = true;
    }

    if (parseInt(this.state.hours) > 1 && parseInt(this.state.minutes) > 0) {
      this.setState({
        durationError:
          'Match duration is too long. Maximum duration is 2 hours.',
      });
      error = true;
    }

    return error;
  };

  handleSubmit = (event) => {
    this.setState({
      player1FNameError: '',
      player1LNameError: '',
      player2FNameError: '',
      player2LNameError: '',
      titleError: '',
      durationError: '',
    });
    event.preventDefault();

    const players = {
      player1: {
        firstName: this.state.player1FName,
        lastName: this.state.player1LName,
      },
      player2: {
        firstName: this.state.player2FName,
        lastName: this.state.player2LName,
      },
    };
    const title = this.state.title;
    const duration = this.convertHMToSeconds(
      this.state.hours,
      this.state.minutes,
      this.state.seconds,
    );
    const description = this.state.description;

    let form_error = this.formValidation();
    if (!form_error) {
      this.props.history.push({
        pathname: '/new/court',
        state: {
          from: this.props.location.pathname,
          player: players,
          title: title,
          duration: duration,
          description: description,
          video: this.state.selectedFile,
        },
      })
    }
  };

  convertHMToSeconds = (numHours, numMinutes, numSeconds) => {
    return numHours * 60 * 60 + numMinutes * 60 + numSeconds;
  };

  render() {
    return (
      <>
        <div className="container mx-auto px-3 mb-10 max-w-5xl">
          <h2 className="text-2xl sm:text-3xl font-bold leading-7 pl-2 mb-6 text-gray-900">
            <span className="align-middle">Create New Match</span>
          </h2>

          <form
            className="w-full grid grid-cols-12"
            onSubmit={this.handleSubmit}
          >
            <div className="col-span-12 sm:col-span-6 mr-4 pl-2">
              <h4 className="text-1xl sm:text-2xl font-bold leading-7 mb-3 text-gray-900">
                {' '}
                Player Details{' '}
              </h4>

              <div className="w-full">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-s font-bold mb-2"
                  for="grid-first-name"
                >
                  Player 1:
                </label>
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  for="grid-first-name"
                >
                  First Name
                </label>
                <p className="text-xs text-red-700 mb-2">
                  {this.state.player1FNameError}
                </p>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                  id="grid-first-name"
                  type="text"
                  value={this.state.player1FName}
                  name="player1FName"
                  onChange={(event) => this.handleChange(event, 'player1FName')}
                  required
                />
              </div>
              <div className="w-full">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  for="grid-last-name"
                >
                  Last Name
                </label>
                <p className="text-xs text-red-700 mb-2">
                  {this.state.player1LNameError}
                </p>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 py-3 px-4 mb-3  leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-last-name"
                  type="text"
                  value={this.state.player1LName}
                  name="player1LName"
                  onChange={(event) => this.handleChange(event, 'player1LName')}
                  required
                />
              </div>

              <div className="w-full ">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-s font-bold mb-2"
                  for="grid-first-name"
                >
                  Player 2:
                </label>
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  for="grid-first-name"
                >
                  First Name
                </label>
                <p className="text-xs text-red-700 mb-2">
                  {this.state.player2FNameError}
                </p>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                  id="grid-first-name"
                  type="text"
                  value={this.state.player2FName}
                  name="player2FName"
                  onChange={(event) => this.handleChange(event, 'player2FName')}
                  required
                />
              </div>
              <div className="w-full">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  for="grid-last-name"
                >
                  Last Name
                </label>
                <p className="text-xs text-red-700 mb-2">
                  {this.state.player2LNameError}
                </p>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-last-name"
                  type="text"
                  value={this.state.player2LName}
                  name="player2LName"
                  onChange={(event) => this.handleChange(event, 'player2LName')}
                  required
                />
              </div>

              <h4 className="text-1xl sm:text-2xl font-bold leading-7 mb-3 text-gray-900">
                {' '}
                Match Details{' '}
              </h4>

              <div className="w-full">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  for="grid-password"
                >
                  Match Title
                </label>
                <p className="text-xs text-red-700 mb-2">
                  {this.state.titleError}
                </p>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-password"
                  type="text"
                  value={this.state.title}
                  name="title"
                  onChange={(event) => this.handleChange(event, 'title')}
                  required
                />
              </div>

              <div className="w-full">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  for="grid-password"
                >
                  Match Description
                </label>
                <p className="text-xs text-red-700 mb-2">
                  {this.state.descriptionError}
                </p>
                <textarea
                  rows="5"
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-password"
                  type="text"
                  value={this.state.description}
                  name="description"
                  onChange={(event) => this.handleChange(event, 'description')}
                >
                  {' '}
                </textarea>
              </div>

              <div className="w-full">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  for="grid-password"
                >
                  Empty Court Time
                </label>
                <p className="text-xs text-red-700 mb-2">
                  {this.state.durationError}
                </p>
                <div className="flex">
                <input
                    className="appearance-none block w-1/2 bg-gray-200 text-gray-700 border border-gray-200 py-3 px-4 mb-3 mr-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-password"
                    type="number"
                    max="2"
                    min="0"
                    value={this.state.hours}
                    name="hours"
                    onChange={(event) => this.handleChange(event, 'hours')}
                    placeholder="hours"
                    required
                  />
                  <input
                    className="appearance-none block w-1/2 bg-gray-200 text-gray-700 border border-gray-200 py-3 px-4 mb-3 mr-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-password"
                    type="number"
                    max="59"
                    min="0"
                    value={this.state.minutes}
                    name="minutes"
                    onChange={(event) => this.handleChange(event, 'minutes')}
                    placeholder="minutes"
                    required
                  />
                  <input
                    className="appearance-none block w-1/2 bg-gray-200 text-gray-700 border border-gray-200 py-3 px-4 mb-3 ml-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-password"
                    type="number"
                    max="59"
                    min="0"
                    value={this.state.seconds}
                    name="seconds"
                    onChange={(event) => this.handleChange(event, 'seconds')}
                    placeholder="seconds"
                    required
                  />
                </div>
              </div>

            </div>
            <div className="col-span-12 sm:col-span-6 pr-2 ml-2 sm:ml-4 pl-2">
              <h4 className="text-1xl sm:text-2xl font-bold leading-7 mb-3 text-gray-900">
                {' '}
                Video Details{' '}
              </h4>

              <div className="border-2 border-gray-200 mr-2 mb-4 flex-wrap h-40 bg-gray-100">
                <input
                  id="upload"
                  name="none"
                  type="file"
                  accept="video/mp4, video/mov, video/avi"
                  onChange={this.onFileChange}
                  required
                  className="pl-2 pt-1"
                />
                <label
                  className="w-44 m-auto mt-8 block uppercase text-white bg-gray-700 px-3 py-3 hover:bg-gray-900 cursor-pointer text-xs text-center font-bold mb-1cursor-pointer"
                  for="upload"
                >
                  <FontAwesomeIcon icon={faUpload} />
                  <span className="pl-2">Click to Upload</span>
                </label>
              </div>
              <button
                type="submit"
                className="shadow bg-green-700 hover:bg-green-600 focus:shadow-outline hover:cursor-pointer focus:outline-none text-white font-bold py-2 px-4"
              >
                {' '}
                Next{' '}
              </button>
            </div>
          </form>
        </div>
      </>
    );
  }
}

export default withRouter(NewMatch);
