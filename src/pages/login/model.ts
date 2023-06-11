import { createEvent, createStore, combine } from "effector";
import { SignInError } from "../../shared/api";

// сторы обычно маленькие, они описывают 1 атомарное значение, напр., 2 поля формы, которые всегда изм вместе и др.
// events tell what happened, what the user did

export const emailChanged = createEvent<string>();
export const passwordChanged = createEvent<string>();
export const formSubmitted = createEvent();

export const $email = createStore("");
export const $emailError = createStore<null | "empty" | "invalid">(null);
export const $password = createStore("");
export const $passwordError = createStore<null | "empty" | "invalid">(null);

export const $passwordLoginPending = createStore(false);
export const $webauthPending = createStore(false);
export const $error = createStore<SignInError | null>(null);

export const $formDisabled = combine(
  $passwordLoginPending,
  $webauthPending,
  ($passwordLoginPending, $webauthPending) =>
    $passwordLoginPending || $webauthPending
);
