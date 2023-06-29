import React, { useState, useEffect } from "react";
import { SmallArrowIcon, CheckboxIcon } from '@logora/debate.icons';
import styles from "./Select.module.scss";
import { Dropdown } from '@logora/debate.tools.dropdown';
import cx from "classnames";

export const Select = (props) => {
	const [currentOption, setCurrentOption] = useState({});

	useEffect(() => {
		setCurrentOption(props.displayOptionValue ? props.options.filter(elm => elm.value == props.displayOptionValue)[0] : props.options[0]);
	}, []);

	useEffect(() => {
		if (props.resetSelect === true) {
			resetSelect();
		}
	}, [props.resetSelect])

	const resetSelect = () => {
		setCurrentOption(props.options[0]);
	}

	const handleSelectOption = (option) => {
		setCurrentOption(option);
		if (props.onChange) {
			props.onChange(option);
		}
	};

	const displayOption = (option) => {
		return (
			option.name != "" &&
			<div
				className={cx(styles.selectOption, { [styles.selectOptionActive]: (currentOption.name == option.name), [props.optionClassName]: props.optionClassName })}
				key={option.value}
				value={option.value}
				data-tid={option.dataTid && option.dataTid}
				onClick={() => handleSelectOption(option)}
			>
				{option.text}
				{currentOption.value == option.value && option.value != "" ? <CheckboxIcon className={styles.checkBox} width={16} height={16} />  : null}
			</div>
		);
	};
	
	return (
		<div className={styles.selectContainer}>
			<Dropdown closeOnContentClick={true}>
				<div className={props.selectClassName ? cx(styles.selectSelect, props.selectClassName) : styles.selectSelect}>
					<span className={styles.currentOptionText}>{currentOption.text}</span>{" "}
					<SmallArrowIcon className={styles.arrowDown} height={16} width={16} />
				</div>
				{ props.options.map(displayOption) }
			</Dropdown>
		</div>
	);
};
