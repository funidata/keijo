import { get, set } from "lodash";

/**
 * Fix undefined lists in `data` at locations defined by `arrayPaths`.
 *
 * Despite XML parser's `isArray` coercion, empty lists are still undefined. This fixes
 * that issue.
 */
const fixUndefinedArrays = <T extends object>(data: T, arrayPaths: string[]): T => {
  arrayPaths.forEach((path) => {
    // Use parent for comparison rather than the actual path to effectively skip setting the
    // default when the parent is an array. This will break if we actually need to set the
    // default within list values but currently there is no need for that so this will do.
    const parentPath = path.split(".").slice(0, -1).join(".");
    if (get(data, parentPath) === "") {
      set(data, path, []);
    }
  });

  return data;
};

export default fixUndefinedArrays;
