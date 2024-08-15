import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export enum AcceptanceStatus {
  Accepted = 'Accepted',
  Checked = 'Checked',
  Open = 'Open',
  Paid = 'Paid'
}

export type AddWorkdayEntryInput = {
  activity?: InputMaybe<Scalars['String']['input']>;
  client?: InputMaybe<Scalars['String']['input']>;
  date: Scalars['DateTime']['input'];
  description: Scalars['String']['input'];
  duration: Scalars['Float']['input'];
  issue?: InputMaybe<Scalars['String']['input']>;
  product?: InputMaybe<Scalars['String']['input']>;
};

export type DimensionOptions = {
  __typename?: 'DimensionOptions';
  activity: Array<Scalars['String']['output']>;
  client: Array<Scalars['String']['output']>;
  issue: Array<Scalars['String']['output']>;
  product: Array<Scalars['String']['output']>;
};

export type Entry = {
  __typename?: 'Entry';
  acceptanceStatus: AcceptanceStatus;
  activity?: Maybe<Scalars['String']['output']>;
  client?: Maybe<Scalars['String']['output']>;
  description: Scalars['String']['output'];
  duration: Scalars['Float']['output'];
  durationInHours: Scalars['Boolean']['output'];
  issue?: Maybe<Scalars['String']['output']>;
  key: Scalars['String']['output'];
  product?: Maybe<Scalars['String']['output']>;
  ratioNumber?: Maybe<Scalars['Float']['output']>;
  typeName: Scalars['String']['output'];
};

export type FindWorkdaysInput = {
  end: Scalars['DateTime']['input'];
  start: Scalars['DateTime']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addWorkdayEntry: Scalars['String']['output'];
  removeWorkdayEntry: Scalars['String']['output'];
  replaceWorkdayEntry: Scalars['String']['output'];
  updateSettings: UserSettings;
};


export type MutationAddWorkdayEntryArgs = {
  entry: AddWorkdayEntryInput;
};


export type MutationRemoveWorkdayEntryArgs = {
  entry: RemoveWorkdayEntryInput;
};


export type MutationReplaceWorkdayEntryArgs = {
  originalEntry: RemoveWorkdayEntryInput;
  replacementEntry: AddWorkdayEntryInput;
};


export type MutationUpdateSettingsArgs = {
  settings: UpdateSettingsDto;
};

export type Query = {
  __typename?: 'Query';
  findDimensionOptions: DimensionOptions;
  findWorkdays: Array<Workday>;
  getMySettings: UserSettings;
  getSessionStatus: SessionStatus;
};


export type QueryFindWorkdaysArgs = {
  query: FindWorkdaysInput;
};

export type RemoveWorkdayEntryInput = {
  date: Scalars['DateTime']['input'];
  key: Scalars['String']['input'];
};

export type SessionStatus = {
  __typename?: 'SessionStatus';
  employeeNumber?: Maybe<Scalars['Float']['output']>;
};

