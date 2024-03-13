import React from "react";

export const About = ({data, baseUrl, topGenre, topThreeMovies}) => {
  const topMovie = topThreeMovies[0];

  return (
      <div className="container" id="summary">
        <div className="row" id="summary-row">
          <div className="col-12 col-md-5 offset-md-1">
            <img src={`${baseUrl}${topMovie?.poster_path}`} className="summary-image" alt="N/A"/>
          </div>
          <div className="col-12 col-md-5">
            <div className="summary-card">
              <h2 className="sono-style">Wrapped Summary</h2>
              <p>{data ? data.paragraph : "loading..."}</p>
              <h3 className="sono-style">Top 3 Movies:</h3>
              <ul className="mb-4">
                {topThreeMovies.length > 0
                  ? topThreeMovies?.map((movie, i) => (
                      <li key={`${movie}-${i}`}>{movie?.title}</li>
                    ))
                  : "loading"}
              </ul>
              <h3 className="sono-style">Top Genre: {topGenre}</h3>
            </div>
          </div>
        </div>
      </div>

  );
};
