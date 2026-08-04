import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from "class-validator";

export class JiraSearchJqlDto {
  @IsString()
  @IsNotEmpty()
  jql: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  fields?: string[];

  @IsOptional()
  @IsInt()
  @Min(1)
  maxResults?: number;
}

export class JiraSearchTextDto {
  @IsString()
  @IsNotEmpty()
  searchTerm: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxResults?: number;
}

export class JiraSearchKeyDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(100)
  @IsString({ each: true })
  keys: string[];

  @IsOptional()
  @IsInt()
  @Min(1)
  maxResults?: number;
}

export class JiraSearchRecentDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  nvIssueKeys: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  projectsPreset?: string[];

  @IsOptional()
  @IsInt()
  @Min(1)
  maxResults?: number;
}
