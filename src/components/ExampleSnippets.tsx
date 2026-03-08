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
  {
    label: "Bubble Sort",
    language: "Python",
    code: `def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n - i - 1):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n    return arr\n\nprint(bubble_sort([64, 34, 25, 12, 22, 11, 90]))`,
  },
  {
    label: "Binary Search",
    language: "Python",
    code: `def binary_search(arr, target):\n    low, high = 0, len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1\n\nprint(binary_search([1, 3, 5, 7, 9, 11], 7))`,
  },
  {
    label: "JS Recursion",
    language: "JavaScript",
    code: `function factorial(n) {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}\nconsole.log(factorial(5));`,
  },
  {
    label: "Two Sum",
    language: "JavaScript",
    code: `function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}\nconsole.log(twoSum([2, 7, 11, 15], 9));`,
  },
];

interface ExampleSnippetsProps {
  onSelect: (code: string, language: string) => void;
}

const ExampleSnippets = ({ onSelect }: ExampleSnippetsProps) => (
  <div className="flex items-center gap-1.5 flex-wrap">
    <span className="text-xs text-muted-foreground flex items-center gap-1 mr-1">
      <Code2 className="w-3 h-3" /> Examples:
    </span>
    {EXAMPLES.map((ex) => (
      <Button
        key={ex.label}
        size="sm"
        variant="ghost"
        className="text-xs h-6 px-2 text-muted-foreground hover:text-foreground"
        onClick={() => onSelect(ex.code, ex.language)}
      >
        {ex.label}
      </Button>
    ))}
  </div>
);

export default ExampleSnippets;
