import {
  TextInput,
  PasswordInput,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
  Modal,
  Flex,
  Center,
  rem,
  Box,
  Space,
} from "@mantine/core";
import {
  IconFaceId,
  IconAt,
  IconLock,
  IconArrowLeft,
} from "@tabler/icons-react";

import {
  $email,
  $emailError,
  $password,
  $passwordError,
  emailChanged,
  passwordChanged,
  $passwordLoginPending,
  $webauthPending,
  $error,
  formSubmitted,
  $formDisabled,
} from "./model";
import { useUnit } from "effector-react";
import { FormEventHandler } from "react";
import { debug } from "patronum";

export function AuthPage() {
  const [passwordLoginPending, webauthPending, onFormSubmitted, formDisabled] =
    useUnit([
      $passwordLoginPending,
      $webauthPending,
      formSubmitted,
      $formDisabled,
    ]);

  const onSubmit: FormEventHandler = (event) => {
    event.preventDefault();
    onFormSubmitted();
  };

  return (
    <>
      <Container size={420} my={40} w="100%" h="100vh">
        <Modal
          opened={false}
          onClose={close}
          title="Verify yout identity"
          centered
        >
          <Flex
            justify="center"
            direction="column"
            align="center"
            gap="sm"
            mt="sm"
          >
            <IconFaceId size="5rem" />
            <Text size="sm">needs to verify you</Text>
            <Button mt="lg" variant="subtle">
              use public key
            </Button>
          </Flex>
        </Modal>

        <Title
          align="center"
          sx={(theme) => ({
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            fontWeight: 900,
          })}
        >
          Welcome back!
        </Title>
        <Text color="dimmed" size="sm" align="center" mt={5}>
          Do not have an account yet?{" "}
          <Anchor size="sm" component="button">
            Create account
          </Anchor>
        </Text>

        <Paper
          component="form"
          withBorder
          shadow="md"
          p={30}
          mt={30}
          radius="md"
          onSubmit={onSubmit}
        >
          <Email />
          <Password />
          <Group position="apart" mt="lg">
            <Anchor component="button" size="sm" type="button">
              Forgot password?
            </Anchor>
          </Group>
          <ErrorView />
          <Button
            fullWidth
            mt="xl"
            type="submit"
            loading={passwordLoginPending}
            disabled={formDisabled}
          >
            Sign in
          </Button>
          <Button
            fullWidth
            mt="sm"
            variant="light"
            type="button"
            loading={webauthPending}
            disabled={formDisabled}
          >
            Use face id
          </Button>
        </Paper>
      </Container>
    </>
  );
}

const emailErrorText = {
  empty: "Email не может быть пустым",
  invalid: "Неверный формат email",
};

export function Email() {
  const [email, emailError, onEmailChanged, formDisabled] = useUnit([
    $email,
    $emailError,
    emailChanged,
    $formDisabled,
  ]);

  return (
    <TextInput
      label="email"
      placeholder="email"
      required
      icon={<IconAt size="0.8rem" />}
      value={email}
      onChange={(event) => onEmailChanged(event.target.value)}
      disabled={formDisabled}
      error={emailError ? emailErrorText[emailError] : null}
    />
  );
}

const passwordErrorText = {
  empty: "Email не может быть пустым",
  invalid: "Пароль слишком коротнкий",
};

export function Password() {
  const [password, passwordError, onPasswordChanged, formDisabled] = useUnit([
    $password,
    $passwordError,
    passwordChanged,
    $formDisabled,
  ]);

  return (
    <PasswordInput
      label="password"
      placeholder="your password"
      required
      mt="md"
      icon={<IconLock size="0.8rem" />}
      value={password}
      onChange={(event) => onPasswordChanged(event.target.value)}
      disabled={formDisabled}
      error={passwordError ? passwordErrorText[passwordError] : null}
    />
  );
}

export function ErrorView() {
  const error = useUnit($error);

  if (!error) {
    return <Space h="xl" />;
  }

  if (error?.error === "invalid_credentials") {
    return <Text c="red">Неверный логин и/или пароль</Text>;
  }

  console.log("ERROR", error);

  return (
    <Text c="red">Что-то пошло не так, попробуйте еще раз, пожалуйста</Text>
  );
}

export const ForgotPassword = () => {
  return (
    <>
      <Title align="center">Forgot your password?</Title>
      <Text c="dimmed" fz="sm" ta="center">
        Enter your email to get a reset link
      </Text>

      <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
        <TextInput label="Your email" placeholder="me@mantine.dev" required />
        <Group position="apart" mt="lg">
          <Anchor color="dimmed" size="sm">
            <Center inline>
              <IconArrowLeft size={rem(12)} stroke={1.5} />
              <Box ml={5}>Back to the login page</Box>
            </Center>
          </Anchor>
          <Button>Reset password</Button>
        </Group>
      </Paper>
    </>
  );
};
