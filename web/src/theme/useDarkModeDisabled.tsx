/**
 * Dummy hook for disabling light mode.
 *
 * Once light mode colors are fixed, usage of this hook should be replaced with the `useDarkMode`
 * from `usehooks-ts`.
 */
const useDarkModeDisabled = () => ({
  isDarkMode: true,
  toggle: () => {},
});

export default useDarkModeDisabled;
