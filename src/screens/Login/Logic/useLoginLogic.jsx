import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  TwitterAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from 'firebase/auth';

import { authInstance } from '../../../config/firebase';

import { userLoadingBegins, userLoadingEnds } from '../../../features/user';
import { errorNofication } from '../../../features/notification';
import validateForm from '../../../utils/validateForm';

const useLoginLogic = () => {
  const dispatch = useDispatch();

  const history = useHistory();

  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const { userLoggedIn } = useSelector((state) => state.user.value);
  const lastTimeOutId = useRef(0);

  useEffect(() => {
    if (userLoggedIn) {
      history.push('/');
    }
  }, [history, userLoggedIn]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const emailValidationMessageTag = useRef(null);
  const passwordValidationMessageTag = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const error = validateForm(
      credentials,
      {
        emailValidationMessageTag,
        passwordValidationMessageTag,
      },
      lastTimeOutId,
      'SIGN_IN'
    );

    if (!error) {
      dispatch(userLoadingBegins());

      signInWithEmailAndPassword(
        authInstance,
        credentials.email,
        credentials.password
      )
        .then(() => {})
        .catch((err) => {
          dispatch(errorNofication(err.code.slice(5)));
          dispatch(userLoadingEnds());
        });
    }
  };

  const handleLoginViaTwitter = () => {
    dispatch(userLoadingBegins());

    const provider = new TwitterAuthProvider();

    signInWithPopup(authInstance, provider)
      .then(() => {})
      .catch(() => {
        dispatch(errorNofication('Account exists with different credentials!'));
        dispatch(userLoadingEnds());
      });
  };

  return {
    handleInput,
    credentials,
    handleSubmit,
    handleLoginViaTwitter,
    emailValidationMessageTag,
    passwordValidationMessageTag,
  };
};

export default useLoginLogic;
