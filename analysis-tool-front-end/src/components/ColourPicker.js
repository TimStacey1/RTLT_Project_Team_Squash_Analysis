import React from "react";
import { useState } from 'react';
import { withRouter } from 'react-router-dom';
import styles from "./colorPicker.module.cs";

const axios = require('axios').default;

function ColourPick(props) { 
  const [color, setColor] = useState("#5524e7");
  const [image, setImage] = useState(null);

  async function openEyeDropper() {
    let eyeDropper = new window.EyeDropper();
    const { sRGBHex } = await eyeDropper.open();
    setColor(sRGBHex );
  };

  const handleFileInput = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  async function handleCopyColor() {
    const sRGBHex = color;
    
    const hex = sRGBHex.replace(/^#/,'');

    const r = parseInt(hex.substring(0,2),16);
    const g = parseInt(hex.substring(2,4),16);
    const b = parseInt(hex.substring(4,6),16);
    const rgbString = `${r}, ${g}, ${b}`;
    props.rgbArray.push(r);
    props.rgbArray.push(g);
    props.rgbArray.push(b);
    await navigator.clipboard.writeText(rgbString);
    alert(`Copied First Player RGB value: ${rgbString} to clipboard!`);
  };

  return (
    <>
    <div className={styles.wrapper}>
      <div className={styles.leftColumn}>
        <h1 className={styles.headingText}>Pick color from image</h1>

        <div className={styles.formSection}>
          <p>1. Select an image</p>
          <input onChange={handleFileInput} type="file" accept="image/*" />
        </div>

        <div className={styles.formSection}>
          <p>2. Pick color</p>
          <button className={styles.openPickerButton} onClick={openEyeDropper}>
            Open Eyedropper
          </button>
        </div>

        <div className={styles.formSection}>
          <p>3. View selected</p>
          <button
            className={styles.selectedColor}
            style={{ background: color }}
            onClick={handleCopyColor}
          >
            Copy Colour
          </button>
        </div>
      </div>

      <div className={styles.rightColumn}>
        {image ? (
          <>
            <img src={image} alt="Working image" />
            <div
              style={{
                backgroundImage: `url(${image})`,
              }}
            />
          </>
        ) : (
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 16 16"
            height="4em"
            width="4em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707v5.586l-2.73-2.73a1 1 0 0 0-1.52.127l-1.889 2.644-1.769-1.062a1 1 0 0 0-1.222.15L2 12.292V2a2 2 0 0 1 2-2zm5.5 1.5v2a1 1 0 0 0 1 1h2l-3-3zm-1.498 4a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0z"></path>
            <path d="M10.564 8.27 14 11.708V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-.293l3.578-3.577 2.56 1.536 2.426-3.395z"></path>
          </svg>
        )}
      </div>
    </div>
    </>
  );
}


class ColourPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state={
        value:this.props.location.state,
        RGBArray: [],
    }
  }

  formValidation = () =>{
    let error = false;
    if(this.state.RGBArray.length === 0){
      error = true;
    }
    return error
  }
  handleSubmit = (event) => {
    let form_error = this.formValidation();
    event.preventDefault();
    const players = this.state.value.player;
    const title = this.state.value.title;
    const duration = this.state.value.duration;
    const description = this.state.value.description;
    const video = this.state.value.video;
    const courtBounds = this.state.value.court_Bounds;
    const playerRGB = this.state.RGBArray;
    const formData = new FormData();
    formData.append('video', video);
    if(!form_error){
      axios
      .post(this.props.baseUrl + '/match/new', {
        players,
        title,
        duration,
        description,
        courtBounds,
        playerRGB,
      })
      .then((response) => {
        axios.post(
          this.props.baseUrl + '/video/' + response.data.match_id + '/upload',
          formData,
        );
      })
      .then(
        this.props.history.push({
          pathname: '/home',
          state: this.state.value.from
        })
      )
    }
  }
  render()
  {
    return(
      <>
      <div>
        <ColourPick rgbArray={this.state.RGBArray}></ColourPick>
      </div>
      <div>
        <form onSubmit={this.handleSubmit}>
          <button type="submit" className="shadow bg-green-700 hover:bg-green-600 focus:shadow-outline hover:cursor-pointer focus:outline-none text-white font-bold py-2 px-4">
            Create Match
          </button>
        </form>
      </div>
      </>
    );
  }
}

export default withRouter(ColourPicker);



