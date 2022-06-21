import * as Yup from 'yup';

export const loginSchema = Yup.object({
  email: Yup.string().trim().email('Please enter a valid email').required(),
  password: Yup.string().trim().required('Password is required'),
});

export const createItemSchema = Yup.object({
  name: Yup.string().trim().required('Item name is required'),
  totalStock: Yup.string().trim().required('Total stock is required'),
  price: Yup.string().trim().required('Price is required'),
  description: Yup.string()
    .trim()
    .required('Item description is required')
    .min(3, 'At least 3 characters required'),
});
