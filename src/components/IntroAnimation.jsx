import React, { useEffect, useState, useRef } from 'react';

const IntroAnimation = ({ onComplete }) => {
  const [animationStep, setAnimationStep] = useState(0);
  const introContainerRef = useRef(null);

  const introWords = ["CREATIVE", "DYNAMIC", "ROLL0K", "EDITING"];

  useEffect(() => {
    let wordInterval = setInterval(() => {
      setAnimationStep(prev => {
        if (prev < introWords.length - 1) {
          return prev + 1;
        } else {
          clearInterval(wordInterval);
          setTimeout(() => setAnimationStep(4), 400);
          return prev;
        }
      });
    }, 450);

    const handleTransition = () => {
      setTimeout(() => {
        if (introContainerRef.current) {
          introContainerRef.current.style.opacity = '0';
          introContainerRef.current.style.transform = 'translateY(-100%)';
          introContainerRef.current.style.transition = 'opacity 0.8s ease-out, transform 1s ease-in-out';
        }

        setTimeout(() => {
          if (onComplete) onComplete();
        }, 1000);
      }, 500);
    };

    if (animationStep === 4) {
      handleTransition();
    }

    return () => clearInterval(wordInterval);
  }, [animationStep, onComplete, introWords.length]);

  const colors = {
    background: '#050505',
    textPrimary: '#ffffff',
    textAccent: '#00E5FF',
    textAmber: '#00E5FF'
  };

  return (
    <div
      ref={introContainerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: colors.background,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: colors.textPrimary,
        fontFamily: "'Montserrat', 'Helvetica Neue', sans-serif",
        overflow: 'hidden',
        pointerEvents: 'auto',
      }}
    >
      {animationStep < 4 && (
        <div style={{ textAlign: 'center', lineHeight: '1.1' }}>
          {introWords.map((word, index) => (
            <div
              key={index}
              style={{
                fontSize: 'clamp(3rem, 15vw, 9rem)',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                opacity: animationStep === index ? 1 : 0,
                transition: 'opacity 0.15s ease-in-out',
                color: word === "ROLL0K" ? colors.textAccent : colors.textPrimary,
                textShadow: word === "ROLL0K" ? `0 0 20px ${colors.textAccent}44` : 'none',
              }}
            >
              {word}
            </div>
          ))}
          <div style={{
            fontSize: '1rem',
            color: colors.textAmber,
            marginTop: '2rem',
            letterSpacing: '0.5em',
            opacity: animationStep > 0 ? 0.6 : 0,
            transition: 'opacity 0.5s ease'
          }}>
            ELAMUKIL KUMARESAN
          </div>
        </div>
      )}

      {animationStep === 4 && (
        <div style={{
          opacity: 0,
          animation: 'fadeInOut 1s ease forwards',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 8vw, 6rem)',
            fontWeight: 900,
            color: colors.textPrimary,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '1rem'
          }}>
            ROLL<span style={{color: colors.textAccent}}>0</span>K
          </h1>
          <p style={{
            fontSize: 'clamp(1rem, 3vw, 1.5rem)',
            color: colors.textAmber,
            fontWeight: 500,
            letterSpacing: '0.2em'
          }}>
            VIDEO EDITING SOLUTIONS
          </p>
        </div>
      )}

      <style>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
};

export default IntroAnimation;