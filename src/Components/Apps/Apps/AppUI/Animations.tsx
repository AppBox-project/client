import React from "react";
import { motion } from "framer-motion";

const list = {
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.15,
      delay: 0.1,
      when: "beforeChildren",
      staggerChildren: 0.08,
      ease: "easeOut",
    },
  },
  hidden: {
    opacity: 0,
    x: -10,
    transition: {
      when: "afterChildren",
    },
  },
};
const item = {
  visible: { opacity: 1, y: 0 },
  hidden: { opacity: 0, y: 10 },
};

const AnimationContainer: React.FC<{ children: any }> = ({ children }) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={list}
      style={{ height: "100%" }}
    >
      {children}
    </motion.div>
  );
};

const AnimationItem: React.FC<{ children: any }> = ({ children }) => {
  return (
    <motion.div variants={item} style={{ width: "100%" }}>
      {children}
    </motion.div>
  );
};

export { AnimationItem, AnimationContainer };
