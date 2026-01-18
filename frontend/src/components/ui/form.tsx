import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';
import * as React from 'react';
import { useForm, type UseFormReturn, type SubmitHandler, type UseFormProps, type FieldValues, type DefaultValues } from 'react-hook-form';
import * as Yup from 'yup';
import { ErrorBoundary } from '../Error/ErrorBoundar';

type FormProps<TFormValues extends FieldValues, Schema extends Yup.ObjectSchema<any>> = {
  className?: string;
  autoComplete?: string;
  onSubmit: SubmitHandler<TFormValues>;
  children: (methods: UseFormReturn<TFormValues>) => React.ReactNode;
  options?: UseFormProps<TFormValues>;
  id?: string;
  initialValues?: DefaultValues<TFormValues> | undefined;
  schema?: Schema;
};

export const Form = <
  TFormValues extends Record<string, unknown> = Record<string, unknown>,
  Schema extends Yup.ObjectSchema<any> = Yup.ObjectSchema<any>
>({
  onSubmit,
  children,
  className,
  options,
  id,
  schema,
  autoComplete,
  initialValues,
}: FormProps<TFormValues, Schema>) => {
  const methods = useForm<TFormValues>({
    ...options,
    resolver: schema && yupResolver(schema),
    mode: 'onSubmit', // Changed back to onSubmit mode
    defaultValues: initialValues,
  });
  return (
    <ErrorBoundary>
      <form
        autoComplete={autoComplete}
        className={clsx('space-y-6', className)}
        onSubmit={methods.handleSubmit(onSubmit)}
        id={id}
      >
        {children(methods)}
      </form>
    </ErrorBoundary>
  );
};