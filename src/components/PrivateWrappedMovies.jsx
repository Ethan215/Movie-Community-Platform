import React from 'react';

export const Movies = ({ baseUrl, topFiveMovies }) => {

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
          {topFiveMovies.length > 0 && topFiveMovies[0]
            ? topFiveMovies.map((m, i) => (
                <div key={`${m.name}-${i}`} className="team">
                  <div className="thumbnail">
                    {" "}
                    <img src={`${baseUrl}${m.poster_path}`} alt="Movie poster" className="team-img" />
                    <div className="caption">
                      <h4>{m.title}</h4>
                      <p>{m.release_date.slice(0,4)}</p>
                      <p>{m.genres.map((genre) => genre.name).join(", ")}</p>
                    </div>
                  </div>
                </div>
              ))
            : <h4>Loading...</h4>}
        </div>
      </div>
    </div>
  );
};
