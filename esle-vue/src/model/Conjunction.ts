
import { Ternary, NamedTernaries} from './Ternary';
import _ from 'lodash';

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
   * @param numTermsMin: How many terms to pick. If "states" doesn't have that many terms, just
   * picks all of the states. Must be nonnegative.
   * @param numTermsMax: Max number of terms to draw. If specified, will pick a random number
   * of terms between numTermsMin and numTermsMax, inclusive. Must be greater than numTermsMin.
   * @param namesToExclude: Names of states to avoid using.
   * @returns A Conjunction that consists of randomly drawn terms, or null if no conjunction
   * could be created.
   */
  static generateRandom(states: NamedTernaries, 
        numTermsMin: number, 
        numTermsMax=null as number|null, 
        namesToExclude=null as string[]|null): 
        Conjunction|null {
    let termNamesEligible = [...Object.keys(states)];
    _.pullAll(termNamesEligible, namesToExclude || []);
    if (!termNamesEligible.length) {
      // No terms are eligible for the conjunction.
      return null;
    }

    if (numTermsMin <= 0 || !Number.isInteger(numTermsMin)) {
      throw new RangeError(`numTermsMin=${numTermsMin} must be a positive integer.`);
    }

    if (numTermsMax === null) {
      numTermsMax = numTermsMin;
    }
    if (numTermsMax < numTermsMin || !Number.isInteger(numTermsMax)) {
      throw new RangeError(`numTermsMax=${numTermsMax} must be an integer smaller than numTermsMin=${numTermsMin}.`);
    }

    const numToSample = _.random(numTermsMin, numTermsMax);
    const termNamesSelected = _.sampleSize(termNamesEligible, numToSample);
    let conditions = termNamesSelected.reduce((acc, termName) => { 
      acc[termName] = states[termName]; 
      return acc; 
    }, {} as NamedTernaries);

    const retval = new Conjunction(conditions);
    return retval;
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
  sat(states: NamedTernaries) : boolean {
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
   * Get a copy of the conditions collection.
   * @returns The conditions that must be met in order for this Conjunction to be true.
   */
  getConditions(): NamedTernaries {
    let retval = {} as NamedTernaries;
    Object.assign(retval, this.conditions);
    return retval;
  }

  /**
   * Determines whether or not this Conjunction is dependent on the named term.
   * @param termname The name of the term to test for dependency.
   */
  dependsOn(termname: string): boolean {
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
  arity(): number {
    return Object.keys(this.conditions).length;
  }
}
