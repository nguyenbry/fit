import { z } from "zod";

/**
 * So it seems as though a server action can throw, but the client will only
 * receive the error as the Error class. This is a problem because I want to
 * know if the error is something I threw or something actually unexpected
 * that happened. So I'm going to make it so that I should throw whatever createErrorAsMyActionError()
 * returns in my actions, and that sort of makes it easy for me to tell if
 * the error is something I threw or something unexpected.
 *
 * I can then parse the error on the client using `parseActionErrorClient`.
 * This way I can show meaningful error messages to the user and let everything
 * else fail if I didn't expect it to happen. I could have simply shown a
 * toast for every single error, but my errors have friendly messages, but other
 * unexpected things probably do not.
 */

const actionError = z.object({
  message: z.string(),
  somethingUniqueSoIKnowItsMine: z.literal("my-action-error"),
});

type actionError = z.infer<typeof actionError>;

export function createErrorAsMyActionError(message: string) {
  return new Error(
    JSON.stringify({
      message,
      somethingUniqueSoIKnowItsMine: "my-action-error",
    } satisfies actionError),
  );
}

interface MyActionError extends Error {
  actionError: actionError["message"];
}

type Parsed =
  | {
      actionError: MyActionError;
      error: undefined;
    }
  | {
      actionError: undefined;
      error: Error;
    };

export function parseActionErrorClient(e: unknown): Parsed {
  const isError = e instanceof Error;

  if (!isError) throw new Error("how is this even possible");

  let asJSON;
  try {
    asJSON = JSON.parse(e.message) as unknown;
  } catch {
    // if it's not JSON, then it's not an error I threw
    return { actionError: undefined, error: e };
  }

  // if it is JSON, is it in the format I decided on?
  const actionErrorParsed = actionError.safeParse(asJSON);

  if (actionErrorParsed.success) {
    const actionError = e as MyActionError;
    actionError.actionError = actionErrorParsed.data.message;
    return { actionError, error: undefined };
  } else {
    return { actionError: undefined, error: e };
  }
}
