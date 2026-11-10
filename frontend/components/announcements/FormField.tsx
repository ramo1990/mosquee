
"use client";

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
};

export default function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: Props) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
      />
    </div>
  );
}