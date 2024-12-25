import { useState } from "react";
import { z } from "zod";
import { validateRegistration } from "./validation";
import { toast } from "react-hot-toast";

const RegistrationForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setHasError(false);

    const registrationData = { email, password, confirmPassword };
    const { success, error } = validateRegistration(registrationData);

    if (!success) {
      setHasError(true);
      toast.error("Validation failed: " + error.format());
      setIsLoading(false);
      return;
    }

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registrationData),
    });

    const result = await response.json();

    if (response.ok) {
      toast.success(result.message);
    } else {
      setHasError(true);
      toast.error(result.error);
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="border p-2 rounded"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="border p-2 rounded"
        required
      />
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm Password"
        className="border p-2 rounded"
        required
      />
      <button
        type="submit"
        disabled={isLoading}
        className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {isLoading ? "Registering..." : "Register"}
      </button>
      {hasError && <p className="text-red-500">Registration failed. Please try again.</p>}
    </form>
  );
};

export default RegistrationForm;
