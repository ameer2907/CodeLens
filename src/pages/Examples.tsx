import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Code2, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";

const EXAMPLES = [
  { label: "Bubble Sort", language: "Python", difficulty: "Easy", description: "Classic comparison-based sorting algorithm with nested loops.", code: `def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n - i - 1):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n    return arr\n\nprint(bubble_sort([64, 34, 25, 12, 22, 11, 90]))` },
  { label: "Binary Search", language: "Python", difficulty: "Easy", description: "Efficient O(log n) search on sorted arrays using divide and conquer.", code: `def binary_search(arr, target):\n    low, high = 0, len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1\n\nprint(binary_search([1, 3, 5, 7, 9, 11], 7))` },
  { label: "Fibonacci", language: "JavaScript", difficulty: "Easy", description: "Recursive implementation of the Fibonacci sequence.", code: `function fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}\nconsole.log(fibonacci(6));` },
  { label: "Two Sum", language: "JavaScript", difficulty: "Medium", description: "Find two numbers that add up to a target using a hash map.", code: `function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}\nconsole.log(twoSum([2, 7, 11, 15], 9));` },
  { label: "FizzBuzz", language: "Python", difficulty: "Easy", description: "Classic interview problem with modulo-based conditional logic.", code: `for i in range(1, 16):\n    if i % 15 == 0:\n        print("FizzBuzz")\n    elif i % 3 == 0:\n        print("Fizz")\n    elif i % 5 == 0:\n        print("Buzz")\n    else:\n        print(i)` },
  { label: "Factorial", language: "JavaScript", difficulty: "Easy", description: "Recursive function computing n! with a base case.", code: `function factorial(n) {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}\nconsole.log(factorial(5));` },
  { label: "Array Filter & Map", language: "JavaScript", difficulty: "Easy", description: "Functional programming pattern chaining filter and map.", code: `const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];\nconst evens = numbers.filter(n => n % 2 === 0);\nconst doubled = evens.map(n => n * 2);\nconsole.log(doubled);` },
  { label: "Python Loop", language: "Python", difficulty: "Easy", description: "Simple for loop iterating over a range.", code: `for i in range(5):\n    print(i)` },
];

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: "bg-accent/10 text-accent",
  Medium: "bg-primary/10 text-primary",
  Hard: "bg-destructive/10 text-destructive",
};

const Examples = () => {
  const navigate = useNavigate();

  const handleSelect = (ex: typeof EXAMPLES[0]) => {
    // Store in sessionStorage so playground can pick it up
    sessionStorage.setItem("codelens-example", JSON.stringify({ code: ex.code, language: ex.language }));
    navigate("/playground");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-foreground mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Example Algorithms
          </h1>
          <p className="text-muted-foreground text-sm mb-8">
            Click any example to load it in the playground and get an instant AI explanation.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4">
          {EXAMPLES.map((ex, i) => (
            <motion.button
              key={ex.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => handleSelect(ex)}
              className="text-left rounded-xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">{ex.label}</span>
                </div>
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${DIFFICULTY_COLORS[ex.difficulty]}`}>
                  {ex.difficulty}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{ex.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">{ex.language}</span>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Examples;
