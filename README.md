# Lang Master

> From the perspective of natural language linguistics and programming philosophy, help beginners master the Top 10 programming languages and acquire meta-skills that transcend any single language.

[![Deploy](https://img.shields.io/github/actions/workflow/status/CacinieP/lang-master/deploy.yml?branch=main&style=flat-square)](https://github.com/CacinieP/lang-master/actions/workflows/deploy.yml)
[![Demo](https://img.shields.io/badge/demo-GitHub%20Pages-39c5bb?style=flat-square)](https://caciniep.github.io/lang-master/)
[![License](https://img.shields.io/github/license/CacinieP/lang-master?style=flat-square)](LICENSE)

## Project Positioning

Lang Master is not another programming tutorial — it is **the linguistics of programming languages**. Just as Typing Master doesn't teach you French grammar but trains your French typing intuition, Lang Master doesn't teach you to write Python code; it trains you to understand Python as a "language" through its five-layer structure (Lexicon → Construction → Syntax → Semantics → Pragmatics), and to transfer this understanding to Java, Rust, Go, and 9 other languages.

## Core Philosophy

1. **Programming languages are languages** — They can be analyzed using the five-layer framework of natural linguistics (Phonology → Morphology → Syntax → Semantics → Pragmatics)
2. **Language shapes thought** — The weak form of Sapir-Whorf: language shapes but does not determine how we think
3. **Meta-skills outrank syntax** — Paradigm switching, abstraction recognition, semantic intuition, and 7 other meta-skills are the goal
4. **Genealogical affinity reduces cost** — Learning Rust after C++ costs less than learning Rust after R (analogous to migration within the Indo-European language family)

## Target Languages (2026 Combined Top 10 Rankings)

| # | Language | Primary Paradigm | Core Training Value |
|---|---|---|---|
| 1 | Python | OOP+FP+Procedural | Multi-paradigm coexistence intuition |
| 2 | C | Procedural | Low-level and precise control thinking |
| 3 | Java | OOP | Object-organization thinking |
| 4 | C++ | Multi-paradigm | Abstraction gradient thinking (from pointers to templates) |
| 5 | C# | OOP+FP | Language evolution thinking |
| 6 | JavaScript | Prototype OOP+FP+Async | Async and prototype thinking |
| 7 | Go | Procedural+CSP | Concise concurrency thinking |
| 8 | Rust | FP+trait+Ownership | Safety and resource management thinking |
| 9 | Swift | Protocol OOP+FP | Value-type-first thinking |
| 10 | R | Vector+FP | Data thinking |

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **State Management**: Zustand
- **Data Storage**: localStorage (Alpha), IndexedDB (Beta)
- **Syntax Highlighting**: Custom lightweight tokenizer (zero external dependencies)

## Project Structure

```
src/
├── types/          # TypeScript type definitions
├── data/           # Concept data (4 languages × 24 concepts)
│   ├── concepts/   # One file per layer
│   ├── constants.ts
│   └── graph.ts
├── store/          # Zustand state management
├── services/       # Business logic
├── components/     # UI components
│   ├── layout/     # Layout
│   ├── navigation/ # Navigation (LayerNavigator, ConceptTree)
│   ├── concept/    # Concept display (ParadigmView, ExpressionCard)
│   ├── trap/       # Trap hints (TrapAdvisor)
│   ├── practice/   # Practice (SemanticQuiz)
│   └── onboarding/ # Onboarding (WelcomeScreen)
└── utils/          # Utility functions
```

## Project Documentation

| Document | Description |
|---|---|
| [docs/VISION.md](docs/VISION.md) | Project vision, architecture design, Typing Master mapping |
| [docs/LINGUISTICS-FRAMEWORK.md](docs/LINGUISTICS-FRAMEWORK.md) | Natural linguistics five-layer framework → programming mapping |
| [docs/PROGRAMMING-PHILOSOPHY.md](docs/PROGRAMMING-PHILOSOPHY.md) | Programming philosophy research (paradigms, types, errors, memory, concurrency) |
| [docs/RANKINGS-RESEARCH.md](docs/RANKINGS-RESEARCH.md) | TIOBE/PYPL/SO ranking data and language selection rationale |

## Status

**Current phase: Alpha development** — React + TypeScript + Vite web app, 4 languages (Python/C/Java/Rust) × P1-P3 concepts × explore mode.

Live demo: [https://caciniep.github.io/lang-master/](https://caciniep.github.io/lang-master/)

```
npm run dev      # Start dev server
npm run build    # Build production version
npm run test     # Run tests
```

## Design Inspiration

This project's architecture inherits from [Typing Master](https://github.com/CacinieP/typing-master) (a multi-language typing practice desktop app):

| Typing Master Concept | Lang Master Correspondence |
|---|---|
| 6 natural languages → typing practice | 10 programming languages → concept understanding practice |
| Virtual keyboard (3 layouts) | Paradigm view (3 paradigm switches) |
| Character-by-character verification | Concept-by-concept verification |
| WPM speed tracking | Concept mastery rate tracking |
| Dead key combinations (accent) | Concept combinations (primitive → compound) |
| CSV vocabulary import/export | Course package import/export |

## License

MIT License — Copyright 2025-2026 CacinieP

---

# Lang Master

> 从自然语言学与编程哲学的视角，帮助初学者精通编程语言排行榜 Top 10 语言，并掌握超越单一语言的元能力。

[![Deploy](https://img.shields.io/github/actions/workflow/status/CacinieP/lang-master/deploy.yml?branch=main&style=flat-square)](https://github.com/CacinieP/lang-master/actions/workflows/deploy.yml)
[![Demo](https://img.shields.io/badge/demo-GitHub%20Pages-39c5bb?style=flat-square)](https://caciniep.github.io/lang-master/)
[![License](https://img.shields.io/github/license/CacinieP/lang-master?style=flat-square)](LICENSE)

## 项目定位

Lang Master 不是另一门编程教程——它是**编程语言的语言学**。就像 Typing Master 不是教你法语语法而是训练你的法语打字直觉一样，Lang Master 不教你写 Python 代码，而是训练你理解 Python 作为一种"语言"的五层结构（词法→构造→句法→语义→语用），并能将这种理解迁移到 Java、Rust、Go 等9种其他语言。

## 核心理念

1. **编程语言是语言** — 可用自然语言学的五层框架分析（Phonology→Morphology→Syntax→Semantics→Pragmatics）
2. **语言影响思维** — Sapir-Whorf 弱形式：语言塑造但不决定思维方式
3. **元能力高于语法** — 范式切换、抽象辨识、语义直觉等7项元能力是目标
4. **亲缘关系降低成本** — 学C++后再学Rust比学R后再学Rust成本低（类比印欧语系内部迁移）

## 目标语言（2026年排行榜综合Top 10）

| # | 语言 | 主范式 | 核心训练价值 |
|---|---|---|---|
| 1 | Python | OOP+FP+过程式 | 多范式共存直觉 |
| 2 | C | 过程式 | 底层与精确控制思维 |
| 3 | Java | OOP | 对象组织思维 |
| 4 | C++ | 多范式 | 抽象梯度思维（从指针到模板） |
| 5 | C# | OOP+FP | 语言进化思维 |
| 6 | JavaScript | 原型OOP+FP+异步 | 异步与原型思维 |
| 7 | Go | 过程式+CSP | 简洁并发思维 |
| 8 | Rust | FP+trait+所有权 | 安全与资源管理思维 |
| 9 | Swift | 协议OOP+FP | 值类型优先思维 |
| 10 | R | 向量式+FP | 数据思维 |

## 技术栈

- **前端**: React 19 + TypeScript + Vite
- **状态管理**: Zustand
- **数据存储**: localStorage (Alpha), IndexedDB (Beta)
- **语法高亮**: 自研轻量 tokenizer (零外部依赖)

## 项目结构

```
src/
├── types/          # TypeScript 类型定义
├── data/           # 概念数据 (4语言 × 24概念)
│   ├── concepts/   # 按层级分文件
│   ├── constants.ts
│   └── graph.ts
├── store/          # Zustand 状态管理
├── services/       # 业务逻辑
├── components/     # UI 组件
│   ├── layout/     # 布局
│   ├── navigation/ # 导航 (LayerNavigator, ConceptTree)
│   ├── concept/    # 概念展示 (ParadigmView, ExpressionCard)
│   ├── trap/       # 陷阱提示 (TrapAdvisor)
│   ├── practice/   # 练习 (SemanticQuiz)
│   └── onboarding/ # 引导 (WelcomeScreen)
└── utils/          # 工具函数
```

## 项目文档

| 文档 | 描述 |
|---|---|
| [docs/VISION.md](docs/VISION.md) | 项目愿景、架构设计、Typing Master映射 |
| [docs/LINGUISTICS-FRAMEWORK.md](docs/LINGUISTICS-FRAMEWORK.md) | 自然语言学五层框架→编程映射 |
| [docs/PROGRAMMING-PHILOSOPHY.md](docs/PROGRAMMING-PHILOSOPHY.md) | 编程哲学调研（范式、类型、错误、内存、并发） |
| [docs/RANKINGS-RESEARCH.md](docs/RANKINGS-RESEARCH.md) | TIOBE/PYPL/SO排行榜数据与语言选定理由 |

## 状态

**当前阶段：Alpha 开发** — React + TypeScript + Vite Web 应用，4语言(Python/C/Java/Rust) × P1-P3概念 × 探索模式。

在线体验：[https://caciniep.github.io/lang-master/](https://caciniep.github.io/lang-master/)

```
npm run dev      # 启动开发服务器
npm run build    # 构建生产版本
npm run test     # 运行测试
```

## 设计灵感

本项目架构继承自 [Typing Master](https://github.com/CacinieP/typing-master)（多语言打字练习桌面应用）：

| Typing Master 概念 | Lang Master 对应 |
|---|---|
| 6种自然语言 → 打字练习 | 10种编程语言 → 概念理解练习 |
| 虚拟键盘（3布局） | 范式视图（3范式切换） |
| 逐字符校验 | 逐概念校验 |
| WPM速度追踪 | 概念掌握率追踪 |
| 死键组合（accent） | 概念组合（primitive→compound） |
| CSV词汇导入/导出 | 课程包导入/导出 |

## 许可

MIT License — Copyright 2025-2026 CacinieP