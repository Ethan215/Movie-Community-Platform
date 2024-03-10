import React from "react";

export const Shows = (props) => {
  return (
    <div id="shows" className="text-center">
      <div className="container">
        <div className="section-title">
          <h2>Top Shows</h2>
          <p>
            You are show-stopping with the shows you watched!
          </p>
        </div>
        <div className="row">
          {props.data
            ? props.data.map((d, i) => (
                <div key={`${d.name}-${i}`} className="col-md-4">
                  {" "}
                  <img src={d.img} alt={d.name} className="service-img" />
                  <div className="service-desc">
                    <h3>{d.name}</h3>
                    <p>{d.text}</p>
                  </div>
                </div>
              ))
            : "loading"}
        </div>
      </div>
    </div>
  );
};
