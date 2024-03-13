
import React from 'react';

export const Movies = ({ baseUrl, topFiveMovies }) => {

  return (
    <div id="movies" className="text-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="top-movies-wrapper">
            <h2 className="top-movies sono-style">Top Movies</h2>
          </div>
        </div>
          <div className="top-movies-subheader">
            <span id="lights" className="thasadith-style">Lights,</span> <span id="camera" className="aboreto-style">Camera,</span> <span id="action" className="overpass-style">ACTION!!!</span>
          </div>
        <div id="row">
          {topFiveMovies.length > 0 && topFiveMovies[0]
            ? topFiveMovies.map((m, i) => (
                <div key={`${m.name}-${i}`} className="movie-wrapper">
                  <h3 className="movie-title sono-style">{m.title} ({m.release_date.slice(0,4)})</h3>
                  <p className="movie-genres">{m.genres.map((genre) => genre.name).join(", ")}</p>
                  <div className="poster-wrapper">
                    <div className="poster-circle"></div>
                    <img src={`${baseUrl}${m.poster_path}`} className="poster" alt="N/A" />
                  </div>
                </div>
              ))
            : <h4>Loading...</h4>}
        </div>
      </div>
    </div>
  );
};
