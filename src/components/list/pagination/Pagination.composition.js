import React from 'react';
import { Pagination } from './Pagination';

export const DefaultPagination = () => {
    return <Pagination showMoreText={"Next page"} currentPage={1} perPage={10} totalElements={20} hasLoadingComponent={false} />;
};

export const LoadingElementsPagination = () => {
    return <Pagination showMoreText={"Next page"} currentPage={1} perPage={10} totalElements={20} hasLoadingComponent={false} isLoadingMoreElements={true} />;
};