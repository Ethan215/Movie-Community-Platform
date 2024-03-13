import React from 'react';

export const Genres = ({ topThreeGenres }) => {

  return (
    <div id="genres" className="text-center">
      <div className="container">
        <div className="section-title">
          <h2 className="mb-5 sono-style">Top Genres</h2>
        </div>

        <div className="genre-grid">
          {topThreeGenres.length > 0 ? (
            topThreeGenres?.map((genre, i) => (
              <div key={`${genre[0]}-${i}`} className="genre-card">
                <h3>{genre[0]}</h3>
                <p className="mb-0 sono-style">{genre[1]} movies</p>
              </div>
            ))
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
};
