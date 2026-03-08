import { Button } from "@/components/ui/button";
import { Code2 } from "lucide-react";

const EXAMPLES: { label: string; language: string; code: string }[] = [
  {
    label: "Python Loop",
    language: "Python",
    code: `for i in range(5):\n    print(i)`,
  },
  {
    label: "JS Fibonacci",
    language: "JavaScript",
    code: `function fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}\nconsole.log(fibonacci(6));`,
  },
  {
    label: "Python FizzBuzz",
    language: "Python",
    code: `for i in range(1, 16):\n    if i % 15 == 0:\n        print("FizzBuzz")\n    elif i % 3 == 0:\n        print("Fizz")\n    elif i % 5 == 0:\n        print("Buzz")\n    else:\n        print(i)`,
  },
  {
    label: "JS Array Filter",
    language: "JavaScript",
    code: `const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];\nconst evens = numbers.filter(n => n % 2 === 0);\nconst doubled = evens.map(n => n * 2);\nconsole.log(doubled);`,
  },
];

interface ExampleSnippetsProps {
  onSelect: (code: string, language: string) => void;
}

const ExampleSnippets = ({ onSelect }: ExampleSnippetsProps) => (
  <div className="flex items-center gap-2 flex-wrap">
    <span className="text-xs text-muted-foreground flex items-center gap-1">
      <Code2 className="w-3 h-3" /> Examples:
    </span>
    {EXAMPLES.map((ex) => (
      <Button
        key={ex.label}
        size="sm"
        variant="ghost"
        className="text-xs h-7 px-2.5"
        onClick={() => onSelect(ex.code, ex.language)}
      >
        {ex.label}
      </Button>
    ))}
  </div>
);

export default ExampleSnippets;
