import LoginForm from "@/components/forms/LoginForm";
import { Link } from "react-router-dom";

export default function LoginPage() {
  return (
    <div className="space-y-7 lg:p-10">
      <h1 className="text-center text-xl font-semibold">Login</h1>
      <LoginForm />
      <div className="mx-auto max-w-md">
        <p>
          Don't have account ?{" "}
          <Link to="/signup" className="text-primary drop-shadow-md">
            Create here
          </Link>
        </p>
      </div>
    </div>
  );
}
