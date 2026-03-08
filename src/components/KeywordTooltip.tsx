import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const KEYWORD_DEFINITIONS: Record<string, string> = {
  "loop": "A loop repeats a block of code multiple times until a condition is met.",
  "for loop": "Repeats code a set number of times, iterating over a sequence.",
  "while loop": "Keeps running as long as its condition remains true.",
  "variable": "A named container that stores a value you can use and change.",
  "function": "A reusable block of code that performs a specific task.",
  "condition": "A check that determines which code path to follow (if/else).",
  "if": "Executes code only when a specific condition is true.",
  "else": "Runs when the if condition is false — the alternative path.",
  "return": "Sends a value back from a function and stops its execution.",
  "array": "An ordered list of values, accessed by their position (index).",
  "list": "An ordered collection of items that can be changed (similar to array).",
  "index": "A number representing an item's position in a list (starts at 0).",
  "iterate": "To go through items one by one, usually in a loop.",
  "recursion": "When a function calls itself to solve smaller parts of a problem.",
  "parameter": "A variable listed in a function definition that receives input.",
  "argument": "The actual value passed to a function when you call it.",
  "boolean": "A value that is either true or false.",
  "string": "A sequence of characters, like text enclosed in quotes.",
  "integer": "A whole number without decimals.",
  "comparison": "Checking if values are equal, greater, or less than each other.",
  "assignment": "Storing a value in a variable using = (equals sign).",
  "increment": "Increasing a value by one, usually written as i++ or i += 1.",
  "decrement": "Decreasing a value by one, usually written as i-- or i -= 1.",
  "pointer": "A reference to a position in memory, like a bookmark.",
  "swap": "Exchanging the values of two variables.",
  "nested": "Something placed inside another of the same kind, like a loop inside a loop.",
  "pivot": "A chosen reference element used to partition data (common in sorting).",
  "base case": "The simplest case in recursion that stops the function from calling itself.",
  "stack": "A data structure where the last item added is the first removed (LIFO).",
  "queue": "A data structure where the first item added is the first removed (FIFO).",
  "complexity": "A measure of how an algorithm's time or space grows with input size.",
  "O(n)": "Linear time — the work grows proportionally with the input size.",
  "O(1)": "Constant time — the work stays the same regardless of input size.",
  "O(n²)": "Quadratic time — often from nested loops, work grows quickly.",
};

// Build a regex that matches keywords (longest first, word boundaries)
const sortedKeywords = Object.keys(KEYWORD_DEFINITIONS).sort((a, b) => b.length - a.length);
const keywordPattern = new RegExp(
  `\\b(${sortedKeywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join("|")})\\b`,
  "gi"
);

interface KeywordTooltipProps {
  text: string;
}

const KeywordTooltip = ({ text }: KeywordTooltipProps) => {
  const parts: { text: string; keyword?: string }[] = [];
  let lastIndex = 0;

  // Find all keyword matches
  const matches: { index: number; length: number; match: string }[] = [];
  let m: RegExpExecArray | null;
  const regex = new RegExp(keywordPattern.source, "gi");

  while ((m = regex.exec(text)) !== null) {
    matches.push({ index: m.index, length: m[0].length, match: m[0] });
  }

  // Deduplicate overlapping matches
  const filtered = matches.filter((match, i) => {
    for (let j = 0; j < i; j++) {
      const prev = matches[j];
      if (match.index >= prev.index && match.index < prev.index + prev.length) return false;
    }
    return true;
  });

  for (const match of filtered) {
    if (match.index > lastIndex) {
      parts.push({ text: text.slice(lastIndex, match.index) });
    }
    parts.push({ text: match.match, keyword: match.match.toLowerCase() });
    lastIndex = match.index + match.length;
  }

  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex) });
  }

  if (parts.length === 0) return <>{text}</>;

  return (
    <TooltipProvider delayDuration={300}>
      <>
        {parts.map((part, i) => {
          if (!part.keyword) return <span key={i}>{part.text}</span>;

          const definition = KEYWORD_DEFINITIONS[part.keyword];
          if (!definition) return <span key={i}>{part.text}</span>;

          return (
            <Tooltip key={i}>
              <TooltipTrigger asChild>
                <span className="border-b border-dotted border-primary/40 text-primary/90 cursor-help transition-colors hover:text-primary hover:border-primary/70">
                  {part.text}
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs text-xs leading-relaxed">
                <p>{definition}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </>
    </TooltipProvider>
  );
};

export default KeywordTooltip;
