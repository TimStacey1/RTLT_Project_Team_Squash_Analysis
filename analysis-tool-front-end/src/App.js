import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import Navbar from './components/Navbar';
import MainMenu from './components/MainMenu';
import NewMatch from './components/NewMatch';
import AnnotationInterface from './components/AnnotationInterface';
import Statistics from './components/Statistics';
import ViewVideo from './components/ViewVideo';
import CourtBounds from './components/NewMatchCourtBounds';
import ColourPicker from './components/ColourPicker';
import AllStatistics from './components/AllStatistics';


//<Route path="/new/canvas">
//<CanvasTest baseUrl={baseUrl} />
//</Route>
function App() {
  const baseUrl = 'http://localhost:3001';

  return (
    <div className="App">
      <Navbar />
      <Router>
        <Route path="/home">
          <MainMenu baseUrl={baseUrl} />
        </Route>
        <Route exact path="/">
          <Redirect to="/home"></Redirect>
        </Route>
        <Route path="/new/match">
          <NewMatch baseUrl={baseUrl} />
        </Route>
        <Route path="/new/court">
          <CourtBounds baseUrl={baseUrl} />
        </Route>
        <Route path="/new/colourPick">
          <ColourPicker baseUrl={baseUrl} />
        </Route>
        <Route path="/match/:id">
          <AnnotationInterface baseUrl={baseUrl} />
        </Route>
        <Route path="/view_video/:id">
          <ViewVideo baseUrl={baseUrl} />
        </Route>
        <Route path="/stats/:id">
          <Statistics baseUrl={baseUrl} />
        </Route>
        <Route path="/all/stats">
            <AllStatistics baseUrl={baseUrl} />
        </Route>
      </Router>
    </div>
  );
}

export default App;
