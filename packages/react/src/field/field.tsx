import { Slot } from '@radix-ui/react-slot';
import {
  Children, cloneElement, createContext, forwardRef, useCallback, useContext,
  useEffect, useId, useMemo, useState,
} from 'react';
import type { ComponentPropsWithoutRef, ReactElement } from 'react';
import { Label } from '../label/label';
import type { LabelProps } from '../label/label';
import { SupportingText } from '../supporting-text/supporting-text';
import type { SupportingTextProps } from '../supporting-text/supporting-text';

export interface FieldProps extends ComponentPropsWithoutRef<'div'> {
  /** ID assigned to the control, not the wrapper. Generated when omitted. */
  controlId?: string;
  size?: LabelProps['size'];
  required?: boolean;
  disabled?: boolean;
  invalid?: boolean;
}

interface FieldContextValue {
  controlId: string;
  size: LabelProps['size'];
  required: boolean;
  disabled: boolean;
  invalid: boolean;
  descriptions: string[];
  registerDescription: (id: string) => () => void;
}

const FieldContext = createContext<FieldContextValue | null>(null);

function useField() {
  const field = useContext(FieldContext);
  if (!field) throw new Error('Field parts must be rendered inside a Field.');
  return field;
}

export const Field = forwardRef<HTMLDivElement, FieldProps>(function Field(
  { controlId, size = 'md', required = false, disabled = false, invalid = false, className, ...props },
  ref,
) {
  const generatedId = useId();
  const [descriptions, setDescriptions] = useState<string[]>([]);
  const registerDescription = useCallback((id: string) => {
    setDescriptions((current) => [...current, id]);
    return () => setDescriptions((current) => current.filter((value) => value !== id));
  }, []);
  const value = useMemo(() => ({
    controlId: controlId ?? generatedId,
    size, required, disabled, invalid, descriptions, registerDescription,
  }), [controlId, generatedId, size, required, disabled, invalid, descriptions, registerDescription]);

  return (
    <FieldContext.Provider value={value}>
      <div
        {...props}
        ref={ref}
        className={['svx-field', className].filter(Boolean).join(' ')}
        data-invalid={invalid || undefined}
        data-disabled={disabled || undefined}
      />
    </FieldContext.Provider>
  );
});

export type FieldLabelProps = Omit<LabelProps, 'htmlFor' | 'size' | 'required' | 'disabled' | 'invalid'>;

export const FieldLabel = forwardRef<HTMLLabelElement, FieldLabelProps>(function FieldLabel(props, ref) {
  const field = useField();
  return (
    <Label
      {...props}
      ref={ref}
      htmlFor={field.controlId}
      size={field.size}
      required={field.required}
      disabled={field.disabled}
      invalid={field.invalid}
    />
  );
});

export interface FieldControlProps {
  /** One native input/textarea/select, or a component forwarding these props and ref. */
  children: ReactElement<ComponentPropsWithoutRef<'input'> & { 'data-size'?: LabelProps['size'] }>;
}

export const FieldControl = forwardRef<HTMLElement, FieldControlProps>(function FieldControl(
  { children },
  ref,
) {
  const field = useField();
  const child = Children.only(children);
  const describedBy = [...new Set([
    ...(child.props['aria-describedby']?.split(/\s+/).filter(Boolean) ?? []),
    ...field.descriptions,
  ])].join(' ') || undefined;

  return (
    <Slot ref={ref}>
      {cloneElement(child, {
        id: field.controlId,
        required: field.required,
        disabled: field.disabled,
        'data-size': field.size,
        'aria-invalid': field.invalid,
        'aria-describedby': describedBy,
      })}
    </Slot>
  );
});

export type FieldDescriptionProps = Omit<SupportingTextProps, 'size' | 'disabled' | 'invalid' | 'variant'>;

function useDescription(id: string | undefined, enabled: boolean) {
  const field = useField();
  const generatedId = useId();
  const descriptionId = id ?? generatedId;
  useEffect(() => {
    if (enabled) return field.registerDescription(descriptionId);
  }, [enabled, field.registerDescription, descriptionId]);
  return { field, descriptionId };
}

export const FieldDescription = forwardRef<HTMLParagraphElement, FieldDescriptionProps>(
  function FieldDescription({ id, ...props }, ref) {
    const { field, descriptionId } = useDescription(id, true);
    return (
      <SupportingText
        {...props}
        ref={ref}
        id={descriptionId}
        size={field.size}
        disabled={field.disabled}
      />
    );
  },
);

export const FieldError = forwardRef<HTMLParagraphElement, FieldDescriptionProps>(
  function FieldError({ id, startIcon = true, ...props }, ref) {
    const context = useField();
    const { field, descriptionId } = useDescription(id, context.invalid);
    if (!field.invalid) return null;
    return (
      <SupportingText
        {...props}
        ref={ref}
        id={descriptionId}
        size={field.size}
        disabled={field.disabled}
        startIcon={startIcon}
        invalid
      />
    );
  },
);
