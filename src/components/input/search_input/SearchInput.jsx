import React, { useState, useRef, useEffect } from "react";
import { useResponsive } from "@logora/debate.hooks.use_responsive";
import { SearchIcon } from '@logora/debate.icons';
import { CloseIcon } from '@logora/debate.icons';
import { TextInput } from '@logora/debate.input.text_input';
import useOnClickOutside from 'use-onclickoutside';
import styles from "./SearchInput.module.scss";

export const SearchInput = (props) => {
	const [query, setQuery] = useState("");
	const [openSearch, setOpenSearch] = useState(false);
	const [isMobile, isTablet, isDesktop] = useResponsive();
	const searchRef = useRef(null);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (query) {
			props.onSearchSubmit(query);
		}
	};

	const handleReset = (e) => {
		e.preventDefault();
		setQuery("");
		props.onSearchSubmit();
	};

	if(isMobile) {
		useOnClickOutside(searchRef, () => setOpenSearch(false));
	}

	return (
		!isMobile || openSearch ? 
			(
				<form data-tid={"form_search"} onSubmit={handleSubmit} method='get' autoComplete='off' ref={searchRef}>
					<TextInput
						type={"text"}
						name={"q"}
						role={"input"}
						value={query}
						placeholder={props.placeholder}
						disabled={props.disabled}
						onChange={e => setQuery(e.target.value)}
						data-testid={"input_search_query"}
						data-tid={"input_search_query"}
						icon={query ? <CloseIcon className={styles.searchReset} role="submit" data-tid={"action_search_reset"} height={16} width={16} onClick={(e) => handleReset(e)} /> : <SearchIcon className={styles.searchSubmit} role="submit" data-tid={"action_search_submit"} height={16} width={16} onClick={(e) => handleSubmit(e)} />}
					/>
				</form>	
			) 
		:
			(
				<div className={styles.searchMobileButton} onClick={() => setOpenSearch(true)}>
					<SearchIcon className={styles.searchSubmit} data-tid={"action_search_submit"} height={16} width={16} />
				</div>
			)
	)
}