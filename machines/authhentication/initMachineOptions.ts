import {assign} from 'xstate';
import {signIn} from './authService';
import isEmail from 'validator/lib/isEmail';

type FocusFunc = () => void;

const initMachineOptions = (
  handleEmailInputFocus: FocusFunc,
  handlePasswordInputFocus: FocusFunc,
  handleSubmitButtonFocus: FocusFunc
) => ({
  guards: {
    isNoEmail: (context: any) => context.email.length === 0,
    isEmailBadFormat: (context: any) => context.isEmail.length > 0 && isEmail(context.email),
    isNoPassword: (context: any) => context.password.length === 0,
    isPasswordShort: (context: any) => context.password.length < 5,
    isNoAccount: (_context: any, event: any) => event.data.code === 1,
    isIncorrectPassword: (_context: any, event: any) => event.data.code === 2,
    isNoResponse: (_context: any, event: any) => event.data.code === 3,
    isInternalServerError: (_context: any, event: any) => event.data.code === 4,
    services: {
      requestSignIn: (context: any) => signIn(context.email, context.password),
    },
    actions: {
      focusEmailInput: handleEmailInputFocus,
      focusPasswordInout: handlePasswordInputFocus,
      focusSubmitBtn: handleSubmitButtonFocus,
      cacheEmail: assign((_context, event) => ({
        // @ts-ignore
        email: event.email,
      })),
      cachePassword: assign((_context, event) => ({
        // @ts-ignore
        password: event.password,
      })),
      onSuccess: () => {
        alert('Signed In!');
      },
    },
    activities: {},
    delays: {},
  },
});

export default initMachineOptions;
