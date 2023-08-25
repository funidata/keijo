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

export type Entry = {
  __typename?: "Entry";
  duration: Scalars["Float"]["output"];
  entryType: Scalars["String"]["output"];
};

export type FindWorkdaysQuery = {
  end: Scalars["DateTime"]["input"];
  start: Scalars["DateTime"]["input"];
};

export type Query = {
  __typename?: "Query";
  findWorkdays: Array<Workday>;
};

export type QueryFindWorkdaysArgs = {
  query: FindWorkdaysQuery;
};

export type Workday = {
  __typename?: "Workday";
  date: Scalars["DateTime"]["output"];
  entries: Array<Entry>;
};

export type AsdQueryVariables = Exact<{ [key: string]: never }>;

export type AsdQuery = {
  __typename?: "Query";
  findWorkdays: Array<{
    __typename?: "Workday";
    date: any;
    entries: Array<{ __typename?: "Entry"; duration: number; entryType: string }>;
  }>;
};

export const AsdDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "Asd" },
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
                      value: { kind: "StringValue", value: "2023-01-01", block: false },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "end" },
                      value: { kind: "StringValue", value: "asd", block: false },
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
} as unknown as DocumentNode<AsdQuery, AsdQueryVariables>;
