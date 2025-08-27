import { Input } from './Input';

interface ReplaceProductIdProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const ReplaceProductId = ({
  value,
  onChange,
  placeholder,
}: ReplaceProductIdProps) => {
  return (
    <Input
      type="text"
      placeholder={placeholder}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        onChange(e.target.value)
      }
      defaultValue={value}
    />
  );
};
