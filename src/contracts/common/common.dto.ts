export class SuccessDto {
  success = true as const;
}

export class ErrorDto {
  success = false as const;
  constructor(
    public error: Record<string, any> | { status: number; message: string },
  ) {}
}
