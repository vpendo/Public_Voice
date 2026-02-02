export type Language = 'English' | 'Kinyarwanda';

// Use Record<Language, any> to tell TS that 'English' and 'Kinyarwanda' are valid keys
export const content: Record<Language, any> = {
  English: {
    nav: { 
      home: "Home",
      about: "About Us", 
      services: "Our Services", 
      contact: "Contact Us", 
      login: "Login",
      register: "Register"
    },
    
  },
  Kinyarwanda: {
    nav: { 
      home: "Ahabanza",
      about: "Abo Turibo", 
      services: "Serivisi Zacu", 
      contact: "Twandikire", 
      login: "Injira",
      register: "Kwiyandikisha"
    },
    
  },
};