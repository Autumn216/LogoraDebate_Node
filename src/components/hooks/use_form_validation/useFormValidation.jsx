import { useState } from 'react';
import { useIntl } from "react-intl";

export const useFormValidation = () => {
    const [errors, setErrors] = useState({});
    const intl = useIntl();

    const required = (formData, value) => {
        return !formData[value];
    }

    const checkMinLength = (value, minLength) => {
        return value.split(" ").length < minLength;
    }

    const checkMaxLength = (value, maxLength) => {
        return value.split(" ").length > maxLength;
    }

    const isQuestion = (value) => {
        return value.trim()[value.trim().length - 1] !== "?"
    }

    const validate = (formData, validationRules) => {
        let errors = {};
        validationRules.forEach(rule => {
            let validationField = Object.keys(rule)[0];
            let validationMethod = Object.values(rule)[0][0];
            let validationChecker = Object.values(rule)[0][1];

            if (validationMethod === "required") {
                if (required(formData, validationField)) {
                    errors[validationField] = intl.formatMessage({ id: `errors.${validationField}_required`, defaultMessage: `${validationField} can't be empty.` })
                }
            }
            if (validationMethod === "length") {
                if (checkMinLength(formData[validationField], validationChecker)) {
                    errors[validationField] = intl.formatMessage({ 
                        id: `errors.${validationField}_length`, 
                        defaultMessage: `${validationField} is too short. It must be at least ${validationChecker} long.` },
                        { variable: validationChecker })
                }
            }
            if (validationMethod === "maxLength") {
                if (checkMaxLength(formData[validationField], validationChecker)) {
                    errors[validationField] = intl.formatMessage({ 
                        id: `errors.${validationField}_max_length`, 
                        defaultMessage: `${validationField} is too long.` })
                }
            }
            if (validationMethod === "question") {
                if (isQuestion(formData[validationField])) {
                    errors[validationField] = intl.formatMessage({ id: `errors.${validationField}_question`, defaultMessage: `${validationField} must have a question mark at the end.` })
                }
            }
        })
        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return false; 
        } 
        setErrors({});
        return true;
    }

    return {
        errors,
        validate
    }
}