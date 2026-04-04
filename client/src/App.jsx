import LapTracker from "./pages/lapTracker/LapTracker";

// TESTIMISEKS VAHETADA KOMPONENTI

function App() {
 return (
    <div className="App">
      <h1>Lap-Tracker</h1>

      {/* algversioonis kuvan toorelt lihtsalt mulle vajaliku
      komponendi ja ei mässa veel route-imisega: */}
      <LapTracker
        //timerData={timerData}
        //onRecordLap={recordLap}
      />
    </div>
  );
}

export default App;