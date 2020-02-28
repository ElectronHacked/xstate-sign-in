const isNoResponse = () => Math.random() >= 0.75;

const VALID_EMAIL = 'admin@admin.com';
const PASSWORD = 'admin';

export const signIn = (email: string, password: string) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email !== VALID_EMAIL) {
        reject({
          code: 1,
        });
      }

      if (password !== PASSWORD) {
        reject({code: 3});
      }

      if (isNoResponse()) {
        reject({code: 3});
      }

      resolve();
    }, 1500);
  });
