import CreateProblemForm from "@/components/forms/CreateProblemForm";
import { useParams } from "react-router-dom";

export default function UpdateProblem() {
  const { id: problemId } = useParams();
  return (
    <>
      <CreateProblemForm action="update" problemId={problemId} />
    </>
  );
}
