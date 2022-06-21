import * as Yup from 'yup';

export const loginSchema = Yup.object({
  email: Yup.string().trim().email('Please enter a valid email').required(),
  password: Yup.string().trim().required('Password is required'),
});
