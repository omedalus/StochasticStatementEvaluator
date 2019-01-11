
import { Ternary, NamedTernaries} from './Ternary';

/**
 * An object that represents the desired state of a subset of named ternary term.
 * All variables must be in the specified state, otherwise the conjunction evaluates
 * to False.
 */
export default class Conjunction {
  private conditions = {} as NamedTernaries;

  constructor(conditions = {}) {
    this.assignConditions(conditions);
  }


  /**
   * 
   * @param states The current state of every term in the network, mapped to that term's name.
   * @param numTermsMax: 
   */
  static generateRandom(states: NamedTernaries, numTermsMax: number, numTermsMin=1): Conjunction {

  }


  /**
   * Adds to the conditions of this Conjunction.
   * @param conditions A map of term names to the values that those terms must have in order
   * for this Conjunction to be satisfied.
   */
  assignConditions(conditions: NamedTernaries) {
    Object.assign(this.conditions, conditions);
  }

  /**
   * Determines whether or not the Conjunction is currently satisfied.
   * The Conjunction is satisfied if the value of every named term
   * in this Conjunction's conditions is the same as that term's
   * current state in "states".
   * @param states The current state of every term in the network, mapped to that term's name.
   */
  sat(states: NamedTernaries) : Boolean {
    for (let termname in this.conditions) {
      if (!(termname in states)) {
        throw new ReferenceError(`'${termname}' not in network.`);
      }
      const termvalObserved = states[termname];
      const termvalDesired = this.conditions[termname];
      if (termvalDesired !== termvalObserved) {
        return false;
      }
    }

    return true;
  }

  /**
   * Determines whether or not this Conjunction is dependent on the named term.
   * @param termname The name of the term to test for dependency.
   */
  dependsOn(termname: string): Boolean {
    return (termname in this.conditions);
  }


  /**
   * Returns the state that this Conjunction needs this term to be in.
   * @param termname The name of the term whose dependency state to check.
   */
  requiredState(termname: string): Ternary {
    if (!(termname in this.conditions)) {
      throw new ReferenceError(`${termname} not in network.`);
    }
    return this.conditions[termname];
  }

  /**
   * How many terms this Conjunction is dependent on.
   */
  arity(): Number {
    return Object.keys(this.conditions).length;
  }
}
