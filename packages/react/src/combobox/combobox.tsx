import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { ChangeEvent, ComponentPropsWithoutRef, KeyboardEvent, ReactNode } from 'react';

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

type ComboboxBaseProps = Omit<
  ComponentPropsWithoutRef<'input'>,
  'type' | 'role' | 'size' | 'value' | 'defaultValue' | 'onChange'
> & {
  /** Available options. Replace this list when async search results arrive. */
  options: ComboboxOption[];
  /** Input text, when controlled. */
  inputValue?: string;
  /** Initial input text when no selected value is provided. */
  defaultInputValue?: string;
  onInputValueChange?: (value: string) => void;
  /** Announce a pending asynchronous option request. */
  loading?: boolean;
  /** Message shown when there are no matching options. */
  emptyMessage?: ReactNode;
  /** Require a committed option value, not just arbitrary query text. */
  required?: boolean;
  /** Form field name; submits selected option value(s). */
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  invalid?: boolean;
  onChange?: ComponentPropsWithoutRef<'input'>['onChange'];
};

export type ComboboxProps = ComboboxBaseProps & (
  | {
      /** Keep false or omit for single selection. */
      multiple?: false;
      /** Selected option value; provide with onValueChange for controlled usage. */
      value?: string;
      /** Initial selected option value for uncontrolled usage. */
      defaultValue?: string;
      onValueChange?: (value: string) => void;
    }
  | {
      /** Enable multiple selection, chips, and repeated form values. */
      multiple: true;
      /** Selected option values; provide with onValueChange for controlled usage. */
      value?: string[];
      /** Initial selected option values for uncontrolled usage. */
      defaultValue?: string[];
      onValueChange?: (value: string[]) => void;
    }
);

