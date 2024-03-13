import React from "react";
import { motion } from 'framer-motion';

export const Header = (props) => {
  return (
    <header id="header" className="mb-5">
      <div className="circle-container">
        <motion.div
          className="circle"
          initial={{ scale: 0.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, type: "spring", stiffness: 75 }}
        >
          <h1 className="text-center sono-style">
            Your Private Wrapped
          </h1>
          <p className="text-center sono-style">See what your Top Movies and shows are!</p>
        </motion.div>
      </div>
    </header>
  );
};
