import { expect } from "chai";


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
});
