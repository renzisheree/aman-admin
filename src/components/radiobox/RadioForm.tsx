import { useField } from "formik";

interface RadioProps {
  name: string;
  value: string;
  checked?: boolean;
  content: string;
}

const RadioForm = ({ name, value, checked, content }: RadioProps) => {
  const [field] = useField({ name, value, checked, content });

  return (
    <div className="flex items-center gap-x-3">
      <label className="cursor-pointer custom-radio">
        <input
          {...field}
          type="radio"
          className="hidden"
          value={value}
          checked={checked}
        />

        <div className="w-full h-full bg-white rounded-full"></div>
      </label>

      <span>{content}</span>
    </div>
  );
};

export default RadioForm;
