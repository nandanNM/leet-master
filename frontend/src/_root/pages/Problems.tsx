export default function Problems() {
  return (
    <div className="mt-4 flex min-h-screen flex-col items-center px-4">
      <div className="bg-primary absolute top-16 bottom-9 left-0 h-1/3 w-1/3 rounded-md opacity-30 blur-3xl"></div>
      <h1 className="z-10 text-center text-4xl font-extrabold">
        Welcome to <span className="text-primary">LeetLab</span>
      </h1>

      <p className="z-10 mt-4 text-center text-lg font-semibold text-gray-500 dark:text-gray-400">
        A Platform Inspired by Leetcode which helps you to prepare for coding
        interviews and helps you to improve your coding skills by solving coding
        problems
      </p>

      {/* {problems.length > 0 ? (
        <ProblemTable problems={problems} />
      ) : (
        <p className="border-primary z-10 mt-10 rounded-md border border-dashed px-4 py-2 text-center text-lg font-semibold text-gray-500 dark:text-gray-400">
          No problems found
        </p>
      )} */}
    </div>
  );
}
