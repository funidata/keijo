import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { useForm } from "react-hook-form";

import "../../i18n/i18n-config";
import FormComboBox from "./FormComboBox";

afterEach(() => cleanup());

type FormValues = {
  issue: string;
};

const TestForm = () => {
  const form = useForm<FormValues>({
    defaultValues: { issue: "" },
  });

  const issueValue = form.watch("issue");

  return (
    <form>
      <FormComboBox
        form={form}
        name="issue"
        title="Issue"
        autoCompleteProps={{ options: ["ABC", "XYZ"] }}
      />
      <div data-testid="current-value">{issueValue}</div>
    </form>
  );
};

describe("FormComboBox", () => {
  it("reflects the typed value in the rendered form output", () => {
    render(<TestForm />);

    const input = screen.getByLabelText("Issue") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "ABC" } });

    expect(input.value).toBe("ABC");
    expect(screen.getByTestId("current-value").textContent).toBe("ABC");
  });
});
