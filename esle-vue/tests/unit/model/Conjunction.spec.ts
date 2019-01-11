import { expect } from "chai";
import _ from 'lodash';

import Conjunction from "@/model/Conjunction";

describe("Conjunction", () => {
  describe("assigning conditions", () => {
    it('starts with no conditions.', () => {
      const c = new Conjunction();
      expect(c.arity()).to.equal(0);
    });

    it("can be assigned one true condition, and know what that condition is.", () => {
      const c = new Conjunction({'AFOO': true});
      expect(c.arity()).to.equal(1);
      expect(c.dependsOn("ABAR")).to.equal(false);
      expect(c.dependsOn('AFOO')).to.equal(true);
      expect(c.requiredState("AFOO")).to.equal(true);
    });

    it("can be assigned one false condition, and know what that condition is.", () => {
      const c = new Conjunction({ 'AFOO': false });
      expect(c.arity()).to.equal(1);
      expect(c.dependsOn("ABAR")).to.equal(false);
      expect(c.dependsOn('AFOO')).to.equal(true);
      expect(c.requiredState("AFOO")).to.equal(false);
      expect(c.requiredState("AFOO")).to.not.equal(null);
    });

    it("can be assigned one unknown condition, and know what that condition is.", () => {
      const c = new Conjunction({ AFOO: null });
      expect(c.arity()).to.equal(1);
      expect(c.dependsOn("ABAR")).to.equal(false);
      expect(c.dependsOn("AFOO")).to.equal(true);
      expect(c.requiredState("AFOO")).to.equal(null);
      expect(c.requiredState("AFOO")).to.not.equal(false);
    });

    it("can be assigned multiple condition, and know what those conditions are.", () => {
      const c = new Conjunction({ AFOO: null, ABAR: true, AQUUX: false });
      expect(c.arity()).to.equal(3);

      expect(c.dependsOn("AFOO")).to.equal(true);
      expect(c.dependsOn("ABAR")).to.equal(true);
      expect(c.dependsOn("AQUUX")).to.equal(true);
      expect(c.dependsOn("AZIFF")).to.equal(false);

      expect(c.requiredState("AFOO")).to.equal(null);
      expect(c.requiredState("ABAR")).to.equal(true);
      expect(c.requiredState("AQUUX")).to.equal(false);
    });
  });

  describe('satisfaction', () => {
    it('satisfies requirements on a state that includes red herrings.', () => {
      const c = new Conjunction({ AFOO: null, ABAR: true, AQUUX: false });
      const s = {
        AFOO: null,
        ABAR: true,
        AQUUX: false,
        AZIFF: true
      };
      expect(c.sat(s)).to.equal(true);
    });

    it("does not satisfy when requirements are met.", () => {
      const c = new Conjunction({ AFOO: null, ABAR: true, AQUUX: false });
      const s = { AFOO: true, ABAR: true, AQUUX: false, AZIFF: true };
      expect(c.sat(s)).to.equal(false);
    });

    it("does not confuse false with null.", () => {
      const c = new Conjunction({ AFOO: null });
      const s = { AFOO: false };
      expect(c.sat(s)).to.equal(false);

      const c2 = new Conjunction({ AFOO: null });
      const s2 = { AFOO: null };
      expect(c2.sat(s2)).to.equal(true);
    });
  });

  describe('generateRandom', () => {
    it('should draw the requested fixed number of terms.', () => {
      const s = { AFOO: true, ABAR: true, AQUUX: false, AZIFF: true, AMIP: true, AGIG: false };
      _.times(100, () => {
        let c = Conjunction.generateRandom(s, 2);
        expect(c).to.not.be.null;
        c = c as Conjunction;
        expect(c.arity()).to.equal(2);
        expect(c.sat(s)).to.be.true;
      });
    });

    it("should draw the requested variable number of terms.", () => {
      const s = { AFOO: true, ABAR: true, AQUUX: false, AZIFF: true, AMIP: true, AGIG: false };      
      _.times(100, () => {
        let c = Conjunction.generateRandom(s, 2, 5);
        expect(c).to.not.be.null;
        c = c as Conjunction;
        expect(c.arity()).to.not.be.below(2);
        expect(c.arity()).to.not.be.above(5);
        expect(c.sat(s)).to.be.true;
      });
    });

    it("should draw variable number of terms with uniform distribution of number of terms.", () => {
      const distrib = {2:0, 3:0, 4:0, 5:0} as {[key:number]:number};
      const s = { AFOO: true, ABAR: true, AQUUX: false, AZIFF: true, AMIP: true, AGIG: false };
      _.times(100, () => {
        let c = Conjunction.generateRandom(s, 2, 5);
        expect(c).to.not.be.null;
        c = c as Conjunction;
        expect(c.sat(s)).to.be.true;
        distrib[c.arity()] += 1;
      });

      expect(Object.keys(distrib).length).to.equal(4);

      for (let k in distrib) {
        const n = distrib[k];
        // Expect each one to be about 25.
        expect(n).to.be.above(10);
        expect(n).to.be.below(40);
      }
    });

    it("should draw variable number of terms with uniform distribution of terms selected.", () => {
      const distrib = {} as {[key:string]:number};
      const s = { AFOO: true, ABAR: true, AQUUX: false, AZIFF: true, AMIP: true, AGIG: false };
      _(Object.keys(s)).each(k => distrib[k] = 0);

      let totalSelections = 0;
      _.times(100, () => {
        let c = Conjunction.generateRandom(s, 1, 3);
        expect(c).to.not.be.null;
        c = c as Conjunction;
        expect(c.sat(s)).to.be.true;

        totalSelections += c.arity();

        const cond = c.getConditions();
        Object.keys(cond).forEach(k => distrib[k] += 1);
      });

      const numKeys = Object.keys(s).length;
      expect(Object.keys(distrib).length).to.equal(numKeys);

      const expectedSelectionsPerTerm = totalSelections / numKeys;

      for (let k in distrib) {
        const n = distrib[k];
        expect(n).to.be.above(expectedSelectionsPerTerm * .5);
        expect(n).to.be.below(expectedSelectionsPerTerm * 1.5);
      }
    });


  });
});
