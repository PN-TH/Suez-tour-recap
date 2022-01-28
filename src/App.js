import React from "react";
import "./App.css";
import RecapTournee from "./components/RecapTournee";

function App() {
  React.useEffect(() => {
    document.title = "Airbus Data";
  }, []);
  return (
    <div className="App">
      <img
        style={{
          width: 100,
          height: 60,
          position: "absolute",
          top: 10,
          left: 10,
        }}
        src={process.env.PUBLIC_URL + "/LogoDAG.png"}
        alt="Dag System Logo"
      />
      <RecapTournee />
    </div>
  );
}

export default App;
