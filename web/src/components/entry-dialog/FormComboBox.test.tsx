import { cleanup, render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { afterEach, describe, expect, it, vi } from "vitest";
import FormComboBox from "./FormComboBox";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

type TestFormValues = {
  issue: string;
};

const options = [
  {
    value: "ABC-1",
    label: "ABC-1: Test issue",
    groupLabel: "searchResults",
    disabled: false,
  },
];

const TestForm = ({ onSubmit }: { onSubmit: (values: TestFormValues) => void }) => {
  const form = useForm<TestFormValues>({ defaultValues: { issue: "" } });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FormComboBox
        form={form}
        name="issue"
        title="Issue"
        autoCompleteProps={{
          options,
          getOptionDisabled: (option) => option.disabled,
          renderOption: (props, option) => <li {...props}>{option.label}</li>,
          groupBy: (option) => option.groupLabel,
          filterOptions: () => options,
        }}
      />
      <button type="submit">Save</button>
    </form>
  );
};

describe("FormComboBox", () => {
  afterEach(() => cleanup());

  it("submits successfully when an autocomplete option object is selected and the form is submitted", async () => {
    const onSubmit = vi.fn();

    render(<TestForm onSubmit={onSubmit} />);

    const input = screen.getByLabelText("Issue") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "ABC-1" } });
    fireEvent.keyDown(input, { key: "ArrowDown" });

    const option = await screen.findByRole("option", { name: "ABC-1: Test issue" });
    fireEvent.click(option);

    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ issue: "ABC-1" });
    });
    expect(screen.queryByText("entryDialog.validation.issueInOptions")).toBeNull();
  });

  it("submits successfully when the issue key is typed directly and the form is submitted without selecting an option", async () => {
    const onSubmit = vi.fn();

    render(<TestForm onSubmit={onSubmit} />);

    const input = screen.getByLabelText("Issue") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "ABC-1" } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });
    expect(onSubmit.mock.calls[0][0]).toEqual({ issue: "ABC-1" });
    expect(screen.queryByText("entryDialog.validation.issueInOptions")).toBeNull();
  });
});
