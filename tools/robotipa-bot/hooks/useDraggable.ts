// "use client";
// import { useEffect } from "react";

// const useDraggable = (
//   ref: React.RefObject<HTMLElement | null>,
//   onPositionChange?: (pos: { x: number; y: number }) => void
// ) => {
//   useEffect(() => {
//     if (!ref.current) return;

//     let isDragging = false;
//     let initialX = 0;
//     let initialY = 0;
//     let offsetX = 0;
//     let offsetY = 0;

//     const element = ref.current;
//     // Forzamos posicionamiento fixed para que se mueva en toda la página
//     element.style.position = "fixed";

//     const handleMouseDown = (e: MouseEvent) => {
//         console.log("mousedown", e.clientX, e.clientY);
//         isDragging = true;
//         initialX = e.clientX;
//         initialY = e.clientY;
//         const rect = element.getBoundingClientRect();
//         offsetX = rect.left;
//         offsetY = rect.top;
//         document.addEventListener("mousemove", handleMouseMove);
//         document.addEventListener("mouseup", handleMouseUp);
//       };
      
//       const handleMouseMove = (e: MouseEvent) => {
//         if (!isDragging) return;
//         const dx = e.clientX - initialX;
//         const dy = e.clientY - initialY;
//         const newX = offsetX + dx;
//         const newY = offsetY + dy;
//         console.log("mousemove", newX, newY);
//         element.style.left = `${newX}px`;
//         element.style.top = `${newY}px`;
//         if (onPositionChange) onPositionChange({ x: newX, y: newY });
//       };
      
//       const handleMouseUp = () => {
//         console.log("mouseup");
//         isDragging = false;
//         document.removeEventListener("mousemove", handleMouseMove);
//         document.removeEventListener("mouseup", handleMouseUp);
//       };
      

//     // Soporte para dispositivos táctiles
//     const handleTouchStart = (e: TouchEvent) => {
//       e.preventDefault();
//       isDragging = true;
//       initialX = e.touches[0].clientX;
//       initialY = e.touches[0].clientY;
//       const rect = element.getBoundingClientRect();
//       offsetX = rect.left;
//       offsetY = rect.top;
//       document.addEventListener("touchmove", handleTouchMove);
//       document.addEventListener("touchend", handleTouchEnd);
//     };

//     const handleTouchMove = (e: TouchEvent) => {
//       if (!isDragging) return;
//       const dx = e.touches[0].clientX - initialX;
//       const dy = e.touches[0].clientY - initialY;
//       const newX = offsetX + dx;
//       const newY = offsetY + dy;
//       element.style.left = `${newX}px`;
//       element.style.top = `${newY}px`;
//       if (onPositionChange) onPositionChange({ x: newX, y: newY });
//     };

//     const handleTouchEnd = () => {
//       isDragging = false;
//       document.removeEventListener("touchmove", handleTouchMove);
//       document.removeEventListener("touchend", handleTouchEnd);
//     };

//     element.addEventListener("mousedown", handleMouseDown);
//     element.addEventListener("touchstart", handleTouchStart);

//     return () => {
//       element.removeEventListener("mousedown", handleMouseDown);
//       element.removeEventListener("touchstart", handleTouchStart);
//       document.removeEventListener("mousemove", handleMouseMove);
//       document.removeEventListener("mouseup", handleMouseUp);
//       document.removeEventListener("touchmove", handleTouchMove);
//       document.removeEventListener("touchend", handleTouchEnd);
//     };
//   }, [ref, onPositionChange]);
// };

// export default useDraggable;
