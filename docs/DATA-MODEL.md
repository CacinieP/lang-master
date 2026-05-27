# Lang Master — 数据模型

> 版本：v0.1 | 日期：2026-05-26

---

## 1. 核心数据结构总览

```
CONCEPT_DATA                    ← 概念知识库（类比 Typing Master 的 WORD_DATA）
├── concept_nodes[]             ← 概念节点数组（类比 words[]）
│   ├── id                      ← 概念唯一标识
│   ├── layer                   ← 所属语言学层级（lexical/morphological/syntax/semantic/pragmatic）
│   ├── paradigm_tags[]         ← 范式标签（procedural/oop/functional/concurrent）
│   ├── difficulty              ← P1-P5
│   ├── expressions{}           ← 10语言表达方式（类比 word 字段）
│   ├── traps{}                 ← 负迁移陷阱（类比 accent_sequences 的反向映射）
│   ├── positive_transfers{}    ← 正迁移路径
│   ├── dependencies[]          ← 前置概念依赖
│   ├── related[]               ← 关联概念
│   └── semantic_tests[]        ← 语义验证题目
│
CONCEPT_GRAPH                   ← 概念依赖图
├── edges[]                     ← 依赖关系边列表
│   ├── from                    ← 源概念ID
│   ├── to                      ← 目标概念ID
│   ├── type                    ← 关系类型（prerequisite/related/contrast/compose）
│   └── strength                ← 关系强度（0-1）
│
USER_PROFILE                    ← 用户档案（类比 Typing Master 的 session 统计）
├── known_languages[]           ← 已知语言列表
├── path                        ← 当前学习路径（path_a/b/c）
├── concept_progress{}          ← 每概念掌握状态
│   ├── concept_id              ←
│   ├── status                  ← unvisited/exploring/practicing/mastered
│   ├── layer_status{}          ← 每层掌握状态
│   ├── attempts[]              ← 尝试记录
│   └── last_accessed           ← 时间戳
│
META_ABILITY_SCORES              ← 7项元能力评分
├── paradigm_switching          ← 范式切换分数（0-100）
├── abstraction_discrimination   ← 抽象辨识分数
├── semantic_intuition          ← 语义直觉分数
├── type_thinking               ← 类型思维分数
├── error_language               ← 错误语言分数
├── concurrency_mindset         ← 并发心智分数
├── metaprogramming_awareness    ← 元编程意识分数
│
SESSION_STATS                    ← 练习会话统计（类比 Typing Master 的 session）
├── session_id                  ← UUID
├── mode                        ← explore/challenge/master
├── concepts_attempted[]        ← 本次练习的概念列表
├── paradigm_switch_times[]     ← 范式切换时间记录
├── concept_results[]           ← 每概念的代码+语义+等价结果
├── trap_encounters[]           ← 本次遇到的陷阱及是否规避
├── duration                    ← 练习时长（秒）
├── timestamp                   ← Date.now()

COURSE_PACKAGE                   ← 课程包（类比 Typing Master 的 CSV 导入/导出）
├── version                     ← 格式版本号
├── name                        ← 课程包名称
├── description                 ← 描述
├── languages[]                 ← 包含的语言列表
├── concept_nodes[]             ← 概念节点（子集或完整集）
├── concept_graph               ← 依赖图（子集）
├── custom_expressions{}        ← 自定义语言表达
└── custom_tests[]              ← 自定义验证题目
```

---

## 2. CONCEPT_DATA — 概念知识库

### 2.1 完整 Schema

