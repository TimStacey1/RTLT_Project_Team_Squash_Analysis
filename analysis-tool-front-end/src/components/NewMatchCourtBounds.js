import React from 'react';
import { useRef,useEffect} from 'react';
import { withRouter } from 'react-router-dom';
import styles from './courtBounds.module.css';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faUpload } from '@fortawesome/free-solid-svg-icons';



function Canvas(props) {
    const canvasRef = useRef(null);
    const coordRef = useRef(0);
    
    const image = new Image();

    image.onload = () => {
        canvasRef.current.getContext('2d').drawImage(image,0,0,props.width,props.height);
    };

    function frontLeftbtn(){
      const confirm = document.getElementById("fL").getContext("2d");
      confirm.fillStyle = 'red';
      confirm.fillRect(0,0,25,25)
      coordRef.current = 1;
    };

    function frontRightbtn(){
      const confirm = document.getElementById("fR").getContext("2d");
      confirm.fillStyle = 'red';
      confirm.fillRect(0,0,25,25)
      coordRef.current = 2;
    };

    function backLeftbtn(){
      coordRef.current = 3;
      const confirm = document.getElementById("bL").getContext("2d");
      confirm.fillStyle = 'red';
      confirm.fillRect(0,0,25,25)
    };

    function backRightbtn(){
      const confirm = document.getElementById("bR").getContext("2d");
      confirm.fillStyle = 'red';
      confirm.fillRect(0,0,25,25)
      coordRef.current = 4;
    };

    function midLeftbtn(){
      const confirm = document.getElementById("mL").getContext("2d");
      confirm.fillStyle = 'red';
      confirm.fillRect(0,0,25,25)
      coordRef.current = 5;
    };

    function midRightbtn(){
      const confirm = document.getElementById("mR").getContext("2d");
      confirm.fillStyle = 'red';
      confirm.fillRect(0,0,25,25)
      coordRef.current = 6;
    };
    
    const handleFileInput = (event) => {
        image.src = URL.createObjectURL(event.target.files[0]);
    };
  
    useEffect(() => {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
    
      context.fillStyle = 'green';
      context.fillRect(0,0,props.width, props.height);
      const clickHandler = (event) =>{
        const rect = canvas.getBoundingClientRect();
        if (coordRef.current === 1){
          props.court_bounds[0] = [Math.floor(event.clientX - rect.left), Math.floor(event.clientY - rect.top)];
          coordRef.current = 0;
          const confirm = document.getElementById("fL").getContext("2d");
          confirm.fillStyle = 'lime';
          confirm.fillRect(0,0,25,25)
          console.log(1);
        }
        else if (coordRef.current === 2){
          props.court_bounds[1] = [Math.floor(event.clientX - rect.left), Math.floor(event.clientY - rect.top)];
          coordRef.current = 0;
          const confirm = document.getElementById("fR").getContext("2d");
          confirm.fillStyle = 'lime';
          confirm.fillRect(0,0,25,25)
          console.log(2);
        }
        else if (coordRef.current === 3){
          props.court_bounds[2] = [Math.floor(event.clientX - rect.left), Math.floor(event.clientY - rect.top)];
          coordRef.current = 0;
          const confirm = document.getElementById("bL").getContext("2d");
          confirm.fillStyle = 'lime';
          confirm.fillRect(0,0,25,25)
          console.log(3);
        }
        else if (coordRef.current === 4){
          props.court_bounds[3] = [Math.floor(event.clientX - rect.left), Math.floor(event.clientY - rect.top)];
          coordRef.current = 0;
          const confirm = document.getElementById("bR").getContext("2d");
          confirm.fillStyle = 'lime';
          confirm.fillRect(0,0,25,25)
          console.log(4);
        }
        else if (coordRef.current === 5){
          props.court_bounds[4] = [Math.floor(event.clientX - rect.left), Math.floor(event.clientY - rect.top)];
          coordRef.current = 0;
          const confirm = document.getElementById("mL").getContext("2d");
          confirm.fillStyle = 'lime';
          confirm.fillRect(0,0,25,25)
          console.log(5);
        }
        else if (coordRef.current === 6){
          props.court_bounds[5] = [Math.floor(event.clientX - rect.left), Math.floor(event.clientY - rect.top)];
          coordRef.current = 0;
          const confirm = document.getElementById("mR").getContext("2d");
          confirm.fillStyle = 'lime';
          confirm.fillRect(0,0,25,25)
          console.log(6);
        }
        else {
          console.log(props.court_bounds);
        }
      };
  
      canvas.addEventListener('click',clickHandler);
      return () => {
        canvas.removeEventListener('click', clickHandler);
      };
    }, []);
  
    return (<>
            <div class={styles.content}>
                <canvas ref={canvasRef} width={props.width} height={props.height}/>
            </div>
            <div class={styles.sidebar}>
              <div class={styles.input}>
                <p>Select an image</p>
                <input onChange={handleFileInput} type="file" accept="image/*" />
              </div>
            </div>

            <div class={styles.sidebar}>
              <div class={styles.selectSection}>
              <button type="button" class={styles.btn} onClick={frontLeftbtn}>Front Left</button>
              <canvas id="fL" width={25} height={25} class={styles.confirm}></canvas>

              <button type="button" class={styles.btn} onClick={frontRightbtn}>Front Right</button>
              <canvas id="fR" width={25} height={25} class={styles.confirm}></canvas>

              <button type="button" class={styles.btn} onClick={backLeftbtn}>Back Left</button>
              <canvas id="bL" width={25} height={25} class={styles.confirm}></canvas>

              <button type="button" class={styles.btn} onClick={backRightbtn}>Back Right</button>
              <canvas id="bR" width={25} height={25} class={styles.confirm}></canvas>

              <button type="button" class={styles.btn} onClick={midLeftbtn}>Short Line Left</button>
              <canvas id="mL" width={25} height={25} class={styles.confirm}></canvas>

              <button type="button" class={styles.btn} onClick={midRightbtn}>Short Line Right</button>
              <canvas id="mR" width={25} height={25} class={styles.confirm}></canvas>

              </div>
            </div>
              </>);
}

