
/**
 * Ternary data type permits an initial seeding of a network of Boolean nodes
 * to an initial Unknown state. A major weakness of a conventional binary
 * approach to random Boolean networks is their sensitivity to random 
 * initial activation states. The use of ternary logic sidesteps this issue
 * by permitting all non-input nodes to be seeded to an initial "unknown"
 * state, a state which cannot be attained again through normal evaluation.
 * (A node may eventually revert back to an "unknown" state if enough time
 * passes without that node getting checked, but that will be the subject
 * of later experiments.)
 */
type Ternary = Boolean|null;

/**
 * Shorthand for a map of Ternary variables.
 */
type NamedTernaries = { [key: string]: Ternary };

export { Ternary, NamedTernaries };