```jsonc
{
  // ========== 元信息 ==========
  "version": "1.0",               // 数据格式版本
  "last_updated": "2026-05-26",   // 最后更新日期
  "languages": [                   // 包含的语言列表（C7：无顺序含义）
    "python", "c", "java", "cpp", "csharp",
    "javascript", "go", "rust", "swift", "r"
  ],

  // ========== 概念节点 ==========
  "concept_nodes": [
    {
      // --- 基本属性 ---
      "id": "variable_declaration",          // 唯一标识，snake_case
      "name": "变量声明",                      // 中文显示名
      "name_en": "Variable Declaration",      // 英文显示名
      "description": "创建一个命名存储位置以保存值",  // 中文简述
      "description_en": "Creating a named storage location to hold a value",

      // --- 五层分类（C5） ---
      "layer": "lexical",                    // lexical | morphological | syntax | semantic | pragmatic
      "layer_position": 1,                   // 在该层内的位置序号（1=最基础）

      // --- 范式标签（C1） ---
      "paradigm_tags": ["procedural", "oop", "functional"],
      // 每个标签表示该概念在这些范式下有意义

      // --- 难度（C2） ---
      "difficulty": 1,                       // P1-P5
      "new_concept_count": 1,                // 该概念引入的新概念数（c+1）

      // --- 10语言表达方式（C4, C7） ---
      // C7：所有语言字段对称，无 primary 标记
      // C4：至少3种语言有表达（某些语言可能为 null 表示"该语言无此概念原生表达"）
      "expressions": {
        "python": {
          "code": "x = 42",
          "explanation": "动态类型，无需声明类型",
          "output": null,                    // 无运行输出（声明语句）
          "paradigm": "procedural",          // 该表达所属范式
          "equivalent_expressions": ["x: int = 42"],  // 同语言等价表达
          "layer_note": "Python变量声明属于词法层——关键字极少"
        },
        "c": {
          "code": "int x = 42;",
          "explanation": "静态类型，必须声明类型",
          "output": null,
          "paradigm": "procedural",
          "equivalent_expressions": ["int x; x = 42;"],
          "layer_note": "C的变量声明同时是类型声明——词法与构造层融合"
        },
        "java": {
          "code": "int x = 42;",
          "explanation": "静态类型，必须在方法内声明",
          "output": null,
          "paradigm": "oop",
          "equivalent_expressions": ["var x = 42;"],
          "layer_note": "Java10+增加var——从词法层简化到构造层推断"
        },
        "cpp": {
          "code": "int x = 42;",
          "explanation": "静态类型，可使用auto推断",
          "output": null,
          "paradigm": "procedural",
          "equivalent_expressions": ["auto x = 42;"],
          "layer_note": "C++的auto将词法层类型声明延迟到构造层推断"
        },
        "csharp": {
          "code": "int x = 42;",
          "explanation": "静态类型，支持var推断",
          "output": null,
          "paradigm": "oop",
          "equivalent_expressions": ["var x = 42;"],
          "layer_note": "C#的var与Java类似，但语义推断更强"
        },
        "javascript": {
          "code": "let x = 42;",
          "explanation": "动态类型，let/var/const三种声明方式",
          "output": null,
          "paradigm": "procedural",
          "equivalent_expressions": ["const x = 42;", "var x = 42;"],
          "layer_note": "JS的let/const是ES6词法层革新，区别于var的函数作用域"
        },
        "go": {
          "code": "x := 42",
          "explanation": "短变量声明，类型推断",
          "output": null,
          "paradigm": "procedural",
          "equivalent_expressions": ["var x int = 42;"],
          "layer_note": "Go的:=是词法层的独特创新——短声明语法糖"
        },
        "rust": {
          "code": "let x = 42;",
          "explanation": "默认不可变，可变需加mut",
          "output": null,
          "paradigm": "functional",
          "equivalent_expressions": ["let mut x = 42;"],
          "layer_note": "Rust的let默认不可变——词法层体现函数式不可变哲学"
        },
        "swift": {
          "code": "let x = 42",
          "explanation": "let不可变，var可变",
          "output": null,
          "paradigm": "functional",
          "equivalent_expressions": ["var x = 42"],
          "layer_note": "Swift与Rust类似——let/var区分体现值类型优先哲学"
        },
        "r": {
          "code": "x <- 42",
          "explanation": "赋值运算符<-，也可用=",
          "output": null,
          "paradigm": "functional",
          "equivalent_expressions": ["x = 42"],
          "layer_note": "R的<-是统计学传统赋值符号——词法层反映领域文化"
        }
      },

      // --- 负迁移陷阱（C3） ---
      "traps": {
        "python_to_java": {
          "description": "Python动态类型 → Java必须声明类型",
          "severity": "high",                 // low | medium | high
          "example_wrong": "x = 42;  // 在Java中不合法",
          "example_correct": "int x = 42;",
          "explanation": "Python的变量声明不需要类型，但Java要求显式类型声明"
        },
        "python_to_rust": {
          "description": "Python变量默认可变 → Rust变量默认不可变",
          "severity": "high",
          "example_wrong": "let x = 42; x = 43;  // 编译错误",
          "example_correct": "let mut x = 42; x = 43;",
          "explanation": "Rust的let创建不可变绑定，需要mut才能修改"
        },
        "java_to_rust": {
          "description": "Java null检查习惯 → Rust没有null",
          "severity": "high",
          "example_wrong": "if (x != null) { ... }  // Rust中不存在",
          "example_correct": "match x { Some(v) => ..., None => ... }",
          "explanation": "Rust用Option<T>替代null，必须用match/if let处理"
        },
        "java_to_go": {
          "description": "Java异常处理习惯 → Go没有异常",
          "severity": "medium",
          "example_wrong": "try { ... } catch (Exception e) { ... }  // Go中不存在",
          "example_correct": "result, err := doSomething(); if err != nil { ... }",
          "explanation": "Go用显式error返回值替代try/catch异常机制"
        },
        "python_to_c": {
          "description": "Python自动内存管理 → C手动malloc/free",
          "severity": "high",
          "example_wrong": "int* p; *p = 42;  // 未分配内存",
          "example_correct": "int* p = malloc(sizeof(int)); *p = 42; free(p);",
          "explanation": "C需要手动分配和释放内存，没有自动垃圾回收"
        },
        "javascript_to_rust": {
          "description": "JS隐式类型转换 → Rust严格类型无隐式转换",
          "severity": "medium",
          "example_wrong": "42 + \"hello\"  // Rust编译错误",
          "example_correct": "42.to_string() + \"hello\"",
          "explanation": "JS会隐式转换类型拼接，Rust要求显式转换"
        }
      },

      // --- 正迁移路径（C3 辅助） ---
      "positive_transfers": {
        "java_to_csharp": {
          "description": "Java OOP经验 → C# OOP几乎相同",
          "strength": "high",
          "note": "Java的class/interface → C#的class/interface几乎一一对应"
        },
        "python_to_javascript": {
          "description": "Python动态类型直觉 → JS动态类型直觉",
          "strength": "medium",
          "note": "两者都是动态类型，变量声明直觉相似"
        },
        "c_to_cpp": {
          "description": "C过程式基础 → C++几乎完全兼容C语法",
          "strength": "high",
          "note": "C代码可以直接在C++中使用，词法层几乎相同"
        },
        "c_to_go": {
          "description": "C过程式思维 → Go过程式思维",
          "strength": "medium",
          "note": "Go继承了C的过程式哲学但简化了语法"
        }
      },

      // --- 概念依赖（C2） ---
      "dependencies": [
        { "id": "literal_values", "type": "prerequisite", "strength": 1.0 }
        // literal_values 是前置概念——先理解值才能声明变量
      ],
      "related": [
        { "id": "type_annotation", "type": "related", "strength": 0.8 },
        { "id": "variable_mutability", "type": "compose", "strength": 0.7 },
        { "id": "scope", "type": "related", "strength": 0.5 }
      ],
      "contrasts": [
        { "id": "constant_declaration", "type": "contrast", "strength": 0.9 }
        // 变量 vs 常量的对比
      ],

      // --- 语义验证题目（C6） ---
      "semantic_tests": [
        {
          "id": "variable_declaration_semantic_1",
          "type": "explain_behavior",        // explain_behavior | select_output | identify_equivalent
          "question": "Python中 `x = 42` 之后 `x = 43`，x的值是什么？为什么？",
          "question_en": "After `x = 42` then `x = 43` in Python, what is x? Why?",
          "correct_answer": "43。Python变量是可变绑定，重新赋值覆盖旧值",
          "correct_answer_en": "43. Python variables are mutable bindings, reassignment overwrites",
          "options": null,                   // explain类型无选项
          "language_context": "python",
          "difficulty": 1
        },
        {
          "id": "variable_declaration_semantic_2",
          "type": "select_output",
          "question": "Rust中执行以下代码后x的值是什么？\n```rust\nlet x = 42;\nlet x = 43;\nprintln!(\"{}\", x);\n```",
          "question_en": "What is x after this Rust code?",
          "correct_answer": "43",
          "options": ["42", "43", "编译错误", "运行时错误"],
          "language_context": "rust",
          "difficulty": 2,
          "trap_note": "注意：这不是mut，而是shadowing——Rust允许同名变量遮蔽"
        },
        {
          "id": "variable_declaration_semantic_3",
          "type": "identify_equivalent",
          "question": "以下哪个Go代码与 `x := 42` 语义等价？",
          "question_en": "Which Go code is semantically equivalent to `x := 42`?",
          "correct_answer": "var x int = 42",
          "options": ["x = 42", "var x = 42", "var x int = 42", "int x := 42"],
          "language_context": "go",
          "difficulty": 2
        }
      ]
    }
  ],

  // ========== 概念分类体系（类比 Typing Master 的 categories） ==========
  "categories": {
    // 按概念域组织（C1），而非按语言组织
    "variables":          "变量与绑定 Variables & Binding",
    "expressions":        "表达式与运算 Expressions & Operators",
    "control_flow":       "控制流 Control Flow",
    "functions":          "函数与闭包 Functions & Closures",
    "types_basic":        "基础类型 Basic Types",
    "types_advanced":     "高级类型 Advanced Types",
    "classes_traits":     "类与Trait Classes & Traits",
    "memory":             "内存管理 Memory Management",
    "error_handling":     "错误处理 Error Handling",
    "concurrency":        "并发模型 Concurrency Models",
    "metaprogramming":    "元编程 Metaprogramming",
    "idioms":             "惯用法与生态 Idioms & Ecosystem"
  },

  // ========== 概念依赖图 ==========
  "concept_graph": {
    "edges": [
      // 自然顺序假说：变量 → 表达式 → 控制流 → 函数 → 类型 → 类 → 并发 → 元编程
      { "from": "literal_values",           "to": "variable_declaration",      "type": "prerequisite", "strength": 1.0 },
      { "from": "variable_declaration",     "to": "expressions_basic",         "type": "prerequisite", "strength": 1.0 },
      { "from": "expressions_basic",        "to": "control_flow_conditional",  "type": "prerequisite", "strength": 0.9 },
      { "from": "control_flow_conditional", "to": "control_flow_loop",         "type": "prerequisite", "strength": 0.9 },
      { "from": "control_flow_loop",        "to": "function_definition",       "type": "prerequisite", "strength": 1.0 },
      { "from": "function_definition",      "to": "closure_lambda",            "type": "prerequisite", "strength": 0.7 },
      { "from": "variable_declaration",     "to": "type_annotation",           "type": "compose",      "strength": 0.8 },
      { "from": "function_definition",      "to": "type_system_basics",        "type": "prerequisite", "strength": 0.8 },
      { "from": "type_system_basics",       "to": "classes_traits",            "type": "prerequisite", "strength": 0.8 },
      { "from": "classes_traits",           "to": "error_handling",            "type": "prerequisite", "strength": 0.6 },
      { "from": "classes_traits",           "to": "concurrency_basics",        "type": "prerequisite", "strength": 0.6 },
      { "from": "concurrency_basics",       "to": "metaprogramming",           "type": "prerequisite", "strength": 0.5 },

      // 对比关系（同一层的不同范式表达）
      { "from": "variable_declaration",     "to": "constant_declaration",      "type": "contrast",     "strength": 0.9 },
      { "from": "for_loop",                 "to": "while_loop",                "type": "contrast",     "strength": 0.8 },
      { "from": "for_loop",                 "to": "map_filter",                "type": "contrast",     "strength": 0.7 },

      // 组合关系（基本概念组合成高级概念）
      { "from": "variable_declaration",     "to": "variable_mutability",       "type": "compose",     "strength": 0.7 },
      { "from": "closure_lambda",           "to": "async_await",               "type": "compose",     "strength": 0.5 }
    ]
  }
}
```

### 2.2 概念节点字段规格

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `id` | string (snake_case) | 是 | 唯一标识，全局唯一 |
| `name` | string (中文) | 是 | 显示名 |
| `name_en` | string (英文) | 是 | 英文显示名 |
| `description` | string (中文) | 是 | 一句话简述 |
| `description_en` | string (英文) | 是 | 英文简述 |
| `layer` | enum | 是 | `lexical`/`morphological`/`syntax`/`semantic`/`pragmatic` |
| `layer_position` | integer | 是 | 在该层内的排序（1=最基础） |
| `paradigm_tags` | string[] | 是 | 该概念在哪些范式下有意义 |
| `difficulty` | integer (1-5) | 是 | P1-P5 |
| `new_concept_count` | integer | 是 | 该概念引入的新概念数 |
| `expressions` | object | 是 | 10语言表达方式，至少3语言有非null值 |
| `traps` | object | 否 | 负迁移陷阱，键格式 `{source_lang}_to_{target_lang}` |
| `positive_transfers` | object | 否 | 正迁移路径 |
| `dependencies` | object[] | 否 | 前置概念，`{id, type, strength}` |
| `related` | object[] | 否 | 关联概念 |
| `contrasts` | object[] | 否 | 对比概念 |
| `semantic_tests` | object[] | 是 | 至少1个语义验证题 |

### 2.3 LanguageExpression 子 Schema

```jsonc
{
  "code":                  "string (必填)",     // 代码片段，≤50行
  "explanation":           "string (必填)",     // 中文解释
  "explanation_en":        "string (可选)",     // 英文解释
  "output":                "string|null",       // 运行输出（null表示声明语句）
  "output_explanation":    "string|null",       // 输出解释
  "paradigm":              "enum (必填)",       // procedural/oop/functional/concurrent
  "equivalent_expressions": "string[] (可选)",  // 同语言等价表达
  "layer_note":            "string (必填)",     // 该表达在该层的特征说明
  "highlight_tokens":      "string[] (可选)",   // 语法高亮标记的关键token列表
  "is_native":             "boolean (默认true)", // false表示该语言无原生表达（如Go无map/filter）
  "alternative":           "string|null",       // 非原生时提供替代方案
}
```

### 2.4 Trap 子 Schema

```jsonc
{
  "description":    "string (必填)",   // 陷阱描述
  "severity":       "enum (必填)",     // low/medium/high
  "example_wrong":  "string (必填)",   // 错误示例代码
  "example_correct": "string (必填)",  // 正确示例代码
  "explanation":    "string (必填)",   // 为什么这是陷阱
}
```

### 2.5 SemanticTest 子 Schema

```jsonc
{
  "id":                "string (必填)",       // 验证题ID
  "type":              "enum (必填)",         // explain_behavior/select_output/identify_equivalent
  "question":          "string (必填)",       // 中文题目
  "question_en":       "string (可选)",       // 英文题目
  "correct_answer":    "string (必填)",       // 正确答案
  "correct_answer_en": "string (可选)",       // 英文正确答案
  "options":           "string[]|null",       // select_output和identify_equivalent类型的选项
  "language_context":  "string (必填)",       // 哪种语言的上下文
  "difficulty":        "integer (1-5)",       // 验证题难度
  "trap_note":         "string|null",         // 与陷阱的关联提示
  "sandbox_required":  "boolean (默认false)", // 是否需要沙箱执行验证
}
```

---

## 3. SESSION_STATS — 练习会话统计

### 3.1 Schema

```jsonc
{
  "session_id":           "string (UUID)",
  "started_at":           "number (Date.now())",
  "ended_at":             "number (Date.now())",
  "duration":             "number (秒)",
  "mode":                 "enum: explore/challenge/master",

  // --- 概念练习记录 ---
  "concepts_attempted": [
    {
      "concept_id":       "string",
      "layer":            "string",
      "difficulty":       "integer",

      // 代码表达结果
      "code_step": {
        "passed":         "boolean",
        "language":       "string",
        "attempt_count":  "integer",
        "time_ms":        "number"
      },

      // 语义验证结果（C6）
      "semantic_step": {
        "passed":         "boolean",
        "test_type":      "string",
        "attempt_count":  "integer",
        "time_ms":        "number"
      },

      // 等价辨识结果（精通模式）
      "equivalence_step": {
        "passed":         "boolean|null",     // null表示未进入精通模式
        "attempt_count":  "integer|null",
        "time_ms":        "number|null"
      },

      // 最终判定
      "final_result":     "enum: passed/partial/failed",
      "mastery_delta":    "number (0-1)",     // 本次练习对掌握率的增量
    }
  ],

  // --- 范式切换记录 ---
  "paradigm_switches": [
    {
      "from_paradigm":    "string",
      "to_paradigm":      "string",
      "from_language":    "string",
      "to_language":      "string",
      "switch_time_ms":   "number",           // 切换耗时
      "correct_after_switch": "boolean"       // 切换后首次练习是否正确
    }
  ],

  // --- 陷阱遭遇记录 ---
  "trap_encounters": [
    {
      "trap_id":          "string",
      "trap_shown":       "boolean",          // TrapAdvisor 是否已提示
      "trap_avoided":     "boolean",          // 学习者是否避开了陷阱
      "trap_fallen":      "boolean",          // 学习者是否落入陷阱
      "language_from":    "string",
      "language_to":      "string"
    }
  ],

  // --- 元能力增量 ---
  "meta_ability_deltas": {
    "paradigm_switching":          "number (-5 to +5)",
    "abstraction_discrimination":  "number",
    "semantic_intuition":          "number",
    "type_thinking":               "number",
    "error_language":              "number",
    "concurrency_mindset":         "number",
    "metaprogramming_awareness":   "number"
  }
}
```

### 3.2 会话统计聚合计算

```
概念掌握率 = sum(concept_progress[concept_id].mastery_delta) / concept依赖深度
范式切换分数 = avg(paradigm_switch_time_ms 的倒数) × 正确率权重
元能力总分 = 7项元能力分数的加权平均（按训练次数加权）
五层进度 = 每层已mastered概念数 / 该层总概念数
```

---

## 4. USER_PROFILE — 用户档案

### 4.1 Schema

```jsonc
{
  "profile_id":            "string (UUID)",
  "created_at":            "number (Date.now())",
  "last_accessed":         "number (Date.now())",
  "ui_language":           "enum: zh/en/fr",

  // --- 语言经验 ---
  "known_languages": [
    {
      "language":          "string",
      "proficiency":       "enum: beginner/intermediate/advanced/expert",
      "years_of_experience": "number",
      "self_assessed":     "boolean"          // 是否为自评（vs 由练习数据推断）
    }
  ],
  "current_focus_language": "string|null",     // 当前重点学习的语言
  "learning_path":         "enum: path_a/path_b/path_c/custom",

  // --- 概念进度（扁平化 map） ---
  "concept_progress": {
    "<concept_id>": {
      "status":           "enum: unvisited/exploring/practicing/mastered",
      "attempts":         "integer",
      "last_attempted_at": "number",
      "best_result":      "enum: partial/passed/mastered",
      "mastery_score":    "number (0-1)",

      // 每层状态（C5）
      "layer_progress": {
        "lexical":         "number (0-1)",
        "morphological":   "number (0-1)",
        "syntax":          "number (0-1)",
        "semantic":        "number (0-1)",
        "pragmatic":       "number (0-1)"
      },

      // 每语言状态
      "language_progress": {
        "python":          "number (0-1)",
        "c":               "number (0-1)",
        // ... 10种语言
      }
    }
  },

  // --- 元能力评分 ---
  "meta_ability_scores": {
    "paradigm_switching":          { "score": 0, "history": [], "last_updated": 0 },
    "abstraction_discrimination":  { "score": 0, "history": [], "last_updated": 0 },
    "semantic_intuition":          { "score": 0, "history": [], "last_updated": 0 },
    "type_thinking":               { "score": 0, "history": [], "last_updated": 0 },
    "error_language":              { "score": 0, "history": [], "last_updated": 0 },
    "concurrency_mindset":         { "score": 0, "history": [], "last_updated": 0 },
    "metaprogramming_awareness":   { "score": 0, "history": [], "last_updated": 0 }
  },

  // --- 推荐队列 ---
  "recommendation_queue": [
    {
      "concept_id":       "string",
      "reason":           "string",          // 推荐理由（c+1/依赖/薄弱/陷阱规避）
      "priority":         "number (1-10)",
      "generated_at":     "number"
    }
  ],

  // --- 陷阱规避统计 ---
  "trap_stats": {
    "total_shown":        "integer",         // TrapAdvisor提示的总次数
    "total_avoided":      "integer",         // 成功规避次数
    "total_fallen":       "integer",         // 落入陷阱次数
    "avoidance_rate":     "number (0-1)",    // 规避率
    "per_trap": {
      "<trap_id>": {
        "shown":          "integer",
        "avoided":        "integer",
        "fallen":         "integer"
      }
    }
  },

  // --- 练习历史 ---
  "session_history":      "string[] (session_id列表，最多200)",

  // --- 设置 ---
  "settings": {
    "dark_mode":          "boolean (默认true)",
    "font_scale":         "number (0.8-1.5)",
    "language_display_random": "boolean (默认true, C7)",
    "show_traps_auto":    "boolean (默认true, C3)",
    "default_mode":       "enum: explore/challenge/master"
  }
}
```

---

## 5. COURSE_PACKAGE — 课程包导入/导出

### 5.1 Schema

```jsonc
{
  "format":        "langmaster-course-v1",
  "version":       "1.0",
  "name":          "Rust Ownership Mastery",
  "description":   "从变量声明到所有权到生命周期的完整概念链",
  "author":        "CacinieP",
  "created_at":    "2026-05-26",
  "languages":     ["python", "c", "java", "rust"],   // 此包包含的语言

  // 概念节点子集（可少于完整集）
  "concept_nodes": [ /* 同 CONCEPT_DATA.concept_nodes 格式 */ ],

  // 依赖图子集
  "concept_graph": { /* 同 CONCEPT_DATA.concept_graph 格式 */ },

  // 自定义扩展（用户/社区添加）
  "custom_expressions": {
    "<concept_id>": {
      "<language>": { /* 同 LanguageExpression 格式 */ }
    }
  },
  "custom_tests": [
    /* 同 SemanticTest 格式 */
  ],

  // 元信息
  "total_concepts":  5,
  "total_languages":  4,
  "difficulty_range": "P1-P3"
}
```

### 5.2 导出流程

1. 用户选择导出范围（全部/某层/某语言/某概念链）
2. 系统从 IndexedDB 读取对应 CONCEPT_DATA 子集
3. 合入用户 progress 数据（可选）
4. 序列化为 JSON 格式
5. 下载为 `.langmaster.json` 文件（UTF-8 BOM）

### 5.3 导入流程

1. 用户上传 `.langmaster.json` 文件
2. 验证格式版本和必填字段
3. 合入现有 CONCEPT_DATA（不覆盖，只追加新概念和补充已有概念的 expression）
4. 更新概念依赖图
5. 存入 IndexedDB

---

## 6. IndexedDB 存储设计

### 6.1 Database 结构

```
Database: "langmaster-db" (version 1)

