export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: string; output: string; }
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
  jiraNotificationIgnore?: InputMaybe<Scalars['Boolean']['input']>;
  productPreset?: InputMaybe<Scalars['String']['input']>;
  setRemainingHours?: InputMaybe<Scalars['Boolean']['input']>;
  showWeekend?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UserSettings = {
  __typename?: 'UserSettings';
  activityPreset?: Maybe<Scalars['String']['output']>;
  employeeNumber: Scalars['Float']['output'];
  jiraNotificationIgnore?: Maybe<Scalars['Boolean']['output']>;
  productPreset?: Maybe<Scalars['String']['output']>;
  setRemainingHours?: Maybe<Scalars['Boolean']['output']>;
  showWeekend?: Maybe<Scalars['Boolean']['output']>;
};

export type Workday = {
  __typename?: 'Workday';
  date: Scalars['DateTime']['output'];
  entries: Array<Entry>;
};
