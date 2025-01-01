import { Input } from "../ui/input";

interface UsernameInputProps {
  username: string;
  onChange: (value: string) => void;
}

export const UsernameInput = ({ username, onChange }: UsernameInputProps) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">Username</label>
      <Input
        value={username}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your username"
        required
      />
    </div>
  );
};