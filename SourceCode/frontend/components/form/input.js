import { DatePicker, Form } from 'antd';
import { useI18n } from '../../app/providers/i18n';
import { useState, useEffect } from 'react';
import { IoEye, IoEyeOff } from 'react-icons/io5';

const FormInput = ({
    label, name, rows, placeholder, required, isEmail, initialValue, rules = [], textArea, type, readOnly, onChange, onBlur, form
}) => {
    const i18n = useI18n();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [inputValue, setInputValue] = useState(initialValue || '');
    const nameValue = name ? String(name) : undefined;
    const autoCompleteValue = type === 'password'
        ? (nameValue && (nameValue.toLowerCase().includes('new') || nameValue.toLowerCase().includes('confirm')) ? 'new-password' : 'current-password')
        : (isEmail ? 'email' : (nameValue || 'off'));

    useEffect(() => {
        setInputValue(initialValue);
    }, [initialValue]);

    let initRules = [
        { required: required },
    ];

    if (isEmail) {
        initRules.push({ type: 'email', message: `${i18n?.t(`Please enter a valid email address`)}` });
    }

    const handlePasswordChange = (e) => {
        setInputValue(e.target.value);
        if (onChange) onChange(e);
    };

    const handleBlur = (e) => {
        if (onBlur) onBlur(e);
    };

    let input;
    if (textArea) {
        input = (
            <textarea
                name={nameValue}
                placeholder={i18n?.t(placeholder)}
                className="form-input"
                rows={rows}
                autoComplete={autoCompleteValue}
            />
        );
    } else if (type === 'date') {
        input = <DatePicker />;
    } else if (type === 'password') {
        input = (
            <div className="relative">
                <input
                    className="form-input pr-10"
                    type={passwordVisible ? 'text' : 'password'}
                    name={nameValue}
                    value={inputValue}
                    onChange={handlePasswordChange}
                    onBlur={handleBlur}
                    placeholder={i18n?.t(placeholder)}
                    readOnly={readOnly}
                    autoComplete={autoCompleteValue}
                />
                <button
                    type="button"
                    aria-label={passwordVisible ? (i18n?.t('Hide password') || 'Hide password') : (i18n?.t('Show password') || 'Show password')}
                    aria-pressed={passwordVisible}
                    className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                >
                    {passwordVisible ? <IoEye className='text-white text-lg' /> : <IoEyeOff className='text-white text-lg' />}
                </button>
            </div>
        );
    } else {
        input = (
            <input
                className="form-input"
                type={type}
                name={nameValue}
                value={inputValue}
                onChange={(e) => {
                    setInputValue(e.target.value);
                    if (onChange) onChange(e);
                }}
                onBlur={handleBlur}
                placeholder={i18n?.t(placeholder)}
                readOnly={readOnly}
                autoComplete={autoCompleteValue}
            />
        );
    }

    return (
        <Form.Item
            name={name}
            label={i18n?.t(label)}
            rules={[...initRules, ...rules]}
            className="mb-4"
        >
            {input}
        </Form.Item>
    );
};

export default FormInput;
export const HiddenInput = ({ name, initialValue }) => {
    return (
        <Form.Item
            name={name}
            initialValue={initialValue || ''}
            hidden
        >
            <input className="form-input" autoComplete="off" />
        </Form.Item>
    );
};
