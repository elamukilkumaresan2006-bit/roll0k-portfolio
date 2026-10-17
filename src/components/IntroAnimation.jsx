import React, { useEffect, useState, useRef } from 'react';

// Optimized High-Impact Intro for Video Editing Portfolio
// This focuses on bold text (rollok), visual energy, and a clean dark theme.
const IntroAnimation = ({ onComplete }) => {
  const [animationStep, setAnimationStep] = useState(0);
  const introContainerRef = useRef(null);
  
  // Custom text for the intro sequence - fast paced like video titles
  const introWords = ["CREATIVE", "DYNAMIC", "ROLL0K", "EDITING"];
  
  useEffect(() => {
    // 1. First flash sequence (Word montage)
    let wordInterval = setInterval(() => {
      setAnimationStep(prev => {
        if (prev < introWords.length - 1) {
          return prev + 1;
        } else {
          // Finish words, move to final reveal
          clearInterval(wordInterval);
          setTimeout(() => setAnimationStep(4), 400); // Short pause before reveal
          return prev; // Stay on the last word briefly
        }
      });
    }, 450); // Speed of word flashing (faster is more energetic)

    // 2. Main transition logic
    const handleTransition = () => {
      // 400ms buffer after the word montage to ensure last word is seen
      setTimeout(() => {
        // Trigger the exit animation (e.g., fade out and slide up)
        if (introContainerRef.current) {
          introContainerRef.