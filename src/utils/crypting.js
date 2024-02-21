import bcrypt from 'bcrypt';

const saltRounds = parseInt(process.env.SALT_ROUNDS);
export const hashPassword = async (password) => {
  try {
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    console.error(error);
  }
};

export const comparePasswords = async (passwordFromUser, passwordFromDb) => {
  try {
    return await bcrypt.compare(passwordFromUser, passwordFromDb);
  } catch (error) {
    console.error(error);
  }
};
