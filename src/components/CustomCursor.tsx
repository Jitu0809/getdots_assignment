import { useEffect, useRef } from 'react'
import styles from '../assets/css/custom-cursor.module.css'

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    const moveCursor = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };

    document.addEventListener("mousemove", moveCursor);
    return () => {
      document.removeEventListener("mousemove", moveCursor);
    };
  })

  return (
    <div ref={cursorRef} className={styles.custom_cursor}></div>
  )
}

export default CustomCursor