Store 1: "concepts"
  Key:     concept_id (string)
  Value:   concept_node (完整对象)
  Indexes:
    - "layer"           → layer字段（快速按层查询）
    - "difficulty"      → difficulty字段（按难度查询）
    - "category"        → paradigm_tags数组（按范式查询）
    - "layer_position"  → [layer, layer_position]复合索引（按层内顺序查询）

Store 2: "concept_graph"
  Key:     auto-increment
  Value:   edge object {from, to, type, strength}
  Indexes:
    - "from"            → from概念ID（查询某概念的所有后续）
    - "to"              → to概念ID（查询某概念的所有前置）
    - "type"            → edge类型

Store 3: "sessions"
  Key:     session_id (string UUID)
  Value:   session_stats (完整对象)
  Indexes:
    - "timestamp"       → started_at（按时间排序）
    - "mode"            → mode（按练习模式筛选）

Store 4: "user_profile"
  Key:     "current" (固定键，单记录)
  Value:   user_profile (完整对象)

Store 5: "course_packages"
  Key:     package_name (string)
  Value:   course_package (完整对象)
```

### 6.2 localStorage 缓存层

| 键 | 内容 | 更新时机 | 用途 |
|---|---|---|---|
| `lm_current_session` | 当前进行中的 session_stats（未完成） | 每次练习操作后 | 快速恢复中断的练习 |
| `lm_recommendation_cache` | 推荐队列缓存 | 每次推荐计算后 | 避免每次打开都重新计算 |
| `lm_concept_cache_hot` | 最近10个概念节点的JSON | 概念切换后 | 快速渲染当前概念 |
| `lm_ui_state` | UI状态（当前面板、选中语言等） | 面板切换后 | 恢复上次UI状态 |
| `lm_last_sync` | IndexedDB→localStorage同步时间戳 | 每次同步后 | 决定是否需要重新从IndexedDB加载 |

### 6.3 数据流方向

```
                    写入方向
                    ────────>

