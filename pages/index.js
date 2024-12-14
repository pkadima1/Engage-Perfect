import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { Sparkles } from 'lucide-react';

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyCCdSlqGXKOu2GXgR_PmB6d_uJsrff2dRU",
    authDomain: "perfectpost-9e5e8.firebaseapp.com",
    projectId: "perfectpost-9e5e8",
    storageBucket: "perfectpost-9e5e8.firebasestorage.app",
    messagingSenderId: "953139222342",
    appId: "1:953139222342:web:34e5225706423f90653747",
    measurementId: "G-K8NFQDM2ZF"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // Create user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Store user data
      await addDoc(collection(db, 'users'), {
        email: formData.email,
        userId: userCredential.user.uid,
        createdAt: new Date().toISOString()
      });

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row items-center justify-between">
        {/* Left side - Content */}
        <div className="md:w-1/2 text-white mb-8 md:mb-0">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 flex items-center">
            EngagePerfect
            <Sparkles className="w-8 h-8 ml-2 inline-block" />
          </h1>
          <p className="text-xl md:text-2xl mb-6">
            Generate engaging social media content tailored to your niche using AI
          </p>
          <ul className="space-y-4">
            <li className="flex items-center">
              <Sparkles className="w-5 h-5 mr-2" />
              Smart content ideas generation
            </li>
            <li className="flex items-center">
              <Sparkles className="w-5 h-5 mr-2" />
              Platform-specific captions
            </li>
            <li className="flex items-center">
              <Sparkles className="w-5 h-5 mr-2" />
              Analytics and insights
            </li>
          </ul>
        </div>

        {/* Right side - Sign up form */}
        <div className="md:w-1/2 max-w-md w-full">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Create your account
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>

              {errors.submit && (
                <p className="text-red-600 text-sm">{errors.submit}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  loading
                    ? 'bg-blue-400'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
              >
                {loading ? 'Creating account...' : 'Sign up'}
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => router.push('/login')}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Log in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}