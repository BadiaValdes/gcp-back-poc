
export interface ISessions {
  setValue(key: string, value: any): void;
  removeValue(key: string): void;
  getValue(key: string): any | undefined;
}
