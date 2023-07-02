import React from "react";
import Grid from "./components/Grid";
import { getInitialTiles, getWalls } from "./functions";
import StateDisplay from "./components/StateDisplay";
import Hub from "./components/Hub";

function App() {
  console.log(getWalls());
  return (
    <div
      style={{
        backgroundColor: "burlywood",
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      }}
    >
      <Hub />
    </div>
  );
}

export default App;
