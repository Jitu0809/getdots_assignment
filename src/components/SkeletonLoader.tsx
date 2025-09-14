import styles from '../assets/css/skeleton.module.css'

const SkeletonLoader = () => {
  return (
    <div className={styles.container}>
        <div className={`${styles.skeleton} ${styles.image}`}></div>
        <div className={styles.line_wrapper}>   
            <div className={`${styles.skeleton} ${styles.line} ${styles.long}`}></div>
            <div className={`${styles.skeleton} ${styles.line} ${styles.short}`}></div>
        </div>
    </div>
  )
}

export default SkeletonLoader
