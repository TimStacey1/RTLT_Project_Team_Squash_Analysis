import React from "react";
import { useState } from 'react';
import { withRouter } from 'react-router-dom';
import styles from "./colorPicker.module.css";

const axios = require('axios').default;

/*
This file allows for the creation of a colourpicker in a html application, using style from colorPicker.module.css.
*/


function ColourPick(props) { 
  //Set initial colours for our two players, before eyedroppers are used.
  const [color1, setColor1] = useState("#006F3A");
  const [color2, setColor2] = useState("#EBC015");
  const [image, setImage] = useState(null);

  //Create instance of an eye dropper to select player 1's colour.
  async function openEyeDropper1() {
    let eyeDropper = new window.EyeDropper();
    const { sRGBHex } = await eyeDropper.open();
    const hex = sRGBHex.replace(/^#/,'');
    const r = parseInt(hex.substring(0,2),16);
    const g = parseInt(hex.substring(2,4),16);
    const b = parseInt(hex.substring(4,6),16);
    props.rgbArray[0].push(r);
    props.rgbArray[0].push(g);
    props.rgbArray[0].push(b);
    setColor1(sRGBHex );
  };

  //Create instance of another eye dropper to select player 2's colour.
  async function openEyeDropper2() {
    let eyeDropper = new window.EyeDropper();
    const { sRGBHex } = await eyeDropper.open();
    const hex = sRGBHex.replace(/^#/,'');
    const r = parseInt(hex.substring(0,2),16);
    const g = parseInt(hex.substring(2,4),16);
    const b = parseInt(hex.substring(4,6),16);
    props.rgbArray[1].push(r);
    props.rgbArray[1].push(g);
    props.rgbArray[1].push(b);
    setColor2(sRGBHex );
  };

  //Function used when selecting an image. It provides the selected image with a url, which can be used in a html file.
  const handleFileInput = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  // Function used to grab a hexidecimal colour, convert it into a RGB value, and copy that value to the clipboard.
  async function handleCopyColor1() {
    const sRGBHex = color1;
    
    const hex = sRGBHex.replace(/^#/,'');

    const r = parseInt(hex.substring(0,2),16);
    const g = parseInt(hex.substring(2,4),16);
    const b = parseInt(hex.substring(4,6),16);
    const rgbString = `${r}, ${g}, ${b}`;
    await navigator.clipboard.writeText(rgbString);
    alert(`Copied First Player RGB value: ${rgbString} to clipboard!`);
  };
  // Same as above
  async function handleCopyColor2() {
    const sRGBHex = color2;
    
    const hex = sRGBHex.replace(/^#/,'');

    const r = parseInt(hex.substring(0,2),16);
    const g = parseInt(hex.substring(2,4),16);
    const b = parseInt(hex.substring(4,6),16);
    const rgbString = `${r}, ${g}, ${b}`;
    await navigator.clipboard.writeText(rgbString);
    alert(`Copied First Player RGB value: ${rgbString} to clipboard!`);
  };

  // The below returned code reders the html which will be displayed, using the functions defined above.
  return (
    <>       

        <h1 class={styles.bigHeadererFile}><b>Player Selection</b></h1>  
        <div class={styles.ImageSelection}>
          <h5><b>Choose Image By Selecting Below Text:</b></h5>
          <div className={styles.formSectionImage}>
            <input onChange={handleFileInput} type="file" accept="image/*" />
          </div> 
        </div>        
        <div class={styles.Player1Selection}>
          <div className={styles.formSectionText}>
            <h5><b>Pick Player 1 Colour:</b></h5>
            <button type="button" className={styles.openPickerButton} onClick={openEyeDropper1}>
            Open Eyedropper
            </button>
          </div>
  
          <div className={styles.formSectionText}>
            {/* <p>3. View selected</p> */}
            <button type="button" className={styles.selectedColor}
            style={{ background: color1 }}
            onClick={handleCopyColor1}
            >
            Copy Colour
            </button>
          </div>
        </div>
        <div class={styles.Player2Selection}>
        <div className={styles.formSectionText}>
            <h5><b>Pick Player 2 Colour:</b></h5>
            <button type="button" className={styles.openPickerButton} onClick={openEyeDropper2}>
            Open Eyedropper
            </button>
            </div>
  
            <div className={styles.formSectionText}>
            {/* <p>3. View selected</p> */}
            <button type="button" className={styles.selectedColor}
            style={{ background: color2 }}
            onClick={handleCopyColor2}
            >
            Copy Colour
            </button>
            </div>
        </div>

        <div class={styles.absoluteDiv4}>          
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
        RGBArray: [[],[]],
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
    <head>
      <meta charSet="utf-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <title>Player Selection</title>
    </head>

      <body>
      
      <div class={styles.relativeDiv}>
      <form onSubmit={this.handleSubmit}>
        <ColourPick rgbArray={this.state.RGBArray}></ColourPick>
        <div type="submit" class={styles.ProcessDiv}>
            <button className={styles.NextButtonColour}>
              Process
            </button>
          </div> 
          </form>
        </div>

      </body>
      </>
    );
  }
}

export default withRouter(ColourPicker);



