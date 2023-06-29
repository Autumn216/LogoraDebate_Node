import React from 'react';
import { SearchInput } from './SearchInput';
import { Context as ResponsiveContext} from "react-responsive";

export const DefaultSearchInput = () => {
    return (
        <SearchInput onSearchSubmit={() => alert("SearchInput callback")} placeholder={"Search"} />
    )
};

export const SearchInputMobile = () => {
    return (
        <ResponsiveContext.Provider value={{ deviceWidth: 400 }}>
            <SearchInput onSearchSubmit={() => alert("SearchInput callback")}  placeholder={"Search"} />
        </ResponsiveContext.Provider>
    )
};

export const DisabledSearchInput = () => {
    return (
        <SearchInput onSearchSubmit={() => alert("SearchInput callback")} placeholder={"Search"} disabled={true} />
    )
};