import React, { useRef, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import "./index.css";
import TextView from "./TextView";
const ObjectDetectorContainer = styled.div`
  display: flex;
  width: 780px;
  height: 100%;
  align-items: center;
  background-color: transparent;
`;

const DetectorContainer = styled.div`
  min-width: 300px;
  height: 280px;
  border: 3px solid #243b55;
  border-radius: 3px;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const SelectButton = styled.button`
  margin-top: 14px;
  padding: 7px 10px;
  border: none;
  background-image: linear-gradient(to right, #f7971e, #ffd200);
  color: #0a0f22;
  font-size: 16px;
  font-weight: 500;
  outline: none;
  cursor: pointer;
  transition: all 260ms ease-in-out;
  border-radius: 3px;
  opacity: 0.8;
  &:hover {
    opacity: 1;
  }
`;

export function ObjectDetector() {
  const fileInputRef = useRef();
  //   const imageRef = useRef();
  const [imgData, setImgData] = useState(null);
  const [predictions, setPredictions] = useState();
  //const [isLoading, setLoading] = useState(false);
  const [score, setscore] = useState(0);
  //const isEmptyPredictions = !predictions || predictions.length === 0;
  //console.log(predictions);
  const openFilePicker = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  async function detectObjectsOnImage(img) {
    let formData = new FormData();
    formData.append("file", img); //append the values with key, value pair
    //formData.append("age", 20);

    const config = {
      headers: { "content-type": "multipart/form-data" },
    };
    const url = "https://sheltered-fortress-19231.herokuapp.com/loadimage";
    await axios
      .post(url, formData, config)
      .then((response) => {
        //const data = response.json();

        console.log(response.data.prediction);
        console.log(response.data.score);
        setPredictions(response.data.prediction);
        setscore(response.data.score);
      })
      .catch((error) => {
        console.log(error);
      });
    // const response = await fetch("http://127.0.0.1:5000/loadimage", {
    //   method: "POST",
    //   body: JSON.stringify(img),
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });
    // const data = await response.json();
    // console.log(data);
  }

  const readImage = (file) => {
    return new Promise((rs, rj) => {
      const fileReader = new FileReader();
      fileReader.onload = () => rs(fileReader.result);
      fileReader.onerror = () => rj(fileReader.error);
      fileReader.readAsDataURL(file);
    });
  };

  const onSelectImage = async (e) => {
    //   setPredictions([]);
    //   setLoading(true);

    const file = e.target.files[0];
    const imgData = await readImage(file);
    setImgData(imgData);
    //await detectObjectsOnImage(imgData);
    const imageElement = document.createElement("img");
    imageElement.src = imgData;
    //await detectObjectsOnImage(imgData);
    imageElement.onload = async () => {
      //   const imgSize = {

      //     width: imageElement.width,
      //     height: imageElement.height,
      //   };
      //console.log(imageElement);
      //console.log(imgData);
      await detectObjectsOnImage(imgData);
      //console.log(predictions);
      //setLoading(false);
    };
  };
  //console.log(predictions);
  return (
    <>
      <TextView prediction={predictions} score={score} />
      <ObjectDetectorContainer>
        <div className="detector-wrap">
          <DetectorContainer>
            {imgData && <img src={imgData} className="resize" />}
          </DetectorContainer>
          <HiddenFileInput
            type="file"
            ref={fileInputRef}
            onChange={onSelectImage}
          />
          <SelectButton onClick={openFilePicker}>Select Image</SelectButton>
        </div>
        <div className="detector-info">
          <div className="prediction">
            <h2 className="prediction_title">Prediction:</h2>
            <div className="prediction_result">{predictions}</div>
          </div>
          <div className="prediction">
            <h2 className="prediction_title">Score: </h2>
            <div className="prediction_result">
              {(score * 100).toFixed(2)} %
            </div>
          </div>
        </div>
      </ObjectDetectorContainer>
    </>
  );
}
