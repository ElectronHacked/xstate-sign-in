import React, {useRef} from 'react';
import {Machine} from 'xstate';
import {useMachine} from '@xstate/react';
import Textfield from '@atlaskit/textfield';
import Button, {ButtonGroup} from '@atlaskit/button';
import {FormHeader, FormSection, FormFooter, ErrorMessage} from '@atlaskit/form';
import '@atlaskit/css-reset';
import {machineConfig, initMachineOptions} from '../../machines/authhentication';
import {defer} from 'lodash';

import {Page, Form, Label, ErrorMessagePlaceholder} from './styles';

export default () => {
  const emailInputRef = useRef();
  const passwordInputRef = useRef(null);
  const submitButtonRef = useRef(null);

  // using defer as workaround as body element was being focused instead of input element
  const handleEmailInputFocus = () => {
    defer(() => {
      if (emailInputRef && emailInputRef.current) {
        // @ts-ignore
        emailInputRef.current.focus();
      }
    });
  };

  const handlePasswordInputFocus = () => {
    defer(() => {
      if (emailInputRef && emailInputRef.current) {
        // @ts-ignore
        submitButtonRef.current.focus();
      }
    });
  };

  const handleSubmitButtonFocus = () => {
    defer(() => {
      // @ts-ignore
      submitButtonRef.current.focus();
    });
  };

  const machineOptions = initMachineOptions(handleEmailInputFocus, handlePasswordInputFocus, handleSubmitButtonFocus);

  // @ts-ignore
  const signInMachine = Machine(machineConfig, machineOptions);
  const [current, send] = useMachine(signInMachine);

  const handleEmailChange = (e: any) => {
    send({
      type: 'INPUT_EMAIL',
      // @ts-ignore
      email: e.target.value,
    });
  };

  const handlePasswordChange = (e: any) => {
    send({
      type: 'INPUT_PASSWORD',
      // @ts-ignore
      password: e.target.value,
    });
  };

  // @ts-ignore
  const handleSubmit = (e: any) => {
    e.preventDefault();
    send({
      type: 'SUBMIT',
    });
  };

  const handleCancel = () => {
    send({type: 'CANCEL'});
  };

  return (
    <Page>
      <p>
        Email: admin@admin.com
        <br />
        Password: admin
      </p>

      <Form onSubmit={handleSubmit} noValidate>
        <FormHeader title="Sign In" />

        <FormSection>
          <Label htmlFor="email">Email</Label>

          <Textfield
            name="email"
            id="email"
            // @ts-ignore
            value={current.context.email}
            ref={emailInputRef}
            onChange={handleEmailChange}
            isRequired
            disabled={current.matches('waitingResponse')}
            autoFocus
          />

          {current.matches('ready.email.error') ? (
            <ErrorMessage>
              {current.matches('ready.email.error.empty') && 'please enter your email'}
              {current.matches('ready.email.error.badFormat') && "email format doesn't look right"}
              {current.matches('ready.email.error.noAccount') && 'no account linked with this email'}
            </ErrorMessage>
          ) : (
            <ErrorMessagePlaceholder />
          )}

          <Label htmlFor="password">Password</Label>

          <Textfield
            id="password"
            name="password"
            label="Password"
            type="password"
            ref={passwordInputRef}
            // @ts-ignore
            value={current.comtext.password}
            disabled={current.matches('waitingResponse')}
            onChange={handlePasswordChange}
            isRequired
          />
        </FormSection>

        <FormFooter>
          <ButtonGroup>
            <Button appearance="subtle" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              appearance="primary"
              isLoading={current.matches('waitingResponse')}
              ref={submitButtonRef}
            >
              Sign In
            </Button>
            >
          </ButtonGroup>
        </FormFooter>
      </Form>
    </Page>
  );
};
