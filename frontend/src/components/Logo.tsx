import { Link } from "react-router-dom";

export default function Logo({ w, h }: { w?: number; h?: number }) {
  return (
    <Link to="/">
      <img
        src="/icons/logo.svg"
        width={w ?? 30}
        height={h ?? 13}
        alt="Logo"
        className="rounded"
      />
    </Link>
  );
}
