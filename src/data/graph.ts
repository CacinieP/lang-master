import type { ConceptGraph } from '@/types';

export const conceptGraph: ConceptGraph = {
  edges: [
    // Lexical → Morphological progression
    { from: 'literal_values', to: 'variable_declaration', type: 'prerequisite', strength: 1.0 },
    { from: 'variable_declaration', to: 'constant_declaration', type: 'contrast', strength: 0.9 },
    { from: 'variable_declaration', to: 'basic_operators', type: 'prerequisite', strength: 0.8 },
    { from: 'basic_operators', to: 'assignment_operators', type: 'prerequisite', strength: 0.9 },
    { from: 'basic_operators', to: 'operator_precedence', type: 'prerequisite', strength: 0.7 },
    { from: 'basic_operators', to: 'comments', type: 'related', strength: 0.3 },
    { from: 'comments', to: 'conditional_keywords', type: 'related', strength: 0.4 },
    { from: 'comments', to: 'loop_keywords', type: 'related', strength: 0.4 },

    // Lexical → Morphological bridge
    { from: 'variable_declaration', to: 'type_annotation', type: 'compose', strength: 0.8 },
    { from: 'basic_operators', to: 'expressions_basic', type: 'prerequisite', strength: 1.0 },
    { from: 'conditional_keywords', to: 'control_flow_conditional', type: 'prerequisite', strength: 0.9 },
    { from: 'loop_keywords', to: 'control_flow_loop_for', type: 'prerequisite', strength: 0.9 },
    { from: 'loop_keywords', to: 'control_flow_loop_while', type: 'prerequisite', strength: 0.9 },

    // Morphological internal
    { from: 'expressions_basic', to: 'function_call', type: 'prerequisite', strength: 0.9 },
    { from: 'function_call', to: 'member_access', type: 'compose', strength: 0.7 },
    { from: 'type_annotation', to: 'type_casting', type: 'prerequisite', strength: 0.8 },
    { from: 'literal_values', to: 'string_interpolation', type: 'prerequisite', strength: 0.7 },
    { from: 'literal_values', to: 'array_literal', type: 'prerequisite', strength: 0.7 },

    // Morphological → Syntax bridge
    { from: 'function_call', to: 'function_definition', type: 'prerequisite', strength: 1.0 },
    { from: 'expressions_basic', to: 'control_flow_conditional', type: 'prerequisite', strength: 0.9 },

    // Syntax internal
    { from: 'control_flow_conditional', to: 'control_flow_loop_for', type: 'related', strength: 0.6 },
    { from: 'control_flow_loop_for', to: 'control_flow_loop_while', type: 'contrast', strength: 0.8 },
    { from: 'function_definition', to: 'function_parameters', type: 'compose', strength: 0.9 },
    { from: 'function_parameters', to: 'return_values', type: 'compose', strength: 0.8 },
    { from: 'variable_declaration', to: 'scope_block', type: 'related', strength: 0.7 },
    { from: 'control_flow_conditional', to: 'pattern_matching', type: 'related', strength: 0.8 },

    // Cross-category contrasts
    { from: 'control_flow_loop_for', to: 'function_call', type: 'contrast', strength: 0.5 },
  ],
};
