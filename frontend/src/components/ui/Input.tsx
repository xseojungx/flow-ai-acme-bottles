const BASE =
  'w-full px-3 py-2 rounded-md border border-base bg-surface text-sm text-ink placeholder:text-dim focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-colors';

type SelectInputProps = {
  as: 'select';
  children: React.ReactNode;
} & React.SelectHTMLAttributes<HTMLSelectElement>;

type NativeInputProps = {
  as?: undefined;
} & React.InputHTMLAttributes<HTMLInputElement>;

type InputProps = SelectInputProps | NativeInputProps;

export function Input(props: InputProps) {
  if (props.as === 'select') {
    const { as: _as, children, ...rest } = props;
    return (
      <select className={BASE} {...rest}>
        {children}
      </select>
    );
  }
  const { as: _as, ...rest } = props;
  return <input className={BASE} {...rest} />;
}
