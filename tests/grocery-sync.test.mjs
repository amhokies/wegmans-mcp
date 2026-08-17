import assert from "node:assert/strict";
import test from "node:test";
import { chooseSearchCandidate } from "../dist/grocery-sync.js";

function product(productName, category = "Pantry") {
  return {
    productId: productName,
    productName,
    objectID: `133-${productName}`,
    category: [{ name: category }],
    categories: { lvl0: category },
  };
}

test("low-confidence grocery searches remain unresolved", () => {
  const candidate = chooseSearchCandidate("tomato sauce 15 oz can", [
    product("Beer Variety Pack, 15 Cans", "Beer"),
  ]);

  assert.equal(candidate, null);
});

test("matching food product is selected", () => {
  const expected = product("Wegmans Tomato Sauce", "Pantry");
  const candidate = chooseSearchCandidate("tomato sauce", [
    product("Tomato Scented Candle", "Home"),
    expected,
  ]);

  assert.equal(candidate?.productId, expected.productId);
});

test("substring-only matches remain unresolved", () => {
  assert.equal(chooseSearchCandidate("tea", [product("Steak", "Meat")]), null);
  assert.equal(chooseSearchCandidate("ham", [product("Graham Crackers", "Pantry")]), null);
});
