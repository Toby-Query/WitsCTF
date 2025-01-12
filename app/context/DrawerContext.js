// context/DrawerContext.js

import { createContext, useContext, useState } from "react";

// Create the context
const DrawerContext = createContext();

// Create a provider component
export const DrawerProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DrawerContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </DrawerContext.Provider>
  );
};

// Create a custom hook to use the drawer context
export const useDrawer = () => {
  return useContext(DrawerContext);
};
