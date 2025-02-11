import * as React from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';

import "./SignUp.scss";

import FirstPartSignUp from "./FirstPartSignUp";
import SecondPartSignUp from "./SecondPartSignUp";

type FirstInputs = {
  lastName: string;
  firstName: string;
  email: string;
};


export default function SingUp() {
  const [onNext, setOnNext] = React.useState(false);
  const [firstDate, setFirstData] = React.useState<FirstInputs>({
    firstName: '',
    lastName: '',
    email: ''
  })

  const handleNavigateNext = (data: FirstInputs) => {
    setFirstData(data);
    setOnNext(!onNext);
  }

  return (
    <div className="sign-up-container">
      <div className="header">Sign Up</div>
      <div className="form-container">
        {!onNext ? (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <FirstPartSignUp onNavigateNext={handleNavigateNext} />
            </motion.div>
          </AnimatePresence>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
             <SecondPartSignUp data={firstDate} />
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
