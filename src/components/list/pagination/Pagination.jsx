import React, { useState, useEffect } from 'react';
import { Loader } from '@logora/debate.tools.loader';
import { Button } from '@logora/debate.action.button';
import styles from './Pagination.module.scss';

export const Pagination = props => {
    const [hasNextPage, setHasNextPage] = useState((props.currentPage * props.perPage) < props.totalElements)

    useEffect(() => {
        if (props.totalElements > 0) {
            setHasNextPage((props.currentPage * props.perPage) < props.totalElements);
        }
    }, [props.totalElements, props.currentPage])
    
    return (
        <div className={styles.paginationBox}>
            { hasNextPage ? (
                <>
                    { !props.isLoadingMoreElements ? (
                        <Button 
                            data-tid={props["data-tid"] ? props["data-tid"] : "action_view_more"} 
                            className={styles.paginationButton} 
                            handleClick={props.onLoadMoreElements} 
                        >
                            { props.showMoreText }
                        </Button>
                    ) : (
                        props.hasLoadingComponent ?
                            null
                        :
                            <Loader />
                    )}
                </>
            ) : null}
        </div>
    );
}
