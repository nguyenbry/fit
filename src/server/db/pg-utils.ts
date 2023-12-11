import postgres from "postgres";

export function getHandlePgErrorOrRethrow(
  pgErrorHandler: (pgError: postgres.PostgresError) => void,
) {
  return (error: unknown) => {
    if (error instanceof postgres.PostgresError) {
      return pgErrorHandler(error);
    }
    throw error;
  };
}

export const PG_ERROR_CODES = {
  UNIQUE_VIOLATION: "23505",
} as const satisfies Record<string, `${number}`>;