export function Combobox(props: ComboboxProps) {
  const {
    options,
    inputValue: controlledInputValue,
    defaultInputValue = '',
    onInputValueChange,
    loading = false,
    emptyMessage = 'No options found.',
    size = 'md',
    invalid,
    disabled,
    name,
    required,
    id: suppliedId,
    className,
    onChange,
    onFocus,
    onBlur,
    onKeyDown,
    'aria-invalid': ariaInvalid,
    multiple: multipleProp,
    value: controlledValue,
    defaultValue,
    onValueChange,
    ...inputProps
  } = props;
  const multiple = multipleProp === true;
  const generatedId = useId();
  const listboxId = `${suppliedId ?? generatedId}-listbox`;
  const initialSelectedValue = multipleProp === true
    ? ''
    : typeof controlledValue === 'string'
      ? controlledValue
      : typeof defaultValue === 'string'
        ? defaultValue
        : '';
  const [uncontrolledValue, setUncontrolledValue] = useState(
    multipleProp === true ? '' : typeof defaultValue === 'string' ? defaultValue : '',
  );
  const [uncontrolledValues, setUncontrolledValues] = useState(
    multipleProp === true && Array.isArray(defaultValue) ? defaultValue : [],
  );
  const [uncontrolledInputValue, setUncontrolledInputValue] = useState(
    defaultInputValue || options.find(option => option.value === initialSelectedValue)?.label || '',
  );
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const expanded = open && !disabled;
  const selectedValue = multiple
    ? undefined
    : typeof controlledValue === 'string'
      ? controlledValue
      : uncontrolledValue;
  const selectedValues = multiple
    ? (Array.isArray(controlledValue) ? controlledValue : uncontrolledValues)
    : selectedValue
      ? [selectedValue]
      : [];
  const selectedOption = selectedValue
    ? options.find(option => option.value === selectedValue)
    : undefined;
  const inputValue = controlledInputValue ?? uncontrolledInputValue;
  const selectedOptions = multiple
    ? selectedValues.flatMap(value => {
        const option = options.find(item => item.value === value);
        return option ? [option] : [];
      })
    : [];
  const filteredOptions = useMemo(() => {
    const query = inputValue.trim().toLocaleLowerCase();
    return query
      ? options.filter(option => option.label.toLocaleLowerCase().includes(query))
      : options;
  }, [inputValue, options]);
  const enabledIndexes = filteredOptions.flatMap((option, index) => option.disabled ? [] : [index]);
  const activeOption = activeIndex >= 0 ? filteredOptions[activeIndex] : undefined;
  const activeOptionId = activeOption && expanded && !loading
    ? `${listboxId}-option-${activeIndex}`
    : undefined;

  useEffect(() => {
    inputRef.current?.setCustomValidity(
      required && selectedValues.length === 0
        ? 'Select an option from the list.'
        : '',
    );
  }, [required, selectedValues]);

  useEffect(() => {
    if (disabled) {
      setOpen(false);
      setActiveIndex(-1);
    }
  }, [disabled]);

  function updateInput(nextValue: string, event: ChangeEvent<HTMLInputElement>) {
    if (controlledInputValue === undefined) setUncontrolledInputValue(nextValue);
    onInputValueChange?.(nextValue);
    if (!multiple && selectedValue && nextValue !== selectedOption?.label) {
      if (controlledValue === undefined) setUncontrolledValue('');
      updateSingleValue('');
    }
    onChange?.(event);
    setOpen(true);
    setActiveIndex(-1);
  }

  function updateSelectedValues(nextValues: string[]) {
    if (props.multiple === true) {
      if (controlledValue === undefined) setUncontrolledValues(nextValues);
      props.onValueChange?.(nextValues);
    }
  }

  function updateSingleValue(nextValue: string) {
    if (props.multiple === true) return;
    props.onValueChange?.(nextValue);
  }

  function selectOption(option: ComboboxOption) {
    if (option.disabled) return;
    if (props.multiple === true) {
      const nextValues = selectedValues.includes(option.value)
        ? selectedValues.filter(value => value !== option.value)
        : [...selectedValues, option.value];
      updateSelectedValues(nextValues);
      if (controlledInputValue === undefined) setUncontrolledInputValue('');
      onInputValueChange?.('');
      setOpen(true);
      setActiveIndex(-1);
      inputRef.current?.focus();
      return;
    }
    if (controlledValue === undefined) setUncontrolledValue(option.value);
    updateSingleValue(option.value);
    if (controlledInputValue === undefined) setUncontrolledInputValue(option.label);
    onInputValueChange?.(option.label);
    setOpen(false);
    setActiveIndex(-1);
  }

  function moveActive(direction: 1 | -1) {
    if (enabledIndexes.length === 0) {
      setActiveIndex(-1);
      return;
    }
    const currentPosition = enabledIndexes.indexOf(activeIndex);
    const nextPosition = currentPosition === -1
      ? (direction === 1 ? 0 : enabledIndexes.length - 1)
      : (currentPosition + direction + enabledIndexes.length) % enabledIndexes.length;
    setActiveIndex(enabledIndexes[nextPosition]);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (multiple && event.key === 'Backspace' && inputValue === '' && selectedValues.length > 0) {
      event.preventDefault();
      updateSelectedValues(selectedValues.slice(0, -1));
      return;
    }
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!open) setOpen(true);
        moveActive(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!open) setOpen(true);
        moveActive(-1);
        break;
      case 'Home':
        if (open && enabledIndexes.length) {
          event.preventDefault();
          setActiveIndex(enabledIndexes[0]);
        }
        break;
      case 'End':
        if (open && enabledIndexes.length) {
          event.preventDefault();
          setActiveIndex(enabledIndexes[enabledIndexes.length - 1]);
        }
        break;
      case 'Enter':
        if (open && activeOption) {
          event.preventDefault();
          selectOption(activeOption);
        }
        break;
      case 'Escape':
        if (open) {
          event.preventDefault();
          setOpen(false);
          setActiveIndex(-1);
        }
        break;
      case 'Tab':
        setOpen(false);
        setActiveIndex(-1);
        break;
    }
  }

  return (
    <div className={['svx-combobox', multiple && 'svx-combobox--multiple'].filter(Boolean).join(' ')}>
      {multiple && (
        <div className="svx-combobox__field" data-disabled={disabled || undefined} data-size={size}>
          {selectedOptions.map(option => (
            <span className="svx-combobox__chip" key={option.value}>
              {option.label}
              <button
                type="button"
                className="svx-combobox__chip-remove"
                aria-label={`Remove ${option.label}`}
                disabled={disabled}
                onClick={() => updateSelectedValues(selectedValues.filter(value => value !== option.value))}
              >
                <span aria-hidden="true">×</span>
              </button>
            </span>
          ))}
          <input
            {...inputProps}
            ref={inputRef}
            id={suppliedId}
            type="text"
            role="combobox"
            autoComplete="off"
            disabled={disabled}
            required={false}
            value={inputValue}
            data-size={size}
            aria-invalid={ariaInvalid ?? (invalid || undefined)}
            aria-required={required || undefined}
            aria-expanded={expanded}
            aria-controls={listboxId}
            aria-autocomplete="list"
            aria-activedescendant={activeOptionId}
            aria-haspopup="listbox"
            className={['svx-combobox__input', 'svx-combobox__input--multiple', className].filter(Boolean).join(' ')}
            onChange={event => updateInput(event.currentTarget.value, event)}
            onFocus={event => {
              onFocus?.(event);
              if (!event.defaultPrevented && !disabled) setOpen(true);
            }}
            onBlur={event => {
              onBlur?.(event);
              if (!event.defaultPrevented) {
                setOpen(false);
                setActiveIndex(-1);
              }
            }}
            onKeyDown={handleKeyDown}
          />
        </div>
      )}
      {!multiple && (
        <input
          {...inputProps}
          ref={inputRef}
          id={suppliedId}
          type="text"
          role="combobox"
          autoComplete="off"
          disabled={disabled}
          required={required}
          value={inputValue}
          data-size={size}
          aria-invalid={ariaInvalid ?? (invalid || undefined)}
          aria-expanded={expanded}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={activeOptionId}
          className={['svx-text-control', 'svx-combobox__input', 'svx-focus-ring', className].filter(Boolean).join(' ')}
          onChange={event => updateInput(event.currentTarget.value, event)}
          onFocus={event => {
            onFocus?.(event);
            if (!event.defaultPrevented && !disabled) setOpen(true);
          }}
          onBlur={event => {
            onBlur?.(event);
            if (!event.defaultPrevented) {
              setOpen(false);
              setActiveIndex(-1);
            }
          }}
          onKeyDown={handleKeyDown}
        />
      )}
      {name && multiple && selectedValues.map(value => (
        <input key={value} type="hidden" name={name} value={value} disabled={disabled} />
      ))}
      {name && !multiple && (
        <input type="hidden" name={name} value={selectedValue ?? ''} disabled={disabled} />
      )}
      <div className="svx-combobox__popup" hidden={!expanded}>
        {loading
          ? <div className="svx-combobox__message" role="status" aria-live="polite">Loading options…</div>
          : filteredOptions.length === 0
            ? <div className="svx-combobox__message" role="status" aria-live="polite">{emptyMessage}</div>
            : null}
        <ul
          id={listboxId}
          className="svx-combobox__listbox"
          role="listbox"
          aria-busy={loading || undefined}
          aria-multiselectable={multiple || undefined}
          aria-label={inputProps['aria-label'] ? `${inputProps['aria-label']} options` : undefined}
        >
          {!loading && filteredOptions.map((option, index) => (
            <li
              id={`${listboxId}-option-${index}`}
              key={option.value}
              role="option"
              aria-selected={multiple
                ? selectedValues.includes(option.value)
                : selectedValue === option.value}
              aria-disabled={option.disabled || undefined}
              className="svx-combobox__option"
              data-active={activeIndex === index || undefined}
              data-disabled={option.disabled || undefined}
              data-selected={multiple && selectedValues.includes(option.value) || undefined}
              onMouseDown={event => event.preventDefault()}
              onMouseMove={() => !option.disabled && setActiveIndex(index)}
              onClick={() => selectOption(option)}
            >
              {multiple && <span className="svx-combobox__option-indicator" aria-hidden="true">{selectedValues.includes(option.value) ? '✓' : ''}</span>}
              {option.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

Combobox.displayName = 'Combobox';
