import { emails } from './email';

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

export const getEmail = async (emailData) => {
  await wait(200);
  return emails.filter(email =>
    email.toLowerCase().startsWith(emailData.toLowerCase())
  );
};
