export class ProcessError {
  constructor(public code: number, public message: string, public stack?: string) {}
}
