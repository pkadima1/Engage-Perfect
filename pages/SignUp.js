// pages/signup.js
import React, { useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';

const SignUp = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Your existing validation code here...

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccessMessage('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await addDoc(collection(db, 'users'), {
        email: formData.email,
        userId: userCredential.user.uid,
        signupDate: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      });

      setSuccessMessage('Account created successfully!');
      router.push('/app');
    } catch (error) {
      console.error('Error creating user:', error);
      if (error.code === 'auth/email-already-in-use') {
        setErrors({ email: 'Email is already registered' });
      } else {
        setErrors({ submit: 'Failed to create account. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  // Rest of your SignUp component JSX...
};

export default SignUp;