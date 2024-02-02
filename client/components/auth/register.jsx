import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import * as bi from 'react-icons/bi';
import config from '../../config';

function Register({ setRespond }) {
  const [process, setProcess] = useState(false);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });

  // Validation function
  const validateForm = () => {
    const usernamePattern = /^[a-zA-Z0-9_-]{3,24}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

    if (!usernamePattern.test(form.username)) {
      setRespond({
        success: false,
        message:
          'Username must be 3-24 characters and may contain only letters, numbers, underscores, and hyphens.',
      });
      return false;
    }

    if (!emailPattern.test(form.email)) {
      setRespond({
        success: false,
        message: 'Invalid email address.',
      });
      return false;
    }

    if (!passwordPattern.test(form.password)) {
      setRespond({
        success: false,
        message:
          'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number.',
      });
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      // Add your validation logic here before proceeding with the submission
      if (!validateForm()) {
        return;
      }

      setProcess(true);

      const { data } = await axios.post('/users/register', form);

      // set success response
      setRespond({ success: true, message: data.message });

      // reset form
      setForm({
        username: '',
        email: '',
        password: '',
      });

      setTimeout(() => {
        // set localStorage
        localStorage.setItem('token', data.payload);
        localStorage.setItem(
          'cache',
          JSON.stringify({ remember: form.username })
        );

        setProcess(false);

        window.location.reload();
      }, 1000);
    } catch (error0) {
      setProcess(false);

      setRespond({
        success: false,
        message: error0.response.data.message,
      });
    }
  };

  return (
    <form method="post" className="grid gap-2" onSubmit={handleSubmit}>
      <Helmet>
        <title>{`Sign up - ${config.brandName}`}</title>
      </Helmet>
      {[
        {
          target: 'username',
          type: 'text',
          placeholder: 'Username',
          icon: <bi.BiAt size={20} />,
        },
        {
          target: 'email',
          type: 'email',
          placeholder: 'Email address',
          icon: <bi.BiEnvelope size={20} />,
        },
        {
          target: 'password',
          type: 'password',
          placeholder: 'Password',
          icon: <bi.BiLockOpenAlt size={20} />,
        },
      ].map((elem) => (
        <label
          key={elem.target}
          htmlFor={elem.target}
          className="relative flex items-center"
        >
          <i className="absolute translate-x-4">{elem.icon}</i>
          <input
            type={elem.type}
            name={elem.target}
            id={elem.target}
            placeholder={elem.placeholder}
            className={`${
              form[elem.target].length > 0 ? 'peer valid:bg-gray-50' : ''
            } w-full py-2 px-12 border border-solid border-gray-300 rounded-md focus:border-gray-900`}
            value={form[elem.target]}
            onChange={handleChange}
            required
          />
          <bi.BiCheck className="absolute right-0 text-xl text-sky-600 hidden peer-valid:block -translate-x-4" />
          <bi.BiX className="absolute right-0 text-xl text-rose-600 hidden peer-invalid:block -translate-x-4" />
        </label>
      ))}
      {/* notice of terms */}
      <span className="mt-2 text-sm">
        <p>
          {`Unlock the door to communication by contacting us with any inquiries, questions, or curiosities about the ${config.brandName} web-based application. `}
          <a href="https://jharohit.com.np/" className="text-sky-800">
            Contact Us
          </a>
        </p>
        <p className="mt-2">
          {'By Signing Up, you agree to our '}
          <a href="/" className="text-sky-800">
            Terms
          </a>
          {', '}
          <a href="/" className="text-sky-800">
            Privacy Policy
          </a>
          {' and '}
          <a href="/" className="text-sky-800">
            Cookies Policy
          </a>
          {'. '}
        </p>
      </span>
      <button
        type="submit"
        className="font-bold mt-6 py-2 flex justify-center rounded-md text-white bg-sky-600 hover:bg-sky-700"
        disabled={process}
      >
        {process ? (
          <i className="animate-spin">
            <bi.BiLoaderAlt />
          </i>
        ) : (
          <p>Sign Up</p>
        )}
      </button>
    </form>
  );
}

export default Register;
