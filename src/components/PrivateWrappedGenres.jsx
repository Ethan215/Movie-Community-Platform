import React from "react";

export const Genres = (props) => {
  return (
    <div id="genres" className="text-center">
      <div className="container">
        <div className="section-title">
          <h2>Top Genres</h2>
        </div>
        <div className="row">
          {props.data
            ? props.data.map((d, i) => (
                <div key={`${d.title}-${i}`} className="col-md-4">
                  {" "}
                  <img src={d.img} alt={d.title} className="feature-img" />
                  <h3>{d.title}</h3>
                  <p>{d.text}</p>
                </div>
              ))
            : "Loading..."}
        </div>
      </div>
    </div>
  );
};
