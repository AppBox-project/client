import React from "react"
import styles from './styles.module.scss'

const Picture: React.FC<{ image: string; size?: "small" | "medium" | "large", withShadow?: boolean; shadowRadius?: number, className?: string }> = ({ size, withShadow, image, shadowRadius, className }) => {
    return <div className={`${size === "small" ? styles.small : size === "large" ? styles.large : styles.medium}${className ? ` ${className}` : ''}`}><div className={`${styles.picture} ${withShadow && styles.withShadow}`} style={{ backgroundImage: `url(${image || 'https://picsum.photos/seed/13/300/400'})` }} /></div>
}

export default Picture;