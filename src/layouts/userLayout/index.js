import React from 'react';
import logo from '../../assets/logo.svg';
import styles from './style.less'

const UserLayout = ({ children }) => {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.top}>
                    <div className={styles.header}>
                        {/* <Link to="/"> */}
                            {/* <img alt="logo" className={styles.logo} src={logo} /> */}
                            <span className={styles.title}>数字酒品牌管理端</span>
                        {/* </Link> */}
                    </div>
                    {/* <div className={styles.desc}>打造全宇宙领先的一站式屏幕管理运行后台系统</div> */}
                </div>
                { children }
            </div>
            {/* <DefaultFooter /> */}
        </div>
    )
}

export default UserLayout