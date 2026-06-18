/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import type * as Types from './schema-types';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export * from './schema-types';
export type AddWorkdayEntryMutationVariables = Exact<{
  entry: Types.AddWorkdayEntryInput;
}>;


export type AddWorkdayEntryMutation = { addWorkdayEntry: string };

export type FindDimensionOptionsQueryVariables = Exact<{ [key: string]: never; }>;


export type FindDimensionOptionsQuery = { findDimensionOptions: { product: Array<string>, activity: Array<string>, issue: Array<string>, client: Array<string> } };

export type FindWorkdaysQueryVariables = Exact<{
  start: string;
  end: string;
}>;


export type FindWorkdaysQuery = { findWorkdays: Array<{ date: string, entries: Array<{ key: string, duration: number, durationInHours: boolean, description: string, acceptanceStatus: Types.AcceptanceStatus, typeName: string, ratioNumber: number | null, product: string | null, activity: string | null, issue: string | null, client: string | null }> }> };

export type GetSessionStatusQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSessionStatusQuery = { getSessionStatus: { employeeNumber: number | null } };

export type RemoveWorkdayEntryMutationVariables = Exact<{
  entry: Types.RemoveWorkdayEntryInput;
}>;


export type RemoveWorkdayEntryMutation = { removeWorkdayEntry: string };

export type ReplaceWorkdayEntryMutationVariables = Exact<{
  originalEntry: Types.RemoveWorkdayEntryInput;
  replacementEntry: Types.AddWorkdayEntryInput;
}>;


export type ReplaceWorkdayEntryMutation = { replaceWorkdayEntry: string };

export type GetMySettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMySettingsQuery = { getMySettings: { employeeNumber: number, productPreset: string | null, activityPreset: string | null, projectsPreset: Array<string> | null, jiraNotificationIgnore: boolean | null, showWeekend: boolean | null, setRemainingHours: boolean | null } };

export type UpdateSettingsMutationVariables = Exact<{
  settings: Types.UpdateSettingsDto;
}>;


export type UpdateSettingsMutation = { updateSettings: { employeeNumber: number } };


export const AddWorkdayEntryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddWorkdayEntry"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entry"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddWorkdayEntryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addWorkdayEntry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"entry"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entry"}}}]}]}}]} as unknown as DocumentNode<AddWorkdayEntryMutation, AddWorkdayEntryMutationVariables>;
export const FindDimensionOptionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindDimensionOptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findDimensionOptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"product"}},{"kind":"Field","name":{"kind":"Name","value":"activity"}},{"kind":"Field","name":{"kind":"Name","value":"issue"}},{"kind":"Field","name":{"kind":"Name","value":"client"}}]}}]}}]} as unknown as DocumentNode<FindDimensionOptionsQuery, FindDimensionOptionsQueryVariables>;
export const FindWorkdaysDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindWorkdays"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"start"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"end"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findWorkdays"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"start"},"value":{"kind":"Variable","name":{"kind":"Name","value":"start"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"end"},"value":{"kind":"Variable","name":{"kind":"Name","value":"end"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"entries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"durationInHours"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"acceptanceStatus"}},{"kind":"Field","name":{"kind":"Name","value":"typeName"}},{"kind":"Field","name":{"kind":"Name","value":"ratioNumber"}},{"kind":"Field","name":{"kind":"Name","value":"product"}},{"kind":"Field","name":{"kind":"Name","value":"activity"}},{"kind":"Field","name":{"kind":"Name","value":"issue"}},{"kind":"Field","name":{"kind":"Name","value":"client"}}]}}]}}]}}]} as unknown as DocumentNode<FindWorkdaysQuery, FindWorkdaysQueryVariables>;
export const GetSessionStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSessionStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getSessionStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"employeeNumber"}}]}}]}}]} as unknown as DocumentNode<GetSessionStatusQuery, GetSessionStatusQueryVariables>;
export const RemoveWorkdayEntryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveWorkdayEntry"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entry"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RemoveWorkdayEntryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeWorkdayEntry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"entry"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entry"}}}]}]}}]} as unknown as DocumentNode<RemoveWorkdayEntryMutation, RemoveWorkdayEntryMutationVariables>;
export const ReplaceWorkdayEntryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ReplaceWorkdayEntry"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"originalEntry"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RemoveWorkdayEntryInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"replacementEntry"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddWorkdayEntryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"replaceWorkdayEntry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"originalEntry"},"value":{"kind":"Variable","name":{"kind":"Name","value":"originalEntry"}}},{"kind":"Argument","name":{"kind":"Name","value":"replacementEntry"},"value":{"kind":"Variable","name":{"kind":"Name","value":"replacementEntry"}}}]}]}}]} as unknown as DocumentNode<ReplaceWorkdayEntryMutation, ReplaceWorkdayEntryMutationVariables>;
export const GetMySettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMySettings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getMySettings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"employeeNumber"}},{"kind":"Field","name":{"kind":"Name","value":"productPreset"}},{"kind":"Field","name":{"kind":"Name","value":"activityPreset"}},{"kind":"Field","name":{"kind":"Name","value":"projectsPreset"}},{"kind":"Field","name":{"kind":"Name","value":"jiraNotificationIgnore"}},{"kind":"Field","name":{"kind":"Name","value":"showWeekend"}},{"kind":"Field","name":{"kind":"Name","value":"setRemainingHours"}}]}}]}}]} as unknown as DocumentNode<GetMySettingsQuery, GetMySettingsQueryVariables>;
export const UpdateSettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateSettings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"settings"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateSettingsDto"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateSettings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"settings"},"value":{"kind":"Variable","name":{"kind":"Name","value":"settings"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"employeeNumber"}}]}}]}}]} as unknown as DocumentNode<UpdateSettingsMutation, UpdateSettingsMutationVariables>;