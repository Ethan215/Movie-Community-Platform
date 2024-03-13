import React from 'react';

export const Genres = ({ topThreeGenres }) => {

  return (
    <div id="genres" className="text-center">
      <div className="container">
        <div className="section-title">
          <h2>Top Genres</h2>
        </div>
        <div className="row">
          {topThreeGenres.length > 0 ? (
            topThreeGenres?.map((genre, i) => (
              <div key={`${genre[0]}-${i}`} className="col-md-4">
                <h3>{genre[0]}</h3>
                <p>Count: {genre[1]}</p>
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
