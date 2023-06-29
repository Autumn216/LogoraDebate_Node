import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Pagination } from './Pagination';

const callback = jest.fn();

it('should render with the correct text', () => {
	const pagination = render(
        <Pagination 
            showMoreText={"Voir plus"} 
            currentPage={1} 
            perPage={10} 
            totalElements={20} 
            hasLoadingComponent={false} 
            isLoadingMoreElements={false} 
            onLoadMoreElements={callback} 
        />
    );
	const renderedPagination = pagination.getByText(/Voir plus/i);
	expect(renderedPagination).toBeTruthy();
});

it('should render loader when isLoadingMoreElements prop is true', () => {
	const pagination = render(
        <Pagination 
            showMoreText={"Voir plus"} 
            currentPage={1} 
            perPage={10} 
            totalElements={30} 
            hasLoadingComponent={false} 
            isLoadingMoreElements={true}
            onLoadMoreElements={callback} 
        />
    );
	expect(screen.getByRole("status")).toBeTruthy()
});

it('should call onLoadMoreElements when clicked', () => {
    const pagination = render(
        <Pagination 
            showMoreText={"Voir plus"} 
            currentPage={1} 
            perPage={10} 
            totalElements={20} 
            hasLoadingComponent={false} 
            isLoadingMoreElements={false} 
            onLoadMoreElements={callback} 
        />
    );
	const renderedPagination = pagination.getByText(/Voir plus/i);
	fireEvent.click(renderedPagination);
	expect(callback).toHaveBeenCalled();
});

it('should break if showMoreText isn\'t passed', () => {
    const pagination = render(
        <Pagination 
            currentPage={1} 
            perPage={10} 
            totalElements={20} 
            hasLoadingComponent={false} 
            isLoadingMoreElements={false} 
            onLoadMoreElements={callback} 
        />
    );
	const renderedPagination = pagination.queryByText(/Voir plus/i);
	expect(renderedPagination).toBeFalsy();
});