class CourtBounds extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            value:this.props.location.state,
            courtBounds: [[],[],[],[],[],[]],
        };
    }

    formValidation = () =>{
        let error = false
        if(this.state.courtBounds[0].length !== 2){
            error = true;
        }
        if(this.state.courtBounds[1].length !== 2){
            error = true;
        }
        if(this.state.courtBounds[2].length !== 2){
            error = true;
        }
        if(this.state.courtBounds[3].length !== 2){
            error = true;
        }
        if(this.state.courtBounds[4].length !== 2){
            error = true;
        }
        if(this.state.courtBounds[5].length !== 2){
            error = true;
        }

        return error;
    };


    handleSubmit = (event) =>{
        let form_error = this.formValidation();
        event.preventDefault();
        if (!form_error) {
            this.props.history.push({
                pathname: '/new/colourPick',
                state: {
                  from: this.props.location.pathname,
                  player: this.state.value.player,
                  title: this.state.value.title,
                  duration: this.state.value.duration,
                  description: this.state.value.description,
                  video: this.state.value.video,
                  court_Bounds: this.state.courtBounds,
                },
              })
        }
    };


    render() {
        return (
            <>
            <body class={styles.body}>
            <div class={styles.wrapper}>
                <Canvas width={1280} height={720} court_bounds={this.state.courtBounds}></Canvas>
                <form onSubmit={this.handleSubmit} class={styles.sidebar}>
                  <div class={styles.sidebar}>
                    <div class={styles.submit}>
                    <button type="submit" class={styles.submitBtn}>
                        Next
                    </button>
                    </div>
                  </div>
                </form>
              </div>
              </body>
            </>
        );
    }
}

export default withRouter(CourtBounds);