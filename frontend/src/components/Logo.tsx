import { Link } from "react-router-dom";

export default function Logo({ w, h }: { w?: number; h?: number }) {
  return (
    <Link to="/">
      <img
        src="/icons/logo.svg"
        width={w ?? 60}
        height={h ?? 25}
        alt="Logo"
        className="rounded"
      />
    </Link>
  );
}
