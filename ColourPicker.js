import { useState } from "react";
import React from "react";
import styles from "./colorPicker.module.css";

const ColourPicker = () => { 
  const [color1, setColor1] = useState("#006F3A");
  const [color2, setColor2] = useState("#EBC015");
  const [image, setImage] = useState(null);

  const openEyeDropper1 = async () => {
    let eyeDropper = new window.EyeDropper();
    const { sRGBHex } = await eyeDropper.open();
    setColor1(sRGBHex );
  };

  const openEyeDropper2 = async () => {
    let eyeDropper = new window.EyeDropper();
    const { sRGBHex } = await eyeDropper.open();
    setColor2(sRGBHex );
  };

  const handleFileInput = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  const handleCopyColor1 = async () => {
    const sRGBHex = color1;
    
    const hex = sRGBHex.replace(/^#/,'');

    const r = parseInt(hex.substring(0,2),16);
    const g = parseInt(hex.substring(2,4),16);
    const b = parseInt(hex.substring(4,6),16);
    const rgbString1 = `${r}, ${g}, ${b}`;
    await navigator.clipboard.writeText(rgbString1);
    alert(`Copied First Player RGB value: ${rgbString1} to clipboard!`);
  };

  const handleCopyColor2 = async () => {
    const sRGBHex = color2;
    
    const hex = sRGBHex.replace(/^#/,'');

    const r = parseInt(hex.substring(0,2),16);
    const g = parseInt(hex.substring(2,4),16);
    const b = parseInt(hex.substring(4,6),16);
    const rgbString2 = `${r}, ${g}, ${b}`;
    await navigator.clipboard.writeText(rgbString2);
    alert(`Copied First Player RGB value: ${rgbString2} to clipboard!`);
  };

  return (
  <>
    <head>
      <meta charSet="utf-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <title>Player Selection</title>
    </head>

    <body>          
      <div class={styles.relativeDiv}>
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
            <button className={styles.openPickerButton} onClick={openEyeDropper1}>
            Open Eyedropper
            </button>
          </div>
  
          <div className={styles.formSectionText}>
            {/* <p>3. View selected</p> */}
            <button className={styles.selectedColor}
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
            <button className={styles.openPickerButton} onClick={openEyeDropper2}>
            Open Eyedropper
            </button>
            </div>
  
            <div className={styles.formSectionText}>
            {/* <p>3. View selected</p> */}
            <button className={styles.selectedColor}
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
          <div class={styles.ProcessDiv}>
            <a href='https://www.dndbeyond.com/'>
            <button className={styles.NextButtonColour}>
              Process
            </button>
            </a>
          </div> 
      </div> 
      
    </body>
  </>
  )  
  };         
  

export default ColourPicker;