用户操作 → ConceptEngine → MasteryTracker → IndexedDB (主存储)
                                    ↘ localStorage (缓存)

                    <────────
                    读取方向

UI渲染 ← ConceptEngine ← localStorage (缓存，快)
                          ↓ (缓存miss时)
                          IndexedDB (主存储，慢)
```

---

## 7. 数据量估算

### 7.1 概念节点数量

| 层级 | 预估概念数 | 说明 |
|---|---|---|
| 词法层 (P1) | ~20 | 关键字、运算符、声明方式 |
| 构造层 (P2) | ~30 | 表达式组合、函数调用、类型标注 |
| 句法层 (P3) | ~40 | 循环、分支、函数定义、类定义 |
| 语义层 (P4) | ~30 | 求值规则、类型语义、副作用 |
| 语用层 (P5) | ~20 | 设计模式、惯用法、生态惯例 |
| **总计** | **~140** | |

### 7.2 存储容量估算

| 数据类型 | 单条大小 | 总条数 | 总大小 |
|---|---|---|---|
| 概念节点 | ~5KB (含10语言expressions+traps+tests) | 140 | ~700KB |
| 概念依赖图边 | ~100B | ~200 | ~20KB |
| 会话统计 | ~2KB | 200 (上限) | ~400KB |
| 用户档案 | ~50KB (含concept_progress 140条) | 1 | ~50KB |
| 课程包 | ~200KB (5概念链) | 可变 | 可变 |
| **IndexedDB总计** | — | — | **~1.2MB** |
| localStorage缓存 | — | — | **~100KB** |

**结论：** 数据量完全在 IndexedDB 和 localStorage 的容量范围内，无性能瓶颈风险。

---

*所有 Schema 设计受 C1-C7 约束约束。概念节点的 expressions 字段保证 C4（至少3语言），traps 字段保证 C3（负迁移标注），semantic_tests 字段保证 C6（语义验证）。*