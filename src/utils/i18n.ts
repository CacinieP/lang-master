type I18nKey = string;
type TranslationMap = Record<I18nKey, { zh: string; en: string }>;

const translations: TranslationMap = {
  app_title: { zh: 'Lang Master', en: 'Lang Master' },
  app_subtitle: { zh: '编程语言的语言学', en: 'The Linguistics of Programming Languages' },
  explore_mode: { zh: '探索模式', en: 'Explore Mode' },
  challenge_mode: { zh: '挑战模式', en: 'Challenge Mode' },
  master_mode: { zh: '精通模式', en: 'Master Mode' },
  layer_lexical: { zh: '词法层', en: 'Lexical' },
  layer_morphological: { zh: '构造层', en: 'Morphological' },
  layer_syntax: { zh: '句法层', en: 'Syntax' },
  layer_semantic: { zh: '语义层', en: 'Semantics' },
  layer_pragmatic: { zh: '语用层', en: 'Pragmatics' },
  paradigm_procedural: { zh: '过程式', en: 'Procedural' },
  paradigm_oop: { zh: '面向对象', en: 'OOP' },
  paradigm_functional: { zh: '函数式', en: 'Functional' },
  traps_title: { zh: '语言切换陷阱', en: 'Language Switch Traps' },
  traps_none: { zh: '无已知负迁移', en: 'No known negative transfers' },
  quiz_title: { zh: '语义验证', en: 'Semantic Verification' },
  quiz_submit: { zh: '提交', en: 'Submit' },
  quiz_correct: { zh: '正确!', en: 'Correct!' },
  quiz_wrong: { zh: '不正确', en: 'Incorrect' },
  quiz_try_again: { zh: '再试一次', en: 'Try again' },
  welcome_title: { zh: '欢迎来到 Lang Master', en: 'Welcome to Lang Master' },
  welcome_subtitle: { zh: '编程语言也有语法、词汇、语义——就像自然语言一样', en: 'Programming languages have grammar, vocabulary, semantics — just like natural languages' },
  survey_title: { zh: '你熟悉哪些编程语言？', en: 'Which programming languages are you familiar with?' },
  survey_skip: { zh: '跳过', en: 'Skip' },
  survey_continue: { zh: '继续', en: 'Continue' },
  start_exploring: { zh: '开始探索', en: 'Start Exploring' },
  show_equivalents: { zh: '显示等价写法', en: 'Show equivalents' },
  hide_equivalents: { zh: '隐藏等价写法', en: 'Hide equivalents' },
  severity_high: { zh: '高危', en: 'High' },
  severity_medium: { zh: '中等', en: 'Medium' },
  severity_low: { zh: '低危', en: 'Low' },
  transfer_positive: { zh: '正迁移', en: 'Positive Transfer' },
  beta_label: { zh: 'Beta', en: 'Beta' },
  progress_mastered: { zh: '已掌握', en: 'Mastered' },
  progress_exploring: { zh: '探索中', en: 'Exploring' },
  progress_unvisited: { zh: '未开始', en: 'Not started' },
};

export function t(key: string, lang: 'zh' | 'en' = 'zh'): string {
  return translations[key]?.[lang] ?? key;
}
