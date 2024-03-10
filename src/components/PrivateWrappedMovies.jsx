import React from "react";

export const Movies = (props) => {
  return (
    <div id="movies" className="text-center">
      <div className="container">
        <div className="section-title">
          <h2>Top Movies</h2>
          <p>
            Lights, Camera, ACTION!!! Let's get your top films rollin'
          </p>
        </div>
        <div id="row">
          {props.data
            ? props.data.map((d, i) => (
                <div key={`${d.name}-${i}`} className="team">
                  <div className="thumbnail">
                    {" "}
                    <img src={d.img} alt="..." className="team-img" />
                    <div className="caption">
                      <h4>{d.name}</h4>
                      <p>{d.job}</p>
                    </div>
                  </div>
                </div>
              ))
            : "loading"}
        </div>
      </div>
    </div>
  );
};
