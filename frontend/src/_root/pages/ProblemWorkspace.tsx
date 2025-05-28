import { useProblemStore } from "@/store";
import { useParams } from "react-router-dom";

export default function ProblemWorkspace() {
  const { id } = useParams();
  console.log("Problem ID:", id);
  const { isProblemLoading, getProblemById, problem } = useProblemStore();

  return <div>ProblemWorkspace</div>;
}
