//FIXME INSERT CORRECT DOMAIN
export const generateRegistrationLink = (id) => {
  return `https://localhost:5173/register/groupId=${id}`;
};

export const generateRandomPassword = () => {
  let password = '';
  let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$';

  for (let i = 1; i < 9; i++) {
    let index = Math.floor(Math.random() * str.length);
    password += str.charAt(index);
  }
  return password;
};
