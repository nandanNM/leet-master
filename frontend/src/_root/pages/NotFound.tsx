import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <main className="my-12 w-full space-y-3 text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <h2 className="text-2xl font-bold">Page Not Found</h2>
      <p className="text-foreground">
        But dont worry, you can find plenty of other things on our homepage .
      </p>
      <Link to={"/"} className="text-primary hover:underline" replace={true}>
        Go Home
      </Link>
    </main>
  );
}
