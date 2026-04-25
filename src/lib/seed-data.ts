import { Question } from "./types";

export const seedQuestions: Question[] = [
  {
    id: "q-001",
    type: "MCQ",
    content: "What is the default access modifier for a class in C#?",
    language: "C#",
    framework: ".NET",
    difficulty: "Easy",
    experience: "0-2 years",
    solution: "The default access modifier for a class in C# is 'internal', which means the class is accessible only within its own assembly.",
    options: ["public", "private", "internal", "protected"],
    correctOption: 2,
    askCount: 3,
    status: "Active",
    createdAt: "2025-11-01T10:00:00Z",
    tags: ["OOP", "access-modifiers"],
  },
  {
    id: "q-002",
    type: "Theory",
    content: "Explain the difference between 'var', 'let', and 'const' in JavaScript.",
    language: "JavaScript",
    framework: "Node.js",
    difficulty: "Easy",
    experience: "0-2 years",
    solution:
      "'var' is function-scoped and hoisted. 'let' is block-scoped, not hoisted, and can be reassigned. 'const' is block-scoped, not hoisted, and cannot be reassigned after initialization. Both 'let' and 'const' were introduced in ES6.",
    askCount: 12,
    status: "Active",
    createdAt: "2025-10-15T09:00:00Z",
    tags: ["variables", "ES6", "scope"],
  },
  {
    id: "q-003",
    type: "Code",
    content: "What will be the output of the following Python code?",
    language: "Python",
    framework: "Django",
    difficulty: "Medium",
    experience: "3-5 years",
    solution: "The output will be [1, 4, 9, 16, 25]. This is a list comprehension that squares each number in the range 1-5.",
    codeSnippet: `numbers = [x**2 for x in range(1, 6)]
print(numbers)`,
    codeLanguage: "python",
    askCount: 7,
    status: "Active",
    createdAt: "2025-09-20T14:00:00Z",
    tags: ["list-comprehension", "basics"],
  },
  {
    id: "q-004",
    type: "MCQ",
    content: "Which hook is used to manage side effects in a React functional component?",
    language: "JavaScript",
    framework: "React",
    difficulty: "Easy",
    experience: "0-2 years",
    solution: "useEffect is the hook specifically designed for managing side effects like data fetching, subscriptions, and DOM manipulations in functional components.",
    options: ["useState", "useEffect", "useReducer", "useMemo"],
    correctOption: 1,
    askCount: 14,
    status: "Active",
    createdAt: "2025-08-10T11:00:00Z",
    tags: ["hooks", "side-effects"],
  },
  {
    id: "q-005",
    type: "Theory",
    content: "What is Dependency Injection and why is it important in .NET applications?",
    language: "C#",
    framework: ".NET",
    difficulty: "Medium",
    experience: "3-5 years",
    solution:
      "Dependency Injection (DI) is a design pattern where an object's dependencies are provided externally rather than being created internally. In .NET, the built-in DI container manages service lifetimes (Transient, Scoped, Singleton). It promotes loose coupling, testability, and maintainability by allowing dependencies to be swapped easily.",
    askCount: 5,
    status: "Active",
    createdAt: "2025-07-22T16:00:00Z",
    tags: ["design-patterns", "DI", "architecture"],
  },
  {
    id: "q-006",
    type: "Code",
    content: "Implement a binary search algorithm in Java that returns the index of a target element.",
    language: "Java",
    framework: "Spring Boot",
    difficulty: "Medium",
    experience: "3-5 years",
    solution: "Binary search divides the sorted array in half repeatedly. Time complexity is O(log n).",
    codeSnippet: `public static int binarySearch(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
    codeLanguage: "java",
    askCount: 9,
    status: "Active",
    createdAt: "2025-06-15T13:00:00Z",
    tags: ["algorithms", "search", "data-structures"],
  },
  {
    id: "q-007",
    type: "MCQ",
    content: "Which of the following is NOT a valid TypeScript utility type?",
    language: "TypeScript",
    framework: "React",
    difficulty: "Hard",
    experience: "5+ years",
    solution: "TypeScript has Partial, Readonly, Required, Record, Pick, Omit, Exclude, Extract, etc. 'Mutable' is not a built-in utility type.",
    options: ["Partial<T>", "Readonly<T>", "Mutable<T>", "Record<K,V>"],
    correctOption: 2,
    askCount: 2,
    status: "Active",
    createdAt: "2025-05-30T10:00:00Z",
    tags: ["utility-types", "generics"],
  },
  {
    id: "q-008",
    type: "Theory",
    content: "Explain the concept of middleware in Express.js and how the request pipeline works.",
    language: "JavaScript",
    framework: "Express",
    difficulty: "Medium",
    experience: "3-5 years",
    solution:
      "Middleware functions have access to the request, response, and next() function. They execute sequentially in the order they are defined. Types include application-level, router-level, error-handling, built-in, and third-party middleware. The pipeline processes requests through each middleware until a response is sent or next() passes control.",
    askCount: 6,
    status: "Active",
    createdAt: "2025-05-10T15:00:00Z",
    tags: ["middleware", "request-pipeline"],
  },
  {
    id: "q-009",
    type: "Code",
    content: "Write a SQL query to find the second highest salary from an Employees table.",
    language: "SQL",
    framework: ".NET",
    difficulty: "Medium",
    experience: "3-5 years",
    solution: "This uses a subquery to exclude the maximum salary, then finds the maximum of the remaining salaries.",
    codeSnippet: `SELECT MAX(salary) AS SecondHighestSalary
FROM Employees
WHERE salary < (SELECT MAX(salary) FROM Employees);`,
    codeLanguage: "sql",
    askCount: 11,
    status: "Active",
    createdAt: "2025-04-20T12:00:00Z",
    tags: ["subquery", "aggregation"],
  },
  {
    id: "q-010",
    type: "MCQ",
    content: "What does the 'async/await' pattern in Python primarily rely on?",
    language: "Python",
    framework: "Django",
    difficulty: "Hard",
    experience: "5+ years",
    solution: "Python's async/await relies on the asyncio event loop to manage concurrent execution of coroutines without using threads.",
    options: ["Multi-threading", "Multi-processing", "Event Loop (asyncio)", "Global Interpreter Lock"],
    correctOption: 2,
    askCount: 4,
    status: "Active",
    createdAt: "2025-03-15T09:00:00Z",
    tags: ["async", "concurrency"],
  },
  {
    id: "q-011",
    type: "Theory",
    content: "What are the SOLID principles in object-oriented design? Explain each briefly.",
    language: "Java",
    framework: "Spring Boot",
    difficulty: "Hard",
    experience: "5+ years",
    solution:
      "S - Single Responsibility: A class should have one reason to change. O - Open/Closed: Open for extension, closed for modification. L - Liskov Substitution: Subtypes should be substitutable for base types. I - Interface Segregation: Many specific interfaces are better than one general. D - Dependency Inversion: Depend on abstractions, not concretions.",
    askCount: 8,
    status: "Active",
    createdAt: "2025-02-28T14:00:00Z",
    tags: ["SOLID", "design-principles", "OOP"],
  },
  {
    id: "q-012",
    type: "Code",
    content: "Create a React custom hook that debounces a value.",
    language: "TypeScript",
    framework: "React",
    difficulty: "Hard",
    experience: "5+ years",
    solution: "This custom hook delays updating the debounced value until after the specified delay has passed since the last change.",
    codeSnippet: `import { useState, useEffect } from 'react';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}`,
    codeLanguage: "typescript",
    askCount: 1,
    status: "Active",
    createdAt: "2025-01-10T11:00:00Z",
    tags: ["custom-hooks", "debounce", "performance"],
  },
  {
    id: "q-013",
    type: "MCQ",
    content: "In Angular, which decorator is used to define a component?",
    language: "TypeScript",
    framework: "Angular",
    difficulty: "Easy",
    experience: "0-2 years",
    solution: "@Component decorator is used to mark a class as an Angular component and provide metadata like template, styles, and selector.",
    options: ["@Injectable", "@Component", "@Directive", "@Module"],
    correctOption: 1,
    askCount: 15,
    status: "Archived",
    createdAt: "2024-12-05T10:00:00Z",
    tags: ["decorators", "components"],
  },
  {
    id: "q-014",
    type: "Theory",
    content: "What is the difference between REST and GraphQL? When would you choose one over the other?",
    language: "JavaScript",
    framework: "Node.js",
    difficulty: "Medium",
    experience: "3-5 years",
    solution:
      "REST uses multiple endpoints with fixed data structures, while GraphQL uses a single endpoint where clients specify exactly the data they need. REST is simpler and better for caching. GraphQL reduces over-fetching/under-fetching and is ideal for complex, interconnected data with multiple client types.",
    askCount: 10,
    status: "Active",
    createdAt: "2024-11-20T16:00:00Z",
    tags: ["API", "REST", "GraphQL", "architecture"],
  },
  {
    id: "q-015",
    type: "Code",
    content: "Write a Go function that checks if a string is a palindrome.",
    language: "Go",
    framework: "Node.js",
    difficulty: "Easy",
    experience: "0-2 years",
    solution: "This function compares characters from both ends of the string moving towards the center.",
    codeSnippet: `func isPalindrome(s string) bool {
    s = strings.ToLower(s)
    left, right := 0, len(s)-1
    for left < right {
        if s[left] != s[right] {
            return false
        }
        left++
        right--
    }
    return true
}`,
    codeLanguage: "go",
    askCount: 6,
    status: "Active",
    createdAt: "2024-10-10T09:00:00Z",
    tags: ["strings", "algorithms"],
  },
];
