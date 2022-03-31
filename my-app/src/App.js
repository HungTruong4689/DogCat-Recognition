import "./App.css";
import styled from "styled-components";
import { ObjectDetector } from "./objectdetector";
import React from "react";
const AppContainer = styled.div`
  padding-bottom: 14px;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(to right, #ece9e6, #fff);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
`;

function App() {
  return (
    <AppContainer>
      <ObjectDetector />
    </AppContainer>
  );
}

export default App;
