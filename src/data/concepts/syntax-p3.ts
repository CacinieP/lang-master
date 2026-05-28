import type { ConceptNode } from '@/types';

export const syntaxP3Concepts: ConceptNode[] = [
  // ────────────────────────────────────────────────────────
  // 1. control_flow_conditional — if/else branches
  // ────────────────────────────────────────────────────────
  {
    id: 'control_flow_conditional',
    name: '条件分支',
    name_en: 'Conditional Branch (if/else)',
    description: '根据条件表达式的真假选择不同的执行路径，是程序决策的基本机制。',
    description_en: 'Select different execution paths based on the truth value of a condition expression — the fundamental decision mechanism in programs.',
    layer: 'syntax',
    layer_position: 1,
    paradigm_tags: ['procedural', 'oop', 'functional'],
    difficulty: 3,
    new_concept_count: 3,
    expressions: {
      python: {
        code: `score = 85
if score >= 90:
    grade = 'A'
elif score >= 80:
    grade = 'B'
else:
    grade = 'C'`,
        explanation: 'Python 使用缩进界定分支体，elif 代替 else if，条件表达式不需要括号。',
        paradigm: 'procedural',
        equivalent_expressions: ['switch/case (limited)', 'match (Python 3.10+)'],
        layer_note: '缩进是语法的一部分，缩进错误会导致 IndentationError。',
        highlight_tokens: ['if', 'elif', 'else'],
        output: null,
      },
      c: {
        code: `int score = 85;
char grade;
if (score >= 90) {
    grade = 'A';
} else if (score >= 80) {
    grade = 'B';
} else {
    grade = 'C';
}`,
        explanation: 'C 使用花括号 {} 界定分支体，else if 是两个关键字的组合，条件必须用括号包裹。',
        paradigm: 'procedural',
        equivalent_expressions: ['switch/case (常量匹配)', '三元运算符 ?:'],
        layer_note: '花括号可选但强烈推荐；悬空 else 问题靠花括号规避。',
        highlight_tokens: ['if', 'else', 'if'],
        output: null,
      },
      java: {
        code: `int score = 85;
char grade;
if (score >= 90) {
    grade = 'A';
} else if (score >= 80) {
    grade = 'B';
} else {
    grade = 'C';
}`,
        explanation: 'Java 语法与 C 类似，但条件表达式必须为 boolean 类型，不能使用整数作条件。',
        paradigm: 'oop',
        equivalent_expressions: ['switch/case (常量匹配)', '三元运算符 ?:'],
        layer_note: 'Java 条件类型严格为 boolean，if(1) 是编译错误。',
        highlight_tokens: ['if', 'else', 'if'],
        output: null,
      },
      rust: {
        code: `let score = 85;
let grade = if score >= 90 {
    'A'
} else if score >= 80 {
    'B'
} else {
    'C'
};`,
        explanation: 'Rust 的 if 是表达式而非语句，可直接赋值；各分支返回值类型必须一致。',
        paradigm: 'functional',
        equivalent_expressions: ['match 表达式', '三元 if 简写'],
        layer_note: 'if 表达式特性使得 Rust 不需要三元运算符。',
        highlight_tokens: ['if', 'else', 'if', 'let'],
        output: null,
      },
    },
    traps: {
      python_to_c: {
        description: 'Python 习惯省略花括号，在 C 中必须用花括号或明确缩进以避免悬空 else',
        severity: 'high',
        example_wrong: `if (x > 0)
    y = 1;
    z = 2;  // 始终执行，不受 if 控制`,
        example_correct: `if (x > 0) {
    y = 1;
    z = 2;
}`,
        explanation: 'C 中没有花括号时，if 只控制紧跟的一条语句。Python 的缩进块天然避免此问题。',
      },
      python_to_rust: {
        description: '忘记 if 表达式各分支返回类型必须一致',
        severity: 'medium',
        example_wrong: `let x = if cond { 42 } else { "no" };  // 类型不一致`,
        example_correct: `let x = if cond { Some(42) } else { None };`,
        explanation: 'Rust 的 if 作为表达式赋值时，所有分支必须返回相同类型。Python 无此限制。',
      },
      c_to_java: {
        description: 'C 中可用整数做条件，Java 中 if(0) 或 if(1) 是编译错误',
        severity: 'high',
        example_wrong: `if (1) { ... }  // Java: 编译错误`,
        example_correct: `if (true) { ... }`,
        explanation: 'Java 条件必须是 boolean，C 将非零整数视为真。这是类型安全的增强。',
      },
      java_to_python: {
        description: 'Java 习惯加花括号和括号，Python 中括号多余且花括号不存在',
        severity: 'low',
        example_wrong: `if (score >= 90) { grade = 'A' }  // Python: 语法错误`,
        example_correct: `if score >= 90:\n    grade = 'A'`,
        explanation: 'Python 条件不需要括号，分支体用缩进而非花括号。',
      },
      c_to_rust: {
        description: 'C 中 if 是语句不能赋值，Rust 中 if 是表达式可以直接赋值',
        severity: 'medium',
        example_wrong: `let x = if cond { 42; } else { 0; };  // 分支末尾分号导致返回空`,
        example_correct: `let x = if cond { 42 } else { 0 };`,
        explanation: 'Rust 分支末尾加分号会使表达式变为语句，返回 () 而非预期值。',
      },
    },
    positive_transfers: {
      c_to_java: {
        description: 'if/else/else if 基本语法结构几乎一致',
        strength: 'high',
        note: '花括号、括号用法相同，仅条件类型限制不同。',
      },
      python_to_rust: {
        description: '两者都没有三元运算符（Python 用 if/else 表达式，Rust 用 if 表达式）',
        strength: 'medium',
        note: 'Python 的 x if cond else y 对应 Rust 的 if cond { x } else { y }。',
      },
    },
    dependencies: [
      { id: 'expressions_basic', type: 'prerequisite', strength: 0.9 },
      { id: 'conditional_keywords', type: 'prerequisite', strength: 0.9 },
      { id: 'basic_operators', type: 'prerequisite', strength: 0.7 },
    ],
    related: [
      { id: 'pattern_matching', type: 'related', strength: 0.8 },
      { id: 'control_flow_loop_for', type: 'related', strength: 0.6 },
    ],
    contrasts: [],
    semantic_tests: [
      {
        id: 'cf_cond_01',
        type: 'select_output',
        question: '以下 Rust 代码的 grade 值是什么？\nlet score = 75;\nlet grade = if score >= 90 { "A" } else if score >= 80 { "B" } else { "C" };',
        correct_answer: '"C"',
        options: ['"A"', '"B"', '"C"', '编译错误'],
        language_context: 'rust',
        difficulty: 3,
        trap_note: 'Rust if 是表达式，可直接赋值；score=75 满足 else 分支。',
      },
      {
        id: 'cf_cond_02',
        type: 'select_output',
        question: '以下 C 代码的输出是什么？\nint x = 0;\nif (x)\n    printf("yes");\nelse\n    printf("no");',
        correct_answer: 'no',
        options: ['yes', 'no', '编译错误', '无输出'],
        language_context: 'c',
        difficulty: 3,
        trap_note: 'C 中 0 为假，非零为真。Java 开发者可能误以为编译错误。',
      },
      {
        id: 'cf_cond_03',
        type: 'identify_equivalent',
        question: "Python 的 `grade = 'A' if score >= 90 else 'B'` 在 Rust 中最等价的写法是？",
        correct_answer: 'let grade = if score >= 90 { "A" } else { "B" };',
        options: [
          'let grade = score >= 90 ? "A" : "B";',
          'let grade = if score >= 90 { "A" } else { "B" };',
          'if score >= 90 { let grade = "A"; } else { let grade = "B"; }',
          'let grade = match score >= 90 { true => "A", false => "B" };',
        ],
        language_context: 'rust',
        difficulty: 3,
        trap_note: 'Rust 没有三元运算符，if 表达式是等价替代。',
      },
    ],
  },

  // ────────────────────────────────────────────────────────
  // 2. control_flow_loop_for — for loops
  // ────────────────────────────────────────────────────────
  {
    id: 'control_flow_loop_for',
    name: 'for 循环',
    name_en: 'For Loop',
    description: '以确定次数或遍历集合的方式重复执行代码块，是最常用的迭代构造。',
    description_en: 'Repeat a code block a determined number of times or by iterating over a collection — the most common iteration construct.',
    layer: 'syntax',
    layer_position: 2,
    paradigm_tags: ['procedural', 'oop', 'functional'],
    difficulty: 3,
    new_concept_count: 3,
    expressions: {
      python: {
        code: `for i in range(5):
    print(i)`,
        explanation: 'Python 的 for 是遍历式循环，range() 生成迭代器，没有 C 风格的三段式 for。',
        paradigm: 'procedural',
        equivalent_expressions: ['while 循环', '列表推导式'],
        layer_note: 'Python for 遍历任意可迭代对象，更接近 foreach 概念。',
        highlight_tokens: ['for', 'in', 'range'],
        output: null,
      },
      c: {
        code: `for (int i = 0; i < 5; i++) {
    printf("%d\\n", i);
}`,
        explanation: 'C 的 for 是经典三段式：初始化、条件、递增，全部在头部声明。',
        paradigm: 'procedural',
        equivalent_expressions: ['while 循环', 'do-while'],
        layer_note: '三段任意可省略：for(;;) 是无限循环的标准写法。',
        highlight_tokens: ['for', 'int', 'i++'],
        output: null,
      },
      java: {
        code: `for (int i = 0; i < 5; i++) {
    System.out.println(i);
}

// 增强 for (foreach)
int[] nums = {0, 1, 2, 3, 4};
for (int n : nums) {
    System.out.println(n);
}`,
        explanation: 'Java 有经典三段式 for 和增强 for（foreach），后者遍历数组或 Iterable。',
        paradigm: 'oop',
        equivalent_expressions: ['while 循环', 'Stream.forEach'],
        layer_note: '增强 for 不能修改集合，不能获取索引。',
        highlight_tokens: ['for', 'int', 'i++', ':'],
        output: null,
      },
      rust: {
        code: `for i in 0..5 {
    println!("{}", i);
}`,
        explanation: 'Rust 的 for 遍历迭代器，0..5 是 Range 表达式，没有 C 风格三段式。',
        paradigm: 'functional',
        equivalent_expressions: ['while 循环', '迭代器方法 .iter()'],
        layer_note: 'Rust 没有 C 风格 for，所有循环基于迭代器，0..5 是半开区间 [0,5)。',
        highlight_tokens: ['for', 'in', '..'],
        output: null,
      },
    },
    traps: {
      python_to_c: {
        description: 'Python range(N) 对应 C 的 for(i=0; i<N; i++)，不是 for(i=0; i<=N; i++)',
        severity: 'high',
        example_wrong: `for (int i = 0; i <= 5; i++) { ... }  // 6 次，不是 5 次`,
        example_correct: `for (int i = 0; i < 5; i++) { ... }  // 5 次`,
        explanation: 'range(5) 和 0..5 都是半开区间，包含 0 到 4。C 的 <= 会多执行一次。',
      },
      c_to_python: {
        description: 'C 开发者想写三段式 for 但 Python 没有此语法',
        severity: 'high',
        example_wrong: `for (i = 0; i < 5; i++):  # Python: 语法错误`,
        example_correct: `for i in range(5):`,
        explanation: 'Python for 必须配合可迭代对象。若需索引，用 range() 或 enumerate()。',
      },
      python_to_rust: {
        description: 'Rust 的 range 是半开区间，0..5 不包含 5；0..=5 包含 5',
        severity: 'medium',
        example_wrong: `for i in 0..=5 { ... }  // 6 次，等同 range(6)`,
        example_correct: `for i in 0..5 { ... }  // 5 次，等同 range(5)`,
        explanation: 'Rust 的 ..= 是闭区间，.. 是半开区间。Python range() 始终是半开区间。',
      },
      c_to_java: {
        description: 'C 允许 for 内不同类型混合，Java 初始化和条件类型须一致',
        severity: 'low',
        example_wrong: `for (long i = 0; i < 5; i++) { byte b = (byte)i; }  // 可能溢出`,
        example_correct: `for (int i = 0; i < 5; i++) { ... }`,
        explanation: 'Java for 循环变量类型与条件比较应匹配，避免隐式窄化转换。',
      },
    },
    positive_transfers: {
      python_to_rust: {
        description: '两者都使用 for-in 遍历式循环，语义高度一致',
        strength: 'high',
        note: 'Python 的 for i in range(5) 对应 Rust 的 for i in 0..5。',
      },
      c_to_java: {
        description: '经典三段式 for 语法完全相同',
        strength: 'high',
        note: '初始化、条件、递增三段写法一致，包括增强 for 也类似 Python foreach。',
      },
    },
    dependencies: [
      { id: 'loop_keywords', type: 'prerequisite', strength: 0.9 },
      { id: 'expressions_basic', type: 'prerequisite', strength: 0.8 },
      { id: 'control_flow_conditional', type: 'related', strength: 0.6 },
    ],
    related: [
      { id: 'control_flow_loop_while', type: 'related', strength: 0.8 },
      { id: 'function_call', type: 'contrast', strength: 0.5 },
    ],
    contrasts: [
      { id: 'control_flow_loop_while', type: 'contrast', strength: 0.8 },
    ],
    semantic_tests: [
      {
        id: 'cf_for_01',
        type: 'select_output',
        question: '以下 Python 代码输出什么？\nfor i in range(3):\n    print(i)',
        correct_answer: '0 1 2',
        options: ['1 2 3', '0 1 2', '0 1 2 3', '1 2'],
        language_context: 'python',
        difficulty: 3,
        trap_note: 'range(3) 是半开区间 [0,3)，输出 0,1,2。',
      },
      {
        id: 'cf_for_02',
        type: 'select_output',
        question: '以下 Rust 代码输出什么？\nfor i in 0..3 {\n    println!("{}", i);\n}',
        correct_answer: '0 1 2',
        options: ['1 2 3', '0 1 2', '0 1 2 3', '1 2'],
        language_context: 'rust',
        difficulty: 3,
        trap_note: '0..3 是半开区间 [0,3)，与 range(3) 一致。',
      },
      {
        id: 'cf_for_03',
        type: 'identify_equivalent',
        question: 'C 的 `for (int i = 0; i < 5; i++)` 在 Python 中最等价的写法是？',
        correct_answer: 'for i in range(5)',
        options: [
          'for i in range(5)',
          'for i in range(0, 5, 1)',
          'for (i = 0; i < 5; i++)',
          'while i < 5: i += 1',
        ],
        language_context: 'python',
        difficulty: 3,
        trap_note: 'range(5) 和 range(0,5,1) 都正确，但 range(5) 是最简洁等价。',
      },
    ],
  },

  // ────────────────────────────────────────────────────────
  // 3. control_flow_loop_while — while loops
  // ────────────────────────────────────────────────────────
  {
    id: 'control_flow_loop_while',
    name: 'while 循环',
    name_en: 'While Loop',
    description: '在条件为真时持续执行代码块，适用于迭代次数未知的场景。',
    description_en: 'Continuously execute a code block while the condition remains true — suitable for scenarios with unknown iteration count.',
    layer: 'syntax',
    layer_position: 3,
    paradigm_tags: ['procedural', 'oop', 'functional'],
    difficulty: 3,
    new_concept_count: 2,
    expressions: {
      python: {
        code: `count = 0
while count < 5:
    print(count)
    count += 1`,
        explanation: 'Python while 检查条件后执行缩进块，无限循环用 while True。',
        paradigm: 'procedural',
        equivalent_expressions: ['for 循环 (已知次数)', '递归'],
        layer_note: 'while True: 是 Python 无限循环的标准写法。',
        highlight_tokens: ['while', 'True'],
        output: null,
      },
      c: {
        code: `int count = 0;
while (count < 5) {
    printf("%d\\n", count);
    count++;
}`,
        explanation: 'C while 先检查条件再执行体，do-while 先执行再检查（至少执行一次）。',
        paradigm: 'procedural',
        equivalent_expressions: ['for 循环', 'do-while'],
        layer_note: 'C 有 do-while，Python 和 Rust 没有。do-while 保证至少执行一次。',
        highlight_tokens: ['while', 'do', 'while'],
        output: null,
      },
      java: {
        code: `int count = 0;
while (count < 5) {
    System.out.println(count);
    count++;
}`,
        explanation: 'Java while 与 C 相同，条件必须为 boolean，也有 do-while。',
        paradigm: 'oop',
        equivalent_expressions: ['for 循环', 'do-while'],
        layer_note: 'Java do-while 的条件也必须是 boolean，与 C 的整数条件不同。',
        highlight_tokens: ['while', 'do', 'while'],
        output: null,
      },
      rust: {
        code: `let mut count = 0;
while count < 5 {
    println!("{}", count);
    count += 1;
}`,
        explanation: 'Rust while 条件不用括号，循环变量必须声明为 mut，没有 do-while。',
        paradigm: 'functional',
        equivalent_expressions: ['for 循环', 'loop + break'],
        layer_note: 'Rust 的 loop 是无限循环，配合 break 条件退出，替代 do-while。',
        highlight_tokens: ['while', 'mut', 'loop'],
        output: null,
      },
    },
    traps: {
      c_to_python: {
        description: 'C 的 do-while 在 Python 中不存在，需用 while True + break 模拟',
        severity: 'medium',
        example_wrong: `do:\n    action()\nwhile condition  # Python: 语法错误`,
        example_correct: `while True:\n    action()\n    if not condition:\n        break`,
        explanation: 'Python 没有 do-while。需用 while True 配合条件 break 模拟先执行后检查。',
      },
      c_to_rust: {
        description: 'Rust 没有 do-while，用 loop + break 条件替代',
        severity: 'medium',
        example_wrong: `do {\n    action();\n} while condition;  // Rust: 不存在`,
        example_correct: `loop {\n    action();\n    if !condition { break; }\n}`,
        explanation: 'Rust 用 loop 关键字创建无限循环，配合 break 实现条件退出。',
      },
      java_to_c: {
        description: 'Java do-while 条件必须是 boolean，C 可以用整数',
        severity: 'low',
        example_wrong: `do { ... } while (1);  // Java: 编译错误`,
        example_correct: `do { ... } while (true);`,
        explanation: 'Java 条件严格 boolean，C 可用非零整数。',
      },
      python_to_c: {
        description: 'Python while 条件不用括号，C 必须用括号',
        severity: 'low',
        example_wrong: `while count < 5  // C: 语法错误，缺少括号`,
        example_correct: `while (count < 5)`,
        explanation: 'C 的 while 条件必须包裹在括号中。',
      },
    },
    positive_transfers: {
      c_to_java: {
        description: 'while 和 do-while 语法结构完全一致',
        strength: 'high',
        note: '仅条件类型限制不同（boolean vs 整数）。',
      },
      python_to_rust: {
        description: '两者 while 语义相同：条件为真则继续循环',
        strength: 'medium',
        note: 'Rust 需要 mut 标注可变变量，Python 无此要求。',
      },
    },
    dependencies: [
      { id: 'loop_keywords', type: 'prerequisite', strength: 0.9 },
      { id: 'control_flow_conditional', type: 'prerequisite', strength: 0.7 },
      { id: 'variable_declaration', type: 'prerequisite', strength: 0.8 },
    ],
    related: [
      { id: 'control_flow_loop_for', type: 'related', strength: 0.8 },
    ],
    contrasts: [
      { id: 'control_flow_loop_for', type: 'contrast', strength: 0.8 },
    ],
    semantic_tests: [
      {
        id: 'cf_while_01',
        type: 'select_output',
        question: '以下 Python 代码输出什么？\ncount = 0\nwhile count < 3:\n    print(count)\n    count += 1',
        correct_answer: '0 1 2',
        options: ['0 1 2', '1 2 3', '0 1 2 3', '0'],
        language_context: 'python',
        difficulty: 3,
      },
      {
        id: 'cf_while_02',
        type: 'select_output',
        question: '以下 Rust 代码的 count 最终值是多少？\nlet mut count = 0;\nwhile count < 3 {\n    count += 1;\n}',
        correct_answer: '3',
        options: ['2', '3', '4', '编译错误'],
        language_context: 'rust',
        difficulty: 3,
        trap_note: '循环在 count=3 时条件为假退出，最终值为 3。',
      },
      {
        id: 'cf_while_03',
        type: 'identify_equivalent',
        question: 'C 的 `do { action(); } while (cond);` 在 Python 中最等价的写法是？',
        correct_answer: 'while True:\n    action()\n    if not cond:\n        break',
        options: [
          'while cond:\n    action()',
          'while True:\n    action()\n    if not cond:\n        break',
          'for _ in range(1):\n    action()',
          'action()\nwhile cond:\n    action()',
        ],
        language_context: 'python',
        difficulty: 3,
        trap_note: 'do-while 保证至少执行一次，while True + break 模拟此语义。',
      },
    ],
  },

  // ────────────────────────────────────────────────────────
  // 4. function_definition — Defining named functions
  // ────────────────────────────────────────────────────────
  {
    id: 'function_definition',
    name: '函数定义',
    name_en: 'Function Definition',
    description: '创建命名的可复用代码单元，接受输入、执行逻辑、返回结果，是程序模块化的基础。',
    description_en: 'Create named reusable code units that accept input, execute logic, and return results — the foundation of program modularity.',
    layer: 'syntax',
    layer_position: 4,
    paradigm_tags: ['procedural', 'oop', 'functional'],
    difficulty: 3,
    new_concept_count: 4,
    expressions: {
      python: {
        code: `def greet(name):
    return f"Hello, {name}!"

result = greet("World")`,
        explanation: 'Python 用 def 关键字定义函数，缩进界定函数体，无需声明返回类型。',
        paradigm: 'procedural',
        equivalent_expressions: ['lambda 表达式 (匿名)', '类方法'],
        layer_note: 'Python 函数是一等公民，可赋值、传递、嵌套定义。',
        highlight_tokens: ['def', 'return', 'f'],
        output: null,
      },
      c: {
        code: `char* greet(const char* name) {
    static char buf[64];
    snprintf(buf, 64, "Hello, %s!", name);
    return buf;
}

char* result = greet("World");`,
        explanation: 'C 函数需声明返回类型和参数类型，花括号界定函数体，没有自动内存管理。',
        paradigm: 'procedural',
        equivalent_expressions: ['函数指针', '宏 (伪函数)'],
        layer_note: 'C 函数不能嵌套定义（标准 C），返回局部数组地址是未定义行为。',
        highlight_tokens: ['char*', 'return', 'static'],
        output: null,
      },
      java: {
        code: `public class App {
    static String greet(String name) {
        return String.format("Hello, %s!", name);
    }

    public static void main(String[] args) {
        String result = greet("World");
    }
}`,
        explanation: 'Java 没有独立函数，只有类中的方法。static 方法接近独立函数的概念。',
        paradigm: 'oop',
        equivalent_expressions: ['lambda (Java 8+)', '实例方法'],
        layer_note: 'Java 一切皆方法，static 方法是"函数"的最近等价。',
        highlight_tokens: ['static', 'return', 'class'],
        output: null,
      },
      rust: {
        code: `fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

let result = greet("World");`,
        explanation: 'Rust 用 fn 关键字，参数必须标注类型，返回类型用 -> 指定，末尾表达式可省略 return。',
        paradigm: 'functional',
        equivalent_expressions: ['闭包 (匿名函数)', '关联函数 (类似 static)'],
        layer_note: 'Rust 函数体末尾表达式自动返回，无需 return 关键字。',
        highlight_tokens: ['fn', '->', '&str', 'String'],
        output: null,
      },
    },
    traps: {
      python_to_c: {
        description: 'Python 函数默认返回 None，C 函数声明 void 时不返回值但非 void 必须返回',
        severity: 'high',
        example_wrong: `int compute() {\n    // 忘记 return\n}  // 未定义行为`,
        example_correct: `int compute() {\n    return 42;\n}`,
        explanation: 'C 非 void 函数缺少 return 是未定义行为；Python 默认返回 None。',
      },
      python_to_java: {
        description: 'Python 有独立函数，Java 函数必须存在于类中',
        severity: 'high',
        example_wrong: `String greet(String name) { return "Hi"; }  // Java: 不能独立存在`,
        example_correct: `public class App {\n    static String greet(String name) { return "Hi"; }\n}`,
        explanation: 'Java 所有函数都是类的方法。static 方法最接近独立函数。',
      },
      python_to_rust: {
        description: 'Rust 函数参数必须标注类型，Python 不需要',
        severity: 'medium',
        example_wrong: `fn greet(name) { ... }  // Rust: 缺少类型标注`,
        example_correct: `fn greet(name: &str) -> String { ... }`,
        explanation: 'Rust 是显式类型语言，函数参数和返回值必须标注类型。',
      },
      c_to_rust: {
        description: 'C 用花括号包裹返回值，Rust 可省略 return 用末尾表达式',
        severity: 'medium',
        example_wrong: `fn add(a: i32, b: i32) -> i32 {\n    a + b;  // 分号使表达式变为语句，返回 ()`,
        example_correct: `fn add(a: i32, b: i32) -> i32 {\n    a + b  // 无分号，表达式自动返回`,
        explanation: 'Rust 末尾表达式无分号自动返回；加分号变为语句返回空元组 ()。',
      },
      java_to_python: {
        description: 'Java 方法必须声明返回类型，Python 函数不声明',
        severity: 'low',
        example_wrong: `def int greet(name):  // Python: 语法错误`,
        example_correct: `def greet(name):`,
        explanation: 'Python 用类型提示而非强制类型声明：def greet(name: str) -> str',
      },
    },
    positive_transfers: {
      c_to_java: {
        description: '函数/方法签名结构相似：返回类型 + 名称 + 参数列表',
        strength: 'high',
        note: 'Java 增加 static 和访问修饰符，但核心签名格式相同。',
      },
      c_to_rust: {
        description: '函数定义格式类似：返回类型在 -> 之后，参数标注类型',
        strength: 'medium',
        note: 'Rust 用 fn 代替函数名前的类型声明，-> 代替返回类型前置。',
      },
    },
    dependencies: [
      { id: 'function_call', type: 'prerequisite', strength: 1.0 },
      { id: 'expressions_basic', type: 'prerequisite', strength: 0.8 },
      { id: 'type_annotation', type: 'related', strength: 0.7 },
    ],
    related: [
      { id: 'function_parameters', type: 'compose', strength: 0.9 },
      { id: 'return_values', type: 'compose', strength: 0.8 },
    ],
    contrasts: [],
    semantic_tests: [
      {
        id: 'fn_def_01',
        type: 'select_output',
        question: '以下 Rust 函数返回什么值？\nfn add(a: i32, b: i32) -> i32 {\n    a + b\n}\n\nlet result = add(3, 4);',
        correct_answer: '7',
        options: ['7', '(3, 4)', '编译错误', '()'],
        language_context: 'rust',
        difficulty: 3,
        trap_note: '末尾表达式 a + b 无分号，自动返回计算结果 7。',
      },
      {
        id: 'fn_def_02',
        type: 'select_output',
        question: '以下 Rust 函数返回什么？\nfn add(a: i32, b: i32) -> i32 {\n    a + b;\n}',
        correct_answer: '编译错误',
        options: ['7', '0', '()', '编译错误'],
        language_context: 'rust',
        difficulty: 3,
        trap_note: '末尾加分号使 a+b 变为语句，返回 () 而非 i32，类型不匹配导致编译错误。',
      },
      {
        id: 'fn_def_03',
        type: 'identify_equivalent',
        question: 'Python 的 `def greet(name): return f"Hello, {name}"` 在 Java 中最等价的写法是？',
        correct_answer: 'static String greet(String name) { return String.format("Hello, %s", name); }',
        options: [
          'String greet(name) { return "Hello, " + name; }',
          'static String greet(String name) { return String.format("Hello, %s", name); }',
          'def greet(String name) { ... }',
          'public greet(name) { return "Hello, " + name; }',
        ],
        language_context: 'java',
        difficulty: 3,
        trap_note: 'Java 函数必须是类中的 static 方法，参数和返回类型必须声明。',
      },
    ],
  },

  // ────────────────────────────────────────────────────────
  // 5. function_parameters — Parameters, defaults, variadic
  // ────────────────────────────────────────────────────────
  {
    id: 'function_parameters',
    name: '函数参数',
    name_en: 'Function Parameters',
    description: '定义函数接受的输入形式：位置参数、默认参数、可变参数，决定函数的调用灵活性。',
    description_en: 'Define the input forms a function accepts: positional parameters, defaults, variadic arguments — determining call flexibility.',
    layer: 'syntax',
    layer_position: 5,
    paradigm_tags: ['procedural', 'oop', 'functional'],
    difficulty: 3,
    new_concept_count: 4,
    expressions: {
      python: {
        code: `def connect(host, port=8080, *args, **kwargs):
    print(f"Connecting to {host}:{port}")
    if args:
        print(f"Extra positional: {args}")
    if kwargs:
        print(f"Extra keyword: {kwargs}")`,
        explanation: 'Python 支持位置参数、默认值、*args 可变位置、**kwargs 可变关键字，极为灵活。',
        paradigm: 'procedural',
        equivalent_expressions: ['lambda 参数', '偏函数 partial'],
        layer_note: 'Python 参数顺序规则：位置 → 默认 → *args → 关键字 → **kwargs。',
        highlight_tokens: ['port=8080', '*args', '**kwargs'],
        output: null,
      },
      c: {
        code: `void connect(const char* host, int port) {
    printf("Connecting to %s:%d\\n", host, port);
}

// 可变参数
#include <stdarg.h>
void log_msg(const char* fmt, ...) {
    va_list ap;
    va_start(ap, fmt);
    vprintf(fmt, ap);
    va_end(ap);
}`,
        explanation: 'C 参数只有位置参数，无默认值；可变参数用 va_list 处理，但无法类型检查。',
        paradigm: 'procedural',
        equivalent_expressions: ['宏模拟默认参数', '结构体封装多参数'],
        layer_note: 'C 没有默认参数（C99），可变参数需 <stdarg.h>，无法自动检查类型。',
        highlight_tokens: ['va_list', 'va_start', 'va_end', '...'],
        output: null,
      },
      java: {
        code: `static String connect(String host, int port) {
    return String.format("Connecting to %s:%d", host, port);
}

// 可变参数 (varargs)
static int sum(int... nums) {
    int total = 0;
    for (int n : nums) { total += n; }
    return total;
}`,
        explanation: 'Java 方法参数无默认值；可变参数用 类型... 语法，本质是数组。',
        paradigm: 'oop',
        equivalent_expressions: ['方法重载模拟默认参数', 'Builder 模式'],
        layer_note: 'Java 用方法重载模拟默认参数，varargs 只能出现在参数列表末尾。',
        highlight_tokens: ['int...', 'sum'],
        output: null,
      },
      rust: {
        code: `fn connect(host: &str, port: u16) -> String {
    format!("Connecting to {}:{}", host, port)
}

// Rust 没有默认参数和可变参数
// 用 Option 模拟默认值，用泛型或切片模拟可变
fn greet(name: Option<&str>) -> String {
    match name {
        Some(n) => format!("Hello, {}!", n),
        None => "Hello, World!".to_string(),
    }
}`,
        explanation: 'Rust 没有默认参数和可变参数。用 Option 模拟默认值，切片或泛型模拟可变参数。',
        paradigm: 'functional',
        equivalent_expressions: ['Option 模拟默认', '切片 &[T] 模拟可变'],
        layer_note: 'Rust 的设计哲学拒绝隐式灵活，偏好显式构造。',
        highlight_tokens: ['Option', 'Some', 'None', '&str'],
        output: null,
      },
    },
    traps: {
      python_to_c: {
        description: 'Python 有默认参数，C 完全没有默认参数机制',
        severity: 'high',
        example_wrong: `void connect(const char* host, int port = 8080)  // C: 不支持`,
        example_correct: `void connect_default(const char* host) {\n    connect(host, 8080);\n}`,
        explanation: 'C 没有默认参数。C23 引入了部分支持，但传统 C 需用包装函数或宏模拟。',
      },
      python_to_java: {
        description: 'Python 有 **kwargs，Java 的 varargs 只接受同类型可变位置参数',
        severity: 'medium',
        example_wrong: `static void connect(String host, Object... kwargs)  // 无法按名传递`,
        example_correct: `// 用方法重载或 Builder 模式替代`,
        explanation: 'Java varargs 是类型化的可变位置参数，不支持关键字传递。Python kwargs 更灵活。',
      },
      python_to_rust: {
        description: 'Python 有默认参数和可变参数，Rust 两者都没有',
        severity: 'high',
        example_wrong: `fn connect(host: &str, port: u16 = 8080)  // Rust: 不支持默认参数`,
        example_correct: `fn connect(host: &str, port: Option<u16>) -> String {\n    let p = port.unwrap_or(8080);\n    format!("{}:{}", host, p)\n}`,
        explanation: 'Rust 用 Option + unwrap_or 模拟默认值，用切片 &[T] 或泛型模拟可变参数。',
      },
      java_to_python: {
        description: 'Java varargs 语法 int... 在 Python 中不存在，Python 用 *args',
        severity: 'low',
        example_wrong: `def sum(int... nums):  // Python: 语法错误`,
        example_correct: `def sum(*nums):`,
        explanation: 'Python 可变参数用 *args（位置）和 **kwargs（关键字），无类型声明。',
      },
    },
    positive_transfers: {
      c_to_java: {
        description: 'varargs 机制概念相似：.../va_list vs 类型...',
        strength: 'low',
        note: 'Java varargs 更安全（有类型），C 的 va_list 无类型检查。',
      },
      java_to_rust: {
        description: '两者都不支持默认参数，需用其他机制模拟',
        strength: 'medium',
        note: 'Java 用重载，Rust 用 Option/Default trait，思路一致。',
      },
    },
    dependencies: [
      { id: 'function_definition', type: 'prerequisite', strength: 0.9 },
      { id: 'type_annotation', type: 'prerequisite', strength: 0.7 },
    ],
    related: [
      { id: 'return_values', type: 'compose', strength: 0.8 },
      { id: 'scope_block', type: 'related', strength: 0.5 },
    ],
    contrasts: [],
    semantic_tests: [
      {
        id: 'fn_param_01',
        type: 'select_output',
        question: '以下 Python 代码输出什么？\ndef f(a, b=10, *args):\n    print(a, b, args)\n\nf(1, 2, 3, 4)',
        correct_answer: '1 2 (3, 4)',
        options: ['1 10 (2, 3, 4)', '1 2 (3, 4)', '1 2 3 4', '1 10 ()'],
        language_context: 'python',
        difficulty: 3,
        trap_note: 'b=10 被 2 覆盖，3,4 进入 *args 元组。',
      },
      {
        id: 'fn_param_02',
        type: 'select_output',
        question: '以下 Rust 代码 greet(None) 返回什么？\nfn greet(name: Option<&str>) -> String {\n    match name {\n        Some(n) => format!("Hello, {}!", n),\n        None => "Hello, World!".to_string(),\n    }\n}',
        correct_answer: '"Hello, World!"',
        options: ['"Hello, None!"', '"Hello, World!"', '"Hello, !"', '编译错误'],
        language_context: 'rust',
        difficulty: 3,
        trap_note: 'Option 模拟默认参数：None 走默认路径。',
      },
      {
        id: 'fn_param_03',
        type: 'identify_equivalent',
        question: 'Python 的 `def connect(host, port=8080)` 在 Rust 中最等价的写法是？',
        correct_answer: 'fn connect(host: &str, port: Option<u16>) -> String { let p = port.unwrap_or(8080); ... }',
        options: [
          'fn connect(host: &str, port: u16 = 8080)',
          'fn connect(host: &str, port: Option<u16>) -> String { let p = port.unwrap_or(8080); ... }',
          'fn connect(host: &str) -> String { ... }  // 只传 host',
          'fn connect(host: &str, port: u16) -> String { ... }  // 无默认',
        ],
        language_context: 'rust',
        difficulty: 3,
        trap_note: 'Rust 不支持默认参数，Option + unwrap_or 是标准替代模式。',
      },
    ],
  },

  // ────────────────────────────────────────────────────────
  // 6. return_values — Return statements, multiple returns
  // ────────────────────────────────────────────────────────
  {
    id: 'return_values',
    name: '返回值',
    name_en: 'Return Values',
    description: '函数向调用者传递结果的方式：单返回、多返回、隐式返回，以及无返回值的情况。',
    description_en: 'How functions communicate results to callers: single return, multiple returns, implicit return, and no-return cases.',
    layer: 'syntax',
    layer_position: 6,
    paradigm_tags: ['procedural', 'oop', 'functional'],
    difficulty: 3,
    new_concept_count: 3,
    expressions: {
      python: {
        code: `def divmod(a, b):
    return a // b, a % b

quotient, remainder = divmod(17, 5)
print(quotient, remainder)  # 3 2`,
        explanation: 'Python 可返回多个值（实际是元组），调用方用多元赋值解包。',
        paradigm: 'procedural',
        equivalent_expressions: ['元组自动打包', '列表返回'],
        layer_note: 'Python 多返回本质是元组打包+解包，不是真正的多返回类型。',
        highlight_tokens: ['return', '//', '%'],
        output: null,
      },
      c: {
        code: `// 单返回值
int quotient(int a, int b) { return a / b; }

// 模拟多返回：通过指针参数输出
void divmod(int a, int b, int* q, int* r) {
    *q = a / b;
    *r = a % b;
}

int q, r;
divmod(17, 5, &q, &r);`,
        explanation: 'C 只能返回单值。多返回需通过指针参数输出或结构体打包。',
        paradigm: 'procedural',
        equivalent_expressions: ['指针输出参数', '结构体返回'],
        layer_note: 'C 通过指针参数输出多值是常见模式，但需调用方预先分配内存。',
        highlight_tokens: ['return', '*q', '&q'],
        output: null,
      },
      java: {
        code: `// 单返回值
static int quotient(int a, int b) { return a / b; }

// 多返回：用数组或自定义类
static int[] divmod(int a, int b) {
    return new int[]{ a / b, a % b };
}

int[] result = divmod(17, 5);`,
        explanation: 'Java 只能返回单值。多返回用数组或自定义对象（record 更优雅）。',
        paradigm: 'oop',
        equivalent_expressions: ['数组打包', 'Record 类 (Java 16+)'],
        layer_note: 'Java 16+ 可用 record 简化多值返回：record DivMod(int q, int r) {}。',
        highlight_tokens: ['return', 'new int[]'],
        output: null,
      },
      rust: {
        code: `// 元组返回多值
fn divmod(a: i32, b: i32) -> (i32, i32) {
    (a / b, a % b)
}

let (quotient, remainder) = divmod(17, 5);
println!("{} {}", quotient, remainder);`,
        explanation: 'Rust 用元组原生支持多返回值，解包语法与 Python 类似。',
        paradigm: 'functional',
        equivalent_expressions: ['元组', '结构体返回', 'Result<T,E> 返回'],
        layer_note: 'Rust 元组返回是类型安全的，各位置类型明确。',
        highlight_tokens: ['->', '(i32, i32)', 'let (q, r)'],
        output: null,
      },
    },
    traps: {
      python_to_c: {
        description: 'Python 可直接返回多值，C 必须通过指针参数或结构体模拟',
        severity: 'high',
        example_wrong: `int, int divmod(int a, int b)  // C: 不支持多返回类型`,
        example_correct: `void divmod(int a, int b, int* q, int* r)`,
        explanation: 'C 不支持多返回值类型声明。需用输出指针参数或结构体打包。',
      },
      python_to_rust: {
        description: 'Python 多返回是隐式元组打包，Rust 必须显式声明元组返回类型',
        severity: 'medium',
        example_wrong: `fn divmod(a: i32, b: i32) {\n    (a / b, a % b)  // 缺少返回类型标注`,
        example_correct: `fn divmod(a: i32, b: i32) -> (i32, i32) {\n    (a / b, a % b)\n}`,
        explanation: 'Rust 函数返回元组需显式标注 -> (i32, i32)，Python 自动打包。',
      },
      c_to_python: {
        description: 'C 的指针输出参数模式在 Python 中不需要，直接返回元组即可',
        severity: 'low',
        example_wrong: `def divmod(a, b, q_out, r_out):  # 不必要的指针模拟`,
        example_correct: `def divmod(a, b):\n    return a // b, a % b`,
        explanation: 'Python 直接返回多值更简洁，不需要模拟 C 的指针输出模式。',
      },
      python_to_java: {
        description: 'Python 多返回用元组，Java 需用数组或自定义类',
        severity: 'medium',
        example_wrong: `static (int, int) divmod(int a, int b)  // Java: 不支持元组返回类型`,
        example_correct: `static int[] divmod(int a, int b) {\n    return new int[]{ a/b, a%b };\n}`,
        explanation: 'Java 没有元组类型（标准库），多返回需数组或自定义 record/类。',
      },
    },
    positive_transfers: {
      python_to_rust: {
        description: '元组返回+解包的语义和语法高度一致',
        strength: 'high',
        note: 'Python 的 return a,b + q,r = f() 对应 Rust 的 (a,b) + let (q,r) = f()。',
      },
      c_to_java: {
        description: '单返回值机制完全相同',
        strength: 'high',
        note: 'return 语句语法一致，多返回都用辅助结构。',
      },
    },
    dependencies: [
      { id: 'function_parameters', type: 'prerequisite', strength: 0.8 },
      { id: 'function_definition', type: 'prerequisite', strength: 0.9 },
      { id: 'expressions_basic', type: 'prerequisite', strength: 0.7 },
    ],
    related: [
      { id: 'function_definition', type: 'compose', strength: 0.8 },
      { id: 'function_parameters', type: 'compose', strength: 0.7 },
    ],
    contrasts: [],
    semantic_tests: [
      {
        id: 'fn_ret_01',
        type: 'select_output',
        question: '以下 Python 代码输出什么？\ndef divmod(a, b):\n    return a // b, a % b\n\nq, r = divmod(17, 5)\nprint(q, r)',
        correct_answer: '3 2',
        options: ['3 2', '17 5', '(3, 2)', '2 3'],
        language_context: 'python',
        difficulty: 3,
      },
      {
        id: 'fn_ret_02',
        type: 'select_output',
        question: '以下 Rust 代码输出什么？\nfn divmod(a: i32, b: i32) -> (i32, i32) {\n    (a / b, a % b)\n}\n\nlet (q, r) = divmod(17, 5);\nprintln!("{} {}", q, r);',
        correct_answer: '3 2',
        options: ['3 2', '17 5', '(3, 2)', '编译错误'],
        language_context: 'rust',
        difficulty: 3,
        trap_note: 'Rust 元组解包与 Python 语义一致。',
      },
      {
        id: 'fn_ret_03',
        type: 'identify_equivalent',
        question: 'Python 的 `return a, b` 多返回在 C 中最等价的写法是？',
        correct_answer: 'void f(int a, int b, int* out1, int* out2) { *out1 = a; *out2 = b; }',
        options: [
          'int, int f(int a, int b) { return a, b; }',
          'void f(int a, int b, int* out1, int* out2) { *out1 = a; *out2 = b; }',
          'struct Pair f(int a, int b) { return {a, b}; }',
          'int* f(int a, int b) { int r[2] = {a, b}; return r; }',
        ],
        language_context: 'c',
        difficulty: 3,
        trap_note: 'C 不支持多返回类型。指针输出参数是最常见等价模式，结构体也可。',
      },
    ],
  },

  // ────────────────────────────────────────────────────────
  // 7. scope_block — Block scope and visibility
  // ────────────────────────────────────────────────────────
  {
    id: 'scope_block',
    name: '块作用域',
    name_en: 'Block Scope & Visibility',
    description: '变量和名称的可见范围：函数级、块级、模块级作用域，以及变量遮蔽的规则。',
    description_en: 'The visible range of variables and names: function-level, block-level, module-level scope, and variable shadowing rules.',
    layer: 'syntax',
    layer_position: 7,
    paradigm_tags: ['procedural', 'oop', 'functional'],
    difficulty: 3,
    new_concept_count: 3,
    expressions: {
      python: {
        code: `x = 10  # 全局/模块级

def f():
    x = 20  # 局部遮蔽，不影响全局
    if True:
        x = 30  # Python: 仍是函数级，不是块级！
    print(x)  # 30

f()
print(x)  # 10`,
        explanation: 'Python 作用域是函数级而非块级：if/for/while 内的赋值仍属于函数作用域。',
        paradigm: 'procedural',
        equivalent_expressions: ['LEGB 规则', 'nonlocal/global 声明'],
        layer_note: 'Python LEGB: Local → Enclosing → Global → Built-in。for 循环变量不新建作用域。',
        highlight_tokens: ['x = 10', 'x = 20', 'x = 30'],
        output: null,
      },
      c: {
        code: `int x = 10;  // 全局

void f() {
    int x = 20;  // 局部遮蔽全局
    if (1) {
        int x = 30;  // 块级遮蔽局部
        printf("%d\\n", x);  // 30
    }
    printf("%d\\n", x);  // 20
}

printf("%d\\n", x);  // 10`,
        explanation: 'C 有真正的块级作用域：花括号内声明的变量在外层不可见。',
        paradigm: 'procedural',
        equivalent_expressions: ['static 局部', 'extern 全局'],
        layer_note: 'C 的块级作用域与 Python 的函数级作用域是核心差异。',
        highlight_tokens: ['int x = 30', '{', '}'],
        output: null,
      },
      java: {
        code: `public class App {
    static int x = 10;  // 类级 (近似全局)

    static void f() {
        int x = 20;  // 方法级遮蔽
        if (true) {
            // Java: 不能在同一方法内再声明 int x = 30
            // x = 30;  // 修改方法级 x，无块级遮蔽
        }
        System.out.println(x);  // 30 (被修改了)
    }
}`,
        explanation: 'Java 方法内不能在同一局部区域重声明同名变量，没有块级新建同名变量。',
        paradigm: 'oop',
        equivalent_expressions: ['类成员作用域', '包级可见性'],
        layer_note: 'Java 禁止方法内同名变量遮蔽（不同于 C 的块级遮蔽）。',
        highlight_tokens: ['static int x', 'int x = 20'],
        output: null,
      },
      rust: {
        code: `let x = 10;  // 外层

{
    let x = 20;  // 遮蔽外层 x
    let x = 30;  // Rust 允许同一块内多次遮蔽，甚至可改类型
    println!("{}", x);  // 30
}

println!("{}", x);  // 10`,
        explanation: 'Rust 允许变量遮蔽（shadowing），甚至可改变类型，这是独特的特性。',
        paradigm: 'functional',
        equivalent_expressions: ['let 遮蔽', 'mut 可变'],
        layer_note: 'Rust shadowing 不是 mutation：let x = 30 创建新绑定，旧 x 仍在内存中直到离开作用域。',
        highlight_tokens: ['let x = 20', 'let x = 30'],
        output: null,
      },
    },
    traps: {
      python_to_c: {
        description: 'Python 作用域是函数级，C 是块级。Python if/for 内赋值对外层可见，C 不可见',
        severity: 'high',
        example_wrong: `// Python 思维: for 循环内声明的变量在外层可用\nfor (int i = 0; i < 5; i++) { ... }\nprintf("%d", i);  // C: i 已离开作用域`,
        example_correct: `int i;\nfor (i = 0; i < 5; i++) { ... }\nprintf("%d", i);  // i 在外层声明`,
        explanation: 'C 的 for(int i=...) 中 i 生命周期限于循环体。Python for i in ... 中 i 外层可见。',
      },
      python_to_rust: {
        description: 'Python 无变量遮蔽概念（同名赋值是修改），Rust 的 let 遮蔽创建新绑定',
        severity: 'medium',
        example_wrong: `let x: i32 = 10;\nlet x: &str = "hello";  // 以为在修改 x 的值`,
        example_correct: `// Rust: 这是合法遮蔽，创建了新绑定（类型可变）\nlet x: i32 = 10;\nlet x: &str = "hello";  // 新绑定，旧 i32 绑定仍存在`,
        explanation: 'Rust 遮蔽创建新绑定，旧绑定仍存在直到作用域结束。Python 同名赋值是修改同一变量。',
      },
      c_to_java: {
        description: 'C 允许块内重声明同名变量遮蔽外层，Java 方法内禁止同名重声明',
        severity: 'medium',
        example_wrong: `int x = 10;\nif (true) {\n    int x = 20;  // Java: 编译错误，不能遮蔽`,
        example_correct: `int x = 10;\nif (true) {\n    x = 20;  // 修改而非遮蔽`,
        explanation: 'Java 禁止局部变量遮蔽同方法内另一局部变量。C 允许块级遮蔽。',
      },
      java_to_python: {
        description: 'Java 禁止同名变量遮蔽，Python 没有遮蔽概念（赋值即修改或新建局部）',
        severity: 'low',
        example_wrong: `// Java 思维: 认为函数内同名赋值是遮蔽\ndef f():\n    x = 10\n    x = 20  # Python: 修改同一局部变量，不是遮蔽`,
        example_correct: `def f():\n    x = 10\n    x = 20  # 简单修改`,
        explanation: 'Python 函数内同名赋值是修改同一局部绑定，不是遮蔽。',
      },
    },
    positive_transfers: {
      c_to_rust: {
        description: '两者都有块级作用域，花括号界定作用域边界',
        strength: 'high',
        note: 'Rust 花括号内 let 创建的绑定在外层不可见，与 C 块级变量一致。',
      },
      c_to_java: {
        description: '全局/局部/块级概念框架相似',
        strength: 'medium',
        note: 'Java 用类成员替代全局，方法替代函数局部，但禁止同名遮蔽。',
      },
    },
    dependencies: [
      { id: 'variable_declaration', type: 'related', strength: 0.7 },
      { id: 'function_definition', type: 'related', strength: 0.6 },
    ],
    related: [
      { id: 'variable_declaration', type: 'related', strength: 0.7 },
      { id: 'control_flow_conditional', type: 'related', strength: 0.5 },
    ],
    contrasts: [],
    semantic_tests: [
      {
        id: 'scope_01',
        type: 'select_output',
        question: '以下 Python 代码输出什么？\nx = 10\ndef f():\n    x = 20\n    if True:\n        x = 30\n    print(x)\n\nf()\nprint(x)',
        correct_answer: '30 10',
        options: ['30 10', '20 10', '30 30', '20 20'],
        language_context: 'python',
        difficulty: 3,
        trap_note: 'Python 函数级作用域：if 块内 x=30 修改函数局部 x，不创建新作用域。',
      },
      {
        id: 'scope_02',
        type: 'select_output',
        question: '以下 Rust 代码输出什么？\nlet x = 10;\n{\n    let x = 20;\n    let x = "hi";\n    println!("{}", x);\n}\nprintln!("{}", x);',
        correct_answer: 'hi 10',
        options: ['hi 10', '20 10', 'hi hi', '编译错误'],
        language_context: 'rust',
        difficulty: 3,
        trap_note: 'Rust 遮蔽允许改类型：let x = "hi" 遮蔽了 i32 的 x。外层 x 不受影响。',
      },
      {
        id: 'scope_03',
        type: 'identify_equivalent',
        question: 'Python 的 `for i in range(5): pass; print(i)` (i 外层可见) 在 C 中最等价的做法是？',
        correct_answer: 'int i; for (i = 0; i < 5; i++) {} printf("%d", i);',
        options: [
          'for (int i = 0; i < 5; i++) {} printf("%d", i);',
          'int i; for (i = 0; i < 5; i++) {} printf("%d", i);',
          'for (i = 0; i < 5; i++) {} printf("%d", i);',
          'for (int i = 0; i < 5; i++) { int j = i; } printf("%d", j);',
        ],
        language_context: 'c',
        difficulty: 3,
        trap_note: 'for(int i=...) 中 i 作用域限于循环。需在外层声明 i 才能在循环后访问。',
      },
    ],
  },

  // ────────────────────────────────────────────────────────
  // 8. pattern_matching — match/switch expressions
  // ────────────────────────────────────────────────────────
  {
    id: 'pattern_matching',
    name: '模式匹配',
    name_en: 'Pattern Matching (match/switch)',
    description: '将值与一系列模式进行匹配并选择对应分支，是条件分支的高级进化形式。',
    description_en: 'Match a value against a series of patterns and select the corresponding branch — an evolved form of conditional branching.',
    layer: 'syntax',
    layer_position: 8,
    paradigm_tags: ['procedural', 'oop', 'functional'],
    difficulty: 3,
    new_concept_count: 4,
    expressions: {
      python: {
        code: `# Python 3.10+ match
def http_status(code):
    match code:
        case 200:
            return "OK"
        case 404:
            return "Not Found"
        case 500:
            return "Server Error"
        case _:
            return "Unknown"`,
        explanation: 'Python 3.10 引入 match-case，支持结构模式匹配，_ 是通配兜底。',
        paradigm: 'procedural',
        equivalent_expressions: ['if/elif 链', '字典映射'],
        layer_note: 'Python match 是语句而非表达式，不能直接赋值。',
        highlight_tokens: ['match', 'case', '_'],
        output: null,
      },
      c: {
        code: `const char* http_status(int code) {
    switch (code) {
        case 200: return "OK";
        case 404: return "Not Found";
        case 500: return "Server Error";
        default:  return "Unknown";
    }
}`,
        explanation: 'C 的 switch 只能匹配整数常量，必须用 break 防止贯穿，default 兜底。',
        paradigm: 'procedural',
        equivalent_expressions: ['if/else 链', '查表'],
        layer_note: 'C switch 不加 break 会贯穿到下一 case，这是经典陷阱。',
        highlight_tokens: ['switch', 'case', 'break', 'default'],
        output: null,
      },
      java: {
        code: `static String httpStatus(int code) {
    switch (code) {
        case 200: return "OK";
        case 404: return "Not Found";
        case 500: return "Server Error";
        default:  return "Unknown";
    }

    // Java 14+ switch 表达式 (无贯穿)
    String status = switch (code) {
        case 200 -> "OK";
        case 404 -> "Not Found";
        case 500 -> "Server Error";
        default  -> "Unknown";
    };
}`,
        explanation: 'Java 传统 switch 需 break，Java 14+ 引入 switch 表达式用 -> 箭头语法无贯穿。',
        paradigm: 'oop',
        equivalent_expressions: ['if/else 链', '枚举 switch'],
        layer_note: 'Java 14+ switch 表达式是表达式可赋值，箭头语法无贯穿风险。',
        highlight_tokens: ['switch', 'case', '->', 'default'],
        output: null,
      },
      rust: {
        code: `fn http_status(code: u16) -> &str {
    match code {
        200 => "OK",
        404 => "Not Found",
        500 => "Server Error",
        _    => "Unknown",
    }
}`,
        explanation: 'Rust match 是表达式可赋值，无贯穿，必须穷举所有可能（_ 兜底满足穷举）。',
        paradigm: 'functional',
        equivalent_expressions: ['if/else 链', 'lookup map'],
        layer_note: 'Rust match 穷举性是类型系统保证的，缺少 _ 会编译错误。',
        highlight_tokens: ['match', '=>', '_'],
        output: null,
      },
    },
    traps: {
      c_to_python: {
        description: 'C switch 有贯穿问题需 break，Python match-case 无贯穿',
        severity: 'high',
        example_wrong: `match code:\n    case 200:\n        return "OK"\n    case 404:  # Python: 不需要 break，不会贯穿`,
        example_correct: `// Python match-case 自动不贯穿，不需要 break`,
        explanation: 'Python match-case 不存在贯穿，不需要 break。C 开发者可能多余地加 break。',
      },
      c_to_rust: {
        description: 'C switch 有贯穿需 break，Rust match 无贯穿；C switch 不要求穷举，Rust match 必须穷举',
        severity: 'high',
        example_wrong: `match code {\n    200 => "OK",\n    404 => "Not Found"\n}  // Rust: 非穷举，编译错误`,
        example_correct: `match code {\n    200 => "OK",\n    404 => "Not Found",\n    _ => "Other"\n}`,
        explanation: 'Rust match 必须穷举所有可能值。缺少兜底分支导致编译错误。',
      },
      c_to_java: {
        description: 'C switch 可匹配整数表达式，Java 传统 switch 限制更多（枚举、String、int 等）',
        severity: 'medium',
        example_wrong: `switch (3.14) { ... }  // Java: 不能匹配浮点数`,
        example_correct: `// Java switch 只支持: byte, short, char, int, String, enum`,
        explanation: 'Java switch 支持的类型有限。C 可匹配任何整数表达式。',
      },
      python_to_rust: {
        description: 'Python match 是语句不能赋值，Rust match 是表达式可直接赋值',
        severity: 'medium',
        example_wrong: `result = match code:  # Python: 语法错误`,
        example_correct: `result = match code { 200 => "OK", _ => "Other" }  // Rust: 合法`,
        explanation: 'Rust match 是表达式，返回值可直接赋值。Python match 是语句。',
      },
      java_to_rust: {
        description: 'Java 传统 switch 需要 break，Rust match 不需要',
        severity: 'medium',
        example_wrong: `match code {\n    200 => { "OK"; break; }  // Rust: break 不用于 match`,
        example_correct: `match code {\n    200 => "OK",\n    _ => "Other"\n}`,
        explanation: 'Rust match 无贯穿，不需要 break。Java 14+ 箭头语法也无贯穿。',
      },
    },
    positive_transfers: {
      c_to_java: {
        description: 'switch/case/default 基本语法结构相同',
        strength: 'high',
        note: '关键字一致，仅类型限制和贯穿行为有差异。',
      },
      python_to_rust: {
        description: 'match + case/=> 结构概念相似，_ 通配语义一致',
        strength: 'high',
        note: 'Python case _ 和 Rust _ 都是兜底通配。',
      },
      java_to_rust: {
        description: 'Java 14+ 箭头 switch 和 Rust match 语义高度一致',
        strength: 'high',
        note: 'Java case X -> Y 和 Rust X => Y 都无贯穿、可赋值。',
      },
    },
    dependencies: [
      { id: 'control_flow_conditional', type: 'prerequisite', strength: 0.8 },
      { id: 'expressions_basic', type: 'prerequisite', strength: 0.7 },
    ],
    related: [
      { id: 'control_flow_conditional', type: 'related', strength: 0.8 },
      { id: 'return_values', type: 'related', strength: 0.5 },
    ],
    contrasts: [
      { id: 'control_flow_conditional', type: 'contrast', strength: 0.7 },
    ],
    semantic_tests: [
      {
        id: 'pm_01',
        type: 'select_output',
        question: '以下 Rust 代码的 status 值是什么？\nlet code = 404;\nlet status = match code {\n    200 => "OK",\n    404 => "Not Found",\n    _ => "Other",\n};',
        correct_answer: '"Not Found"',
        options: ['"OK"', '"Not Found"', '"Other"', '编译错误'],
        language_context: 'rust',
        difficulty: 3,
      },
      {
        id: 'pm_02',
        type: 'select_output',
        question: '以下 C 代码返回什么？\nconst char* f(int x) {\n    switch(x) {\n        case 1: return "one";\n        case 2: printf("two");\n        case 3: return "three";\n        default: return "other";\n    }\n}\n\nf(2)',
        correct_answer: '"three"',
        options: ['"two"', '"three"', '"other"', '未定义行为'],
        language_context: 'c',
        difficulty: 3,
        trap_note: 'C switch 贯穿：case 2 没有 break/return，贯穿到 case 3 返回 "three"。',
      },
      {
        id: 'pm_03',
        type: 'identify_equivalent',
        question: 'C 的 `switch(x) { case 1: ...; break; default: ...; }` 在 Rust 中最等价的写法是？',
        correct_answer: 'match x { 1 => ..., _ => ... }',
        options: [
          'switch x { 1 => ..., default => ... }',
          'match x { 1 => ..., _ => ... }',
          'if x == 1 { ... } else { ... }',
          'match x { 1 => ...; break; _ => ...; break; }',
        ],
        language_context: 'rust',
        difficulty: 3,
        trap_note: 'Rust 用 match 替代 switch，_ 替代 default，无贯穿无需 break。',
      },
    ],
  },
];