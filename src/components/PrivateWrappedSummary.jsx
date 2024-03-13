import React from "react";

export const About = ({data, baseUrl, topGenre, topThreeMovies}) => {
  const topMovie = topThreeMovies[0];

  return (
    <div id="about">
      <div className="container">
        <div className="row mb-5">
          <div className="col-xs-12 col-md-6">
            <img src={`${baseUrl}${topMovie?.poster_path}`} className="summary-image" alt="N/A"/>
          </div>
          <div className="col-xs-12 col-md-6">
            <div className="about-text">

              <h2 className="sono-style">Wrapped Summary</h2>
              <p>{data ? data.paragraph : "loading..."}</p>
              <h3 className="sono-style">Top 3 Movies:</h3>
              <div className="list-style">
                <div className="col-lg-6 col-sm-6 col-xs-12">
                  <ul>
                    {topThreeMovies.length > 0
                      ? topThreeMovies?.map((movie, i) => (
                          <li key={`${movie}-${i}`}>{movie?.title}</li>
                        ))
                      : "loading"}
                  </ul>
                </div>
              </div>
              <h3 className="sono-style">Top Genre: {topGenre}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
