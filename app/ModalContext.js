'use client'
import { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [ count, setCount ]= useState("")
  const [ firstProfile, setFirstProfile ] = useState(0)
  const [ noprofile, setNoprofile ] = useState(0)


  return (
    <ModalContext.Provider value={{ showLogin, setShowLogin, showSignup,
      setShowSignup, count, setCount,  firstProfile, setFirstProfile, noprofile, setNoprofile}}>
      {children}
    </ModalContext.Provider>
  );
}

export const useModal = () => useContext(ModalContext);
