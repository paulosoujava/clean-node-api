
export interface HasheComparer {
  compare: (value: string, hashe: string) => Promise<boolean>
}
