import { mockContextWithRequest } from "../../test/utils/mock-context";
import { decoratorFactory } from "./employee-number.decorator";

describe("@EmployeeNumber() decorator", () => {
  it("Returns the correct employee number", () => {
    const ctx = mockContextWithRequest({ employeeNumber: 123 });
    expect(decoratorFactory({}, ctx)).toEqual(123);
  });

  it("Returns undefined for missing employee number", () => {
    const ctx = mockContextWithRequest({});
    expect(decoratorFactory({}, ctx)).toBeUndefined();
  });
});
