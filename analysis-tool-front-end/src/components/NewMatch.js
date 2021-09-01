import React from 'react';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';

const axios = require('axios').default;

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
      description: '',
      selectedFile: ''
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = (event, field) => {
    this.setState({ [field]: event.target.value });
  };

  onFileChange = (event) => {
    this.setState({ selectedFile: event.target.files[0] });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const players = {
      player1: {
        firstName: this.state.player1FName,
        lastName: this.state.player1LName
      },
      player2: {
        firstName: this.state.player2FName,
        lastName: this.state.player2LName
      }
    };
    const title = this.state.title;
    const duration = this.convertHMToSeconds(
      this.state.hours,
      this.state.minutes
    );
    const description = this.state.description;

    const formData = new FormData();
    formData.append('video', this.state.selectedFile);

    axios
      .post(this.props.baseUrl + '/match/new', {
        players,
        title,
        duration,
        description
      })
      .then((response) => {
        axios.post(
          this.props.baseUrl + '/video/' + response.data.match_id + '/upload',
          formData
        );
      })
      .then(this.props.history.push('/home'));
  };

  convertHMToSeconds = (numHours, numMinutes) => {
    return numHours * 60 * 60 + numMinutes * 60;
  };

  render() {
    return (
      <>
        <div className="container mx-auto px-3 mb-10 max-w-5xl">
          <h2 className="text-2xl sm:text-3xl font-bold leading-7 pl-2 mb-3 text-gray-900">
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
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                  id="grid-first-name"
                  type="text"
                  value={this.state.player1FName}
                  name="player1FName"
                  onChange={(event) => this.handleChange(event, 'player1FName')}
                />
              </div>
              <div className="w-full">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  for="grid-last-name"
                >
                  Last Name
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 py-3 px-4 mb-3  leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-last-name"
                  type="text"
                  value={this.state.player1LName}
                  name="player1LName"
                  onChange={(event) => this.handleChange(event, 'player1LName')}
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
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                  id="grid-first-name"
                  type="text"
                  value={this.state.player2FName}
                  name="player2FName"
                  onChange={(event) => this.handleChange(event, 'player2FName')}
                />
              </div>
              <div className="w-full">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  for="grid-last-name"
                >
                  Last Name
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-last-name"
                  type="text"
                  value={this.state.player2LName}
                  name="player2LName"
                  onChange={(event) => this.handleChange(event, 'player2LName')}
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
                  Match Title:
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-password"
                  type="text"
                  value={this.state.title}
                  name="title"
                  onChange={(event) => this.handleChange(event, 'title')}
                />
              </div>

              <div className="w-full">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  for="grid-password"
                >
                  Match Description:
                </label>
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
                  Match Duration:
                </label>
                <div className="flex">
                  <input
                    className="appearance-none block w-1/2 bg-gray-200 text-gray-700 border border-gray-200 py-3 px-4 mb-3 mr-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-password"
                    type="number"
                    value={this.state.hours}
                    name="hours"
                    onChange={(event) => this.handleChange(event, 'hours')}
                    placeholder="hours"
                  />
                  <input
                    className="appearance-none block w-1/2 bg-gray-200 text-gray-700 border border-gray-200 py-3 px-4 mb-3 ml-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-password"
                    type="number"
                    value={this.state.minutes}
                    name="minutes"
                    onChange={(event) => this.handleChange(event, 'minutes')}
                    placeholder="minutes"
                  />
                </div>
              </div>
            </div>
            <div className="col-span-12 sm:col-span-6 pr-2 ml-2 sm:ml-4">
              <h4 className="text-1xl sm:text-2xl font-bold leading-7 mb-3 text-gray-900">
                {' '}
                Video Details{' '}
              </h4>

              <div className="border-2 border-gray-200 mr-2 mb-4 flex h-40 bg-gray-100">
                <div className="m-auto">
                  <h5 className="block uppercase text-gray-700 text-xs text-center font-bold mb-1">
                    {' '}
                    Drag and Drop Video{' '}
                  </h5>
                  <h5 className="block uppercase text-gray-700 text-xs text-center font-bold mb-1">
                    {' '}
                    or{' '}
                  </h5>
                  <h5 className="block uppercase text-white bg-gray-700 px-3 py-1 hover:bg-gray-900 cursor-pointer text-xs text-center font-bold mb-1">
                    {' '}
                    <div>
                      <label className="cursor-pointer" for="upload">
                        <FontAwesomeIcon icon={faUpload} />
                        <span className="pl-2">Click to Upload</span>
                      </label>
                      <input
                        id="upload"
                        className="hidden"
                        type="file"
                        accept="video/mp4"
                        onChange={this.onFileChange}
                      />
                    </div>
                  </h5>
                </div>
              </div>
              <div className="relative pt-1 mr-2">
                <div className="overflow-hidden h-2 mb-4 text-xs flex bg-green-100">
                  <div className="shadow-none w-4/12 flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-700"></div>
                </div>
              </div>
              <button
                type="submit"
                className="shadow bg-green-700 hover:bg-green-600 focus:shadow-outline hover:cursor-pointer focus:outline-none text-white font-bold py-2 px-4"
              >
                {' '}
                Create Match{' '}
              </button>
            </div>
          </form>
        </div>
      </>
    );
  }
}
export default withRouter(NewMatch);
