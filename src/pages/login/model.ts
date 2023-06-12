import { createEvent, createStore, combine, sample, attach } from "effector";
import * as api from "../../shared/api";
import { and, debug, every, not, reset } from "patronum";

// сторы обычно маленькие, они описывают 1 атомарное значение, напр., 2 поля формы, которые всегда изм вместе и др.
// events tell what happened, what the user did
// модель дб макс наглядной, чем меньше неявных связей у нее, тем лучше (с первого взгляда говорит, что с ней будет происходить)

const signInFx = attach({ effect: api.signInFx });

export const pageMounted = createEvent();

export const emailChanged = createEvent<string>();
export const passwordChanged = createEvent<string>();
export const formSubmitted = createEvent();

export const $email = createStore("");
export const $emailError = createStore<null | "empty" | "invalid">(null);

export const $password = createStore("");
export const $passwordError = createStore<null | "empty" | "invalid">(null);

export const $error = createStore<api.SignInError | null>(null);

export const $passwordLoginPending = signInFx.pending;
export const $webauthPending = createStore(false);
export const $formDisabled = combine(
  $passwordLoginPending,
  $webauthPending,
  ($passwordLoginPending, $webauthPending) =>
    $passwordLoginPending || $webauthPending
);
const $formValid = every({
  stores: [$emailError, $passwordError],
  predicate: null,
});

reset({
  clock: pageMounted,
  target: [
    $email,
    $emailError,
    $password,
    $passwordError,
    $webauthPending,
    $error,
  ],
});

$email.on(emailChanged, (_, email) => email);
$password.on(passwordChanged, (_, password) => password);

$error.reset(formSubmitted);

sample({
  clock: formSubmitted,
  source: $email,
  fn: (email) => {
    if (isEmpty(email)) return "empty";
    if (!isEmailValid(email)) return "invalid";
    return null;
  },
  target: $emailError,
});

sample({
  clock: formSubmitted,
  source: $password,
  fn: (password) => {
    if (isEmpty(password)) return "empty";
    if (!isPasswordValid(password)) return "invalid";
    return null;
  },
  target: $passwordError,
});

sample({
  clock: formSubmitted,
  source: { email: $email, password: $password },
  filter: and(not($formDisabled), $formValid), // api.signInFx.pending.map((pending) => !pending)
  target: signInFx,
});

$error.on(signInFx.failData, (_, error) => error);

function isEmailValid(email: string) {
  return email.includes("@") && email.length > 5;
}
function isPasswordValid(email: string) {
  return email.length > 5;
}

function isEmpty(input: string) {
  return input.trim().length === 0;
}
