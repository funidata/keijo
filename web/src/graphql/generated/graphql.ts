import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
  [_ in K]?: never;
};
export type Incremental<T> =
  | T
  | { [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  DateTime: { input: any; output: any };
};

export type AddWorkdayEntryInput = {
  date: Scalars["DateTime"]["input"];
  duration: Scalars["Float"]["input"];
  recordTypeRatioNumber: Scalars["Float"]["input"];
};

export type Dimension = {
  __typename?: "Dimension";
  name: Scalars["String"]["output"];
  options: Array<Scalars["String"]["output"]>;
};

export type DimensionRecord = {
  __typename?: "DimensionRecord";
  name: Scalars["String"]["output"];
  value: Scalars["String"]["output"];
};

export type Entry = {
  __typename?: "Entry";
  dimensions: Array<DimensionRecord>;
  duration: Scalars["Float"]["output"];
  entryType: Scalars["String"]["output"];
};

export type FindWorkdaysInput = {
  end: Scalars["DateTime"]["input"];
  start: Scalars["DateTime"]["input"];
};

export type Mutation = {
  __typename?: "Mutation";
  addWorkdayEntry: Scalars["String"]["output"];
};

export type MutationAddWorkdayEntryArgs = {
  entry: AddWorkdayEntryInput;
};

export type Query = {
  __typename?: "Query";
  findDimensions: Array<Dimension>;
  findRecordTypes: Array<RecordType>;
  findWorkdays: Array<Workday>;
};

export type QueryFindWorkdaysArgs = {
  query: FindWorkdaysInput;
};

export type RecordType = {
  __typename?: "RecordType";
  name: Scalars["String"]["output"];
  ratioNumber: Scalars["Float"]["output"];
};

export type Workday = {
  __typename?: "Workday";
  date: Scalars["DateTime"]["output"];
  entries: Array<Entry>;
};

export type AddWorkdayEntryMutationVariables = Exact<{
  entry: AddWorkdayEntryInput;
}>;

export type AddWorkdayEntryMutation = { __typename?: "Mutation"; addWorkdayEntry: string };

export type FindDimensionNamesQueryVariables = Exact<{ [key: string]: never }>;

export type FindDimensionNamesQuery = {
  __typename?: "Query";
  findDimensions: Array<{ __typename?: "Dimension"; name: string }>;
};

export type FindDimensionsQueryVariables = Exact<{ [key: string]: never }>;

export type FindDimensionsQuery = {
  __typename?: "Query";
  findDimensions: Array<{ __typename?: "Dimension"; name: string; options: Array<string> }>;
};

export type FindRecordTypesQueryVariables = Exact<{ [key: string]: never }>;

export type FindRecordTypesQuery = {
  __typename?: "Query";
  findRecordTypes: Array<{ __typename?: "RecordType"; name: string; ratioNumber: number }>;
};

export type FindWorkdaysQueryVariables = Exact<{
  start: Scalars["DateTime"]["input"];
  end: Scalars["DateTime"]["input"];
}>;

export type FindWorkdaysQuery = {
  __typename?: "Query";
  findWorkdays: Array<{
    __typename?: "Workday";
    date: any;
    entries: Array<{
      __typename?: "Entry";
      duration: number;
      entryType: string;
      dimensions: Array<{ __typename?: "DimensionRecord"; name: string; value: string }>;
    }>;
  }>;
};

export const AddWorkdayEntryDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "AddWorkdayEntry" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "entry" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "AddWorkdayEntryInput" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "addWorkdayEntry" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "entry" },
                value: { kind: "Variable", name: { kind: "Name", value: "entry" } },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<AddWorkdayEntryMutation, AddWorkdayEntryMutationVariables>;
export const FindDimensionNamesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "FindDimensionNames" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "findDimensions" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [{ kind: "Field", name: { kind: "Name", value: "name" } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<FindDimensionNamesQuery, FindDimensionNamesQueryVariables>;
export const FindDimensionsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "FindDimensions" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "findDimensions" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "options" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<FindDimensionsQuery, FindDimensionsQueryVariables>;
export const FindRecordTypesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "FindRecordTypes" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "findRecordTypes" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "ratioNumber" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<FindRecordTypesQuery, FindRecordTypesQueryVariables>;
export const FindWorkdaysDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "FindWorkdays" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "start" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "DateTime" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "end" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "DateTime" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "findWorkdays" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "query" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "start" },
                      value: { kind: "Variable", name: { kind: "Name", value: "start" } },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "end" },
                      value: { kind: "Variable", name: { kind: "Name", value: "end" } },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "date" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "entries" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "duration" } },
                      { kind: "Field", name: { kind: "Name", value: "entryType" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "dimensions" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "name" } },
                            { kind: "Field", name: { kind: "Name", value: "value" } },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<FindWorkdaysQuery, FindWorkdaysQueryVariables>;
