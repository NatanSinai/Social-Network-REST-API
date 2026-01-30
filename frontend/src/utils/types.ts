import type { Dispatch, SetStateAction } from 'react';

export type RemoveKeys<T, KeysToRemove extends keyof T> = {
  [Key in keyof T as Key extends KeysToRemove ? never : Key]: T[Key];
};

export type StringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

export type ConvertStringKeysToDate<T, StringKeysToConvert extends StringKeys<T>> = ConvertKeysToType<
  T,
  StringKeysToConvert,
  Date
>;

export type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];

export type MakeKeysRequired<T, KeysToMakeRequired extends OptionalKeys<T>> = Prettify<
  Omit<T, KeysToMakeRequired> & {
    [Key in keyof T as Key extends KeysToMakeRequired ? Key : never]-?: T[Key];
  }
>;

export type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

export type MakeKeysOptional<T, KeysToMakeOptional extends RequiredKeys<T>> = Prettify<
  Omit<T, KeysToMakeOptional> & {
    [Key in keyof T as Key extends KeysToMakeOptional ? Key : never]?: T[Key];
  }
>;

export type ConvertKeysToType<T, Keys extends keyof T, Type> = Prettify<Omit<T, Keys> & { [Key in Keys]: Type }>;

export type Prettify<T> = { [K in keyof T]: T[K] } & {};

export type SetState<T> = Dispatch<SetStateAction<T>>;

export type UseStateContent<Name extends string, T> = Prettify<
  { [K in Name]: T } & { [K in `set${Capitalize<Name>}`]: SetState<T> }
>;
