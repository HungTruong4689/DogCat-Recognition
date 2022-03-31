import "./TextView.css";
import React from "react";
const TextView = (props) => {
  return (
    <div className="textview">
      <div className="textview__container">
        <div className="textview__title">
          <p>Dog/Cat </p>
          <p>Recognition</p>
        </div>
        <span className="textview__description">
          This application was created for the purpose to detect the user's
          image. The goal of the detection is to detect whether cat or dog.
          Please input a image with one object by the "select image" button.
        </span>
      </div>
    </div>
  );
};

export default TextView;