export type UpdateSettingsDto = {
  activityPreset?: InputMaybe<Scalars['String']['input']>;
  productPreset?: InputMaybe<Scalars['String']['input']>;
  projectsPreset?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type UserSettings = {
  __typename?: 'UserSettings';
  activityPreset?: Maybe<Scalars['String']['output']>;
  employeeNumber: Scalars['Float']['output'];
  productPreset?: Maybe<Scalars['String']['output']>;
  projectsPreset?: Maybe<Array<Scalars['String']['output']>>;
};

export type Workday = {
  __typename?: 'Workday';
  date: Scalars['DateTime']['output'];
  entries: Array<Entry>;
};

export type AddWorkdayEntryMutationVariables = Exact<{
  entry: AddWorkdayEntryInput;
}>;


export type AddWorkdayEntryMutation = { __typename?: 'Mutation', addWorkdayEntry: string };

export type FindDimensionOptionsQueryVariables = Exact<{ [key: string]: never; }>;


export type FindDimensionOptionsQuery = { __typename?: 'Query', findDimensionOptions: { __typename?: 'DimensionOptions', product: Array<string>, activity: Array<string>, issue: Array<string>, client: Array<string> } };

export type FindWorkdaysQueryVariables = Exact<{
  start: Scalars['DateTime']['input'];
  end: Scalars['DateTime']['input'];
}>;


export type FindWorkdaysQuery = { __typename?: 'Query', findWorkdays: Array<{ __typename?: 'Workday', date: any, entries: Array<{ __typename?: 'Entry', key: string, duration: number, durationInHours: boolean, description: string, acceptanceStatus: AcceptanceStatus, typeName: string, ratioNumber?: number | null, product?: string | null, activity?: string | null, issue?: string | null, client?: string | null }> }> };

export type GetSessionStatusQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSessionStatusQuery = { __typename?: 'Query', getSessionStatus: { __typename?: 'SessionStatus', employeeNumber?: number | null } };

export type RemoveWorkdayEntryMutationVariables = Exact<{
  entry: RemoveWorkdayEntryInput;
}>;


export type RemoveWorkdayEntryMutation = { __typename?: 'Mutation', removeWorkdayEntry: string };

export type ReplaceWorkdayEntryMutationVariables = Exact<{
  originalEntry: RemoveWorkdayEntryInput;
  replacementEntry: AddWorkdayEntryInput;
}>;


export type ReplaceWorkdayEntryMutation = { __typename?: 'Mutation', replaceWorkdayEntry: string };

export type GetMySettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMySettingsQuery = { __typename?: 'Query', getMySettings: { __typename?: 'UserSettings', employeeNumber: number, productPreset?: string | null, activityPreset?: string | null, projectsPreset?: Array<string> | null } };

export type UpdateSettingsMutationVariables = Exact<{
  settings: UpdateSettingsDto;
}>;


export type UpdateSettingsMutation = { __typename?: 'Mutation', updateSettings: { __typename?: 'UserSettings', employeeNumber: number } };


export const AddWorkdayEntryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddWorkdayEntry"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entry"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddWorkdayEntryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addWorkdayEntry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"entry"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entry"}}}]}]}}]} as unknown as DocumentNode<AddWorkdayEntryMutation, AddWorkdayEntryMutationVariables>;
export const FindDimensionOptionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindDimensionOptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findDimensionOptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"product"}},{"kind":"Field","name":{"kind":"Name","value":"activity"}},{"kind":"Field","name":{"kind":"Name","value":"issue"}},{"kind":"Field","name":{"kind":"Name","value":"client"}}]}}]}}]} as unknown as DocumentNode<FindDimensionOptionsQuery, FindDimensionOptionsQueryVariables>;
export const FindWorkdaysDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindWorkdays"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"start"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"end"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findWorkdays"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"start"},"value":{"kind":"Variable","name":{"kind":"Name","value":"start"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"end"},"value":{"kind":"Variable","name":{"kind":"Name","value":"end"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"entries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"durationInHours"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"acceptanceStatus"}},{"kind":"Field","name":{"kind":"Name","value":"typeName"}},{"kind":"Field","name":{"kind":"Name","value":"ratioNumber"}},{"kind":"Field","name":{"kind":"Name","value":"product"}},{"kind":"Field","name":{"kind":"Name","value":"activity"}},{"kind":"Field","name":{"kind":"Name","value":"issue"}},{"kind":"Field","name":{"kind":"Name","value":"client"}}]}}]}}]}}]} as unknown as DocumentNode<FindWorkdaysQuery, FindWorkdaysQueryVariables>;
export const GetSessionStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSessionStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getSessionStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"employeeNumber"}}]}}]}}]} as unknown as DocumentNode<GetSessionStatusQuery, GetSessionStatusQueryVariables>;
export const RemoveWorkdayEntryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveWorkdayEntry"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entry"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RemoveWorkdayEntryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeWorkdayEntry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"entry"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entry"}}}]}]}}]} as unknown as DocumentNode<RemoveWorkdayEntryMutation, RemoveWorkdayEntryMutationVariables>;
export const ReplaceWorkdayEntryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ReplaceWorkdayEntry"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"originalEntry"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RemoveWorkdayEntryInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"replacementEntry"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddWorkdayEntryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"replaceWorkdayEntry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"originalEntry"},"value":{"kind":"Variable","name":{"kind":"Name","value":"originalEntry"}}},{"kind":"Argument","name":{"kind":"Name","value":"replacementEntry"},"value":{"kind":"Variable","name":{"kind":"Name","value":"replacementEntry"}}}]}]}}]} as unknown as DocumentNode<ReplaceWorkdayEntryMutation, ReplaceWorkdayEntryMutationVariables>;
export const GetMySettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMySettings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getMySettings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"employeeNumber"}},{"kind":"Field","name":{"kind":"Name","value":"productPreset"}},{"kind":"Field","name":{"kind":"Name","value":"activityPreset"}},{"kind":"Field","name":{"kind":"Name","value":"projectsPreset"}}]}}]}}]} as unknown as DocumentNode<GetMySettingsQuery, GetMySettingsQueryVariables>;
export const UpdateSettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateSettings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"settings"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateSettingsDto"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateSettings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"settings"},"value":{"kind":"Variable","name":{"kind":"Name","value":"settings"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"employeeNumber"}}]}}]}}]} as unknown as DocumentNode<UpdateSettingsMutation, UpdateSettingsMutationVariables>;