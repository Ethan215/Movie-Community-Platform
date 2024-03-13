import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const Movies = ({ baseUrl, topFiveMovies }) => {
  const lightsRef = useRef(null);
  const cameraRef = useRef(null);
  const actionRef = useRef(null);
  const { scrollYProgress: lightsProgress } = useScroll({
    target: lightsRef,
    offset: [1, 0.7]
  });
  const { scrollYProgress: cameraProgress  } = useScroll({
    target: cameraRef,
    offset: [1, 0.7]
  });
  const { scrollYProgress: actionProgress } = useScroll({
    target: actionRef,
    offset: [1, 0.7]
  });
  const lightsScale = useTransform(lightsProgress, [0, 1], [0, 1]);
  const lightsOpacity = useTransform(lightsProgress, [0, 1], [0, 1]);
  const cameraScale = useTransform(cameraProgress, [0, 1], [0, 1]);
  const cameraOpacity = useTransform(cameraProgress, [0, 1], [0, 1]);
  const actionScale = useTransform(actionProgress, [0, 1], [0, 1]);
  const actionOpacity = useTransform(actionProgress, [0, 1], [0, 1]);

  return (
    <div id="movies" className="text-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="top-movies-wrapper">
            <h2 className="top-movies sono-style">Top Movies</h2>
          </div>
        </div>

        <div id="lights-camera-action">
          <div className="row">
            <div className="col-2 offset-2">
              <motion.div
                className="thasadith-style"
                ref={lightsRef}
                style={{
                  scale: lightsScale,
                  opacity: lightsOpacity
                }}
              >
                Lights,
              </motion.div>
            </div>
          </div>
          <div className="row">
            <div className="col-2 offset-5">
            <motion.div
              className="aboreto-style"
              ref={cameraRef}
              style={{
                scale: cameraScale,
                opacity: cameraOpacity,
              }}
            >
              Camera,
            </motion.div>
            </div>
          </div>
          <div className="row">
            <div className="col-2 offset-8">
            <motion.div
                className="overpass-style"
                ref={actionRef}
                style={{
                  scale: actionScale,
                  opacity: actionOpacity
                }}
              >
                ACTION!!!
              </motion.div>
            </div>
          </div>
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
