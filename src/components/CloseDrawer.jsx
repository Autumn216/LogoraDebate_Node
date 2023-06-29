import React, { useState, useEffect } from 'react';
import styles from './CloseDrawer.module.scss';
import 'react-modern-drawer/dist/index.css';
import Drawer from 'react-modern-drawer';
import cx from 'classnames';
import { MobileCloseIcon } from '@logora/debate.icons';

const CloseDrawer = (props) => {
    const [isOpen, setIsOpen] = useState(props.isOpen);
    const closeDrawer = () => {
        setIsOpen(false)
    }

    useEffect(() => {
        setIsOpen(true)
	}, [props.isOpen])

    return (
        <>
            <div onClick={()=>closeDrawer()} className={cx(styles.closeDrawer, {[styles.hideButton]: !isOpen})}>
                <MobileCloseIcon width={30} height={30} />
            </div>
            <Drawer open={isOpen} onClose={() => closeDrawer()} direction='right' enableOverlay={false} className={styles.drawer}>
                {props.children}
            </Drawer>
        </>
    )
}

export default CloseDrawer