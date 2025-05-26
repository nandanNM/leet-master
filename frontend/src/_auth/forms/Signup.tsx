import SignUpForm from "@/components/forms/SignUpForm";
import { Link } from "react-router-dom";

export default function RegisterPage() {
  return (
    <div className="space-y-7 lg:p-10">
      <h1 className="text-center text-xl font-semibold">Create Account</h1>
      <SignUpForm />
      <div className="mx-auto max-w-md">
        <p>
          Already have account ?{" "}
          <Link to="/login" className="text-primary drop-shadow-md">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
