import React from 'react';
import { useRef,useEffect} from 'react';
import { withRouter } from 'react-router-dom';
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
      coordRef.current = 1;
    };

    function frontRightbtn(){
      coordRef.current = 2;
    };

    function backLeftbtn(){
      coordRef.current = 3;
    };

    function backRightbtn(){
      coordRef.current = 4;
    };

    function midLeftbtn(){
      coordRef.current = 5;
    };

    function midRightbtn(){
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
          console.log(1);
        }
        else if (coordRef.current === 2){
          props.court_bounds[1] = [Math.floor(event.clientX - rect.left), Math.floor(event.clientY - rect.top)];
          coordRef.current = 0;
          console.log(2);
        }
        else if (coordRef.current === 3){
          props.court_bounds[2] = [Math.floor(event.clientX - rect.left), Math.floor(event.clientY - rect.top)];
          coordRef.current = 0;
          console.log(3);
        }
        else if (coordRef.current === 4){
          props.court_bounds[3] = [Math.floor(event.clientX - rect.left), Math.floor(event.clientY - rect.top)];
          coordRef.current = 0;
          console.log(4);
        }
        else if (coordRef.current === 5){
          props.court_bounds[4] = [Math.floor(event.clientX - rect.left), Math.floor(event.clientY - rect.top)];
          coordRef.current = 0;
          console.log(5);
        }
        else if (coordRef.current === 6){
          props.court_bounds[5] = [Math.floor(event.clientX - rect.left), Math.floor(event.clientY - rect.top)];
          coordRef.current = 0;
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
            <div>
                <p>1. Select an image</p>
                <input onChange={handleFileInput} type="file" accept="image/*" />
            </div>
            <div>
                <canvas ref={canvasRef} width={props.width} height={props.height}/>
            </div>
            <div>
              <button type="button" className="shadow bg-green-700 hover:bg-green-600 focus:shadow-outline hover:cursor-pointer focus:outline-none text-white font-bold py-2 px-4" 
              onClick={frontLeftbtn}>frontLeft</button>
              <p>     </p>
              <button type="button" className="shadow bg-green-700 hover:bg-green-600 focus:shadow-outline hover:cursor-pointer focus:outline-none text-white font-bold py-2 px-4" 
              onClick={frontRightbtn}>frontRight</button>
              <p>     </p>
              <button type="button" className="shadow bg-green-700 hover:bg-green-600 focus:shadow-outline hover:cursor-pointer focus:outline-none text-white font-bold py-2 px-4" 
              onClick={backLeftbtn}>backLeft</button>
              <p>     </p>
              <button type="button" className="shadow bg-green-700 hover:bg-green-600 focus:shadow-outline hover:cursor-pointer focus:outline-none text-white font-bold py-2 px-4" 
              onClick={backRightbtn}>backRight</button>
              <p>     </p>
              <button type="button" className="shadow bg-green-700 hover:bg-green-600 focus:shadow-outline hover:cursor-pointer focus:outline-none text-white font-bold py-2 px-4" 
              onClick={midLeftbtn}>midLeft</button>
              <p>     </p>
              <button type="button" className="shadow bg-green-700 hover:bg-green-600 focus:shadow-outline hover:cursor-pointer focus:outline-none text-white font-bold py-2 px-4" 
              onClick={midRightbtn}>midRight</button>
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
            <div>
                <Canvas width={1280} height={720} court_bounds={this.state.courtBounds}></Canvas>
            </div>
            <div>
                <br/>
                <br/>
                <form className="w-full grid grid-cols-12" onSubmit={this.handleSubmit}>
                    <button type="submit" className="shadow bg-green-700 hover:bg-green-600 focus:shadow-outline hover:cursor-pointer focus:outline-none text-white font-bold py-2 px-4">
                        Next
                    </button>
                </form>
            </div>
            </>
        );
    }
}

export default withRouter(CourtBounds);