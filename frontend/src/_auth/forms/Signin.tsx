import LoginForm from "@/components/forms/LoginForm";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL;
export default function LoginPage() {
  const handaleGoogleLogin = () => {
    console.log("google login");
    window.open(`${backendUrl}/auth/google`, "_self");
    window.location.href = `${backendUrl}/auth/google`;
  };
  return (
    <div className="space-y-7 lg:p-10">
      <h1 className="text-center text-xl font-semibold">Login</h1>
      <LoginForm />
      <Button className="w-full" onClick={handaleGoogleLogin} variant="outline">
        Google
      </Button>
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
