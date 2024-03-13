import React from "react";

export const About = ({data, baseUrl, topGenre, topThreeMovies}) => {
  const topMovie = topThreeMovies[0];

  return (
    <div id="about">
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-6">
            <img src={`${baseUrl}${topMovie?.poster_path}`} className="img-responsive" alt="" />
          </div>
          <div className="col-xs-12 col-md-6">
            <div className="about-text">

              <h2>User Summary</h2>
              <p>{data ? data.paragraph : "loading..."}</p>
              <h3>User Info</h3>
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
              <h3>Top Genre: {topGenre}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
