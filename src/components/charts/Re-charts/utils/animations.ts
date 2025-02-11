// src/components/charts/utils/animations.ts
export const chartAnimations = {
    container: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5 }
    },
    
    item: {
      initial: { scale: 0 },
      animate: { scale: 1 },
      transition: { type: "spring", stiffness: 300, damping: 20 }
    },
    
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.2 }
    },
    
    slideLeft: {
      initial: { x: -20, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: 20, opacity: 0 },
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    
    slideRight: {
      initial: { x: 20, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: -20, opacity: 0 },
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    
    expand: {
      initial: { height: 0, opacity: 0 },
      animate: { height: "auto", opacity: 1 },
      exit: { height: 0, opacity: 0 },
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    
    bounce: {
      animate: {
        scale: [1, 1.1, 1],
        transition: {
          duration: 0.4,
          ease: "easeInOut",
          times: [0, 0.5, 1]
        }
      }
    },
    
    pulse: {
      animate: {
        scale: [1, 1.05, 1],
        transition: {
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse"
        }
      }
    },
  
    // Chart specific animations
    pieEnter: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      transition: { type: "spring", stiffness: 300, damping: 20 }
    },
  
    barEnter: {
      initial: { scaleY: 0 },
      animate: { scaleY: 1 },
      transition: { duration: 0.5, ease: "easeOut" }
    },
  
    lineEnter: {
      initial: { pathLength: 0 },
      animate: { pathLength: 1 },
      transition: { duration: 1.5, ease: "easeInOut" }
    },
  
    tooltipEnter: {
      initial: { opacity: 0, scale: 0.9, y: 10 },
      animate: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.9, y: 10 },
      transition: { duration: 0.2 }
    },
  
    legendEnter: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      transition: { duration: 0.3, staggerChildren: 0.1 }
    }
  };
  
