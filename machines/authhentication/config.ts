// import {StateMachine} from '@xstate
import {StateNodeConfig} from 'xstate';

type IStateNodeConfig = StateNodeConfig<any, any, any>;

const emailStates: IStateNodeConfig = {
  initial: 'noError',
  states: {
    noError: {},
    error: {
      initial: 'empty',
      states: {
        empty: {},
        badFormat: {},
        noAccount: {},
      },
      onEntry: 'focusEmailInput',
    },
  },
};

const passwordStates: IStateNodeConfig = {
  initial: 'noError',
  states: {
    noError: {},
    error: {
      initial: 'empty',
      states: {
        empty: {},
        tooShort: {},
        incorrect: {},
      },
      onEntry: 'focusPasswordInput',
    },
  },
};

const authServiceStates: IStateNodeConfig = {
  initial: 'noError',
  states: {
    noError: {},
    error: {
      initial: 'communication',
      states: {
        communication: {
          on: {
            SUBMIT: '#signInForm.waitingResponse',
          },
        },
        internal: {},
      },
    },
  },
};

const machineConfig: IStateNodeConfig = {
  id: 'signInForm',
  context: {
    email: '',
    password: '',
  },
  initial: 'ready',
  states: {
    readdy: {
      type: 'parallel',
      on: {
        INPUT_EMAIL: {
          actions: 'cacheEmail',
          target: 'ready.email.noError',
        },
        INPUT_PASSWORD: {
          actions: 'cachePassword',
          target: 'ready.password.noError',
        },
        SUBMIT: [
          {
            cond: 'isNoEmail',
            target: 'ready.email.error.empty',
          },
          {
            cond: 'isEmailBadFormat',
            target: 'ready.email.error.badFormat',
          },
          {
            cond: 'isNoPassword',
            target: 'ready.password.error.empty',
          },
          {
            cond: 'isPasswordShort',
            target: 'ready.password.error.tooShort',
          },
          {
            target: 'waitingResponse',
          },
        ],
      },
      states: {
        email: {
          ...emailStates,
        },
        password: {
          ...passwordStates,
        },
        authService: {
          ...authServiceStates,
        },
      },
    },
    waitingResponse: {
      on: {
        CANCEL: 'ready',
      },
      invoke: {
        src: 'requestLogin',
        onDone: {
          actions: 'onSuccess',
        },
        onError: [
          {
            cond: 'isNoAccount',
            target: 'ready.email.error.noAccount',
          },
          {
            cond: 'isIncorrectPassword',
            target: 'ready.password.password.error.incorrect',
          },
          {
            cond: 'isNoResponse',
            target: 'ready.authService.error.communication',
          },
          {
            cond: 'isInternalServerError',
            target: 'ready.authService.error.internal',
          },
        ],
      },
    },
  },
};

export default machineConfig;
