import React from 'react';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

export const ParticlesBackground: React.FC = () => {
  const particlesInit = React.useCallback(async (engine: any) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      className="absolute inset-0 pointer-events-none"
      options={{
        fullScreen: { enable: false },
        background: {
          color: { value: "transparent" },
        },
        fpsLimit: 60,
        interactivity: {
          events: {
            onClick: { enable: true, mode: "push" },
            onHover: { enable: true, mode: "repulse" },
            resize: true
          },
          modes: {
            push: { quantity: 4 },
            repulse: { distance: 100, duration: 0.4 }
          }
        },
        particles: {
          color: { value: "#ffffff" },
          links: {
            color: "#ffffff",
            distance: 150,
            enable: true,
            opacity: 0.3,
            width: 1
          },
          move: {
            direction: "none",
            enable: true,
            outModes: { default: "bounce" },
            random: false,
            speed: 1,
            straight: false
          },
          number: {
            density: { enable: true, area: 800 },
            value: 60
          },
          opacity: { value: 0.4 },
          shape: { type: "circle" },
          size: { value: { min: 1, max: 3 } }
        },
        detectRetina: true
      }}
    />
  );
};
