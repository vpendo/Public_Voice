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
    footer: {
      tagline: "Empowering communities through transparent civic engagement.",
      quickLinks: "Quick Links",
      contact: "Contact Us",
      copyright: "© PublicVoice. All rights reserved.",
    },
    home: {
      hero: {
        title: "PublicVoice",
        description: "Digital civic engagement platform connecting citizens with authorities.",
        exploreServices: "Explore Services",
        getInTouch: "Get In Touch"
      },
      howItWorks: {
        title: "How It Works",
        subtitle: "Three simple steps to make your voice heard",
        step1: {
          title: "Report Issue",
          description: "Submit community problems with details and location."
        },
        step2: {
          title: "Auto Categorize",
          description: "Intelligent routing to the right authorities."
        },
        step3: {
          title: "Track Progress",
          description: "Monitor status from submission to resolution."
        }
      },
      whyMatters: {
        title: "Why PublicVoice Matters",
        transparency: {
          title: "Transparency",
          description: "Every report visible to the community for accountability."
        },
        fasterResponse: {
          title: "Faster Response",
          description: "Streamlined process for quicker issue resolution."
        },
        citizenPower: {
          title: "Citizen Power",
          description: "Empower every voice in community improvement."
        }
      },
      cta: {
        title: "Make Your Voice Heard",
        description: "Have an issue in your community? Report it now.",
        button: "Report a Problem"
      }
    },
    services: {
      hero: {
        title: "Our Services",
        description: "Empowering communities with innovative civic engagement tools"
      },
      service1: {
        title: "Report Problems",
        description: "Submit community issues with details, location, and evidence."
      },
      service2: {
        title: "Smart Categorization",
        description: "Intelligent logic automatically routes reports to the right department."
      },
      service3: {
        title: "Track & Feedback",
        description: "Real-time status updates from submission to resolution."
      },
      button: "Report a Problem"
    },
    about: {
      hero: {
        title: "About PublicVoice",
        description: "Transforming civic engagement through technology"
      },
      whoWeAre: {
        title: "Who We Are",
        description: "PublicVoice is a civic-tech platform strengthening communication between citizens and local authorities through transparent, accessible channels."
      },
      problem: {
        title: "The Problem",
        issue1: "Lack of accessible reporting channels",
        issue2: "Reports ignored or undocumented",
        issue3: "No transparency in issue resolution",
        issue4: "Limited accountability mechanisms"
      },
      mission: {
        title: "Our Mission",
        description: "Empower citizens through technology by enabling transparent, inclusive, and accountable governance."
      },
      vision: {
        title: "Our Vision",
        description: "Communities where every voice is heard and acted upon through transparent collaboration."
      }
    },
    contact: {
      hero: {
        title: "Contact Us",
        description: "Get in touch with our team"
      },
      form: {
        title: "Send Us a Message",
        name: "Name",
        email: "Email",
        message: "Message",
        namePlaceholder: "Your full name",
        emailPlaceholder: "your.email@example.com",
        messagePlaceholder: "Your message here...",
        button: "Send Message"
      },
      info: {
        title: "Contact Information",
        email: "Email",
        location: "Location",
        locationText: "Serving communities in Rwanda"
      },
      successMessage: "Thank you for your message! We will get back to you soon. (Note: Backend integration will be implemented in future versions.)"
    },
    login: {
      title: "Sign In",
      subtitle: "Access your PublicVoice account",
      email: "Email",
      password: "Password",
      emailPlaceholder: "your.email@example.com",
      passwordPlaceholder: "Enter your password",
      button: "Login",
      noAccount: "Don't have an account?",
      signUp: "Sign up",
      backToHome: "← Back to Home",
      alertMessage: "Authentication logic will be implemented in future versions."
    },
    register: {
      title: "Sign Up",
      subtitle: "Create your PublicVoice account",
      fullName: "Full Name",
      email: "Email",
      password: "Password",
      role: "Role (Optional)",
      fullNamePlaceholder: "Your full name",
      emailPlaceholder: "your.email@example.com",
      passwordPlaceholder: "Create a password",
      roleCitizen: "Citizen",
      roleAdmin: "Admin",
      button: "Register",
      hasAccount: "Already have an account?",
      signIn: "Sign in",
      backToHome: "← Back to Home",
      alertMessage: "Registration logic will be implemented in future versions."
    },
    report: {
      hero: {
        title: "Report a Problem",
        description: "Help improve your community by reporting issues"
      },
      form: {
        title: "Describe Your Issue",
        category: "Category",
        categoryPlaceholder: "Select a category",
        description: "Describe Problem",
        descriptionPlaceholder: "Please provide details about the issue, including location, severity, and any other relevant information...",
        button: "Submit Report"
      },
      categories: {
        select: "Select a category",
        roads: "Roads & Infrastructure",
        water: "Water Supply",
        security: "Security & Safety",
        sanitation: "Sanitation & Waste",
        electricity: "Electricity",
        health: "Health Services",
        education: "Education",
        other: "Other"
      },
      whyReport: {
        title: "Why Report?",
        reason1: "Help authorities prioritize issues",
        reason2: "Track progress in real-time",
        reason3: "Improve your community"
      },
      successMessage: "Thank you for your report! Your issue has been submitted. (Note: Backend integration will be implemented in future versions.)"
    }
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
    footer: {
      tagline: "Twubaka imiryango biteye imbere kuburyo bugaragaza.",
      quickLinks: "Amakuru",
      contact: "Twandikire",
      copyright: "© PublicVoice. Amategeko yose agenga.",
    },
    home: {
      hero: {
        title: "PublicVoice",
        description: "Porogaramu y'ubugenzacyaha ikunga abaturage n'abategetsi.",
        exploreServices: "Reba Serivisi",
        getInTouch: "Twandikire"
      },
      howItWorks: {
        title: "Uko Ikora",
        subtitle: "Intambwe zitatu zoroheje zo gukoresha ijwi ryawe",
        step1: {
          title: "Tanga Ikibazo",
          description: "Ohereza ibibazo by'umuryango hamwe n'amakuru n'ahantu."
        },
        step2: {
          title: "Gutondekanya mu Buryo Bw'Ubwenge",
          description: "Guhaguruka mu buryo bw'ubwenge ku bantu b'ibanze."
        },
        step3: {
          title: "Kurikirana Iterambere",
          description: "Kurikirana imiterere kuva kuherezwa kugeza ku gukemura."
        }
      },
      whyMatters: {
        title: "Kuki PublicVoice Ifite Agaciro",
        transparency: {
          title: "Kugaragaza",
          description: "Raporo yose iboneka ku muryango wose kugirango haboneke ibyangombwa."
        },
        fasterResponse: {
          title: "Gusubiza Vuba",
          description: "Inzira yoroshye yo gukemura ibibazo vuba."
        },
        citizenPower: {
          title: "Imbaraga z'Abaturage",
          description: "Gutanga imbaraga ku ijwi ryose mu guteza imbere umuryango."
        }
      },
      cta: {
        title: "Koresha IJwi Ryawe",
        description: "Ufite ikibazo mu muryango wawe? Ohereza ubu.",
        button: "Tanga Ikibazo"
      }
    },
    services: {
      hero: {
        title: "Serivisi Zacu",
        description: "Gutanga imbaraga imiryango hamwe n'ibikoresho by'ubugenzacyaha byashya"
      },
      service1: {
        title: "Tanga Ibibazo",
        description: "Ohereza ibibazo by'umuryango hamwe n'amakuru, ahantu, n'ubwoba."
      },
      service2: {
        title: "Gutondekanya mu Buryo Bw'Ubwenge",
        description: "Inzira y'ubwenge ikoresha mu buryo bwikora kugirango ihereze raporo ku serivisi z'ibanze."
      },
      service3: {
        title: "Kurikirana no Gutanga Inama",
        description: "Amakuru y'igihe cyose kuva kuherezwa kugeza ku gukemura."
      },
      button: "Tanga Ikibazo"
    },
    about: {
      hero: {
        title: "Ibyerekeye PublicVoice",
        description: "Guhindura ubugenzacyaha binyuze mu ikoranabuhanga"
      },
      whoWeAre: {
        title: "Abantu Turibo",
        description: "PublicVoice ni porogaramu y'ikoranabuhanga y'ubugenzacyaha ikomeza ubwiyunge hagati y'abaturage n'abategetsi bo mu karere binyuze mu nzira zirabagaragaza, ziboneka."
      },
      problem: {
        title: "Ikibazo",
        issue1: "Ntacyo kiboneka cyohereza raporo",
        issue2: "Raporo zirengagizwa cyangwa ntizandikwe",
        issue3: "Nta kugaragaza mu gukemura ibibazo",
        issue4: "Inzira nke z'ibyangombwa"
      },
      mission: {
        title: "Intego Zacu",
        description: "Gutanga imbaraga abaturage binyuze mu ikoranabuhanga binyuze mu guteza imbere ubuyobozi buragaragaza, bukubiyemo, kandi bukaba n'ibyangombwa."
      },
      vision: {
        title: "Icyerekezo Cyacu",
        description: "Imyirango aho ijwi ryose rwumvwa kandi rikagirwa akazi binyuze mu gukorana mu buryo buragaragaza."
      }
    },
    contact: {
      hero: {
        title: "Twandikire",
        description: "Vugana n'itsinda ryacu"
      },
      form: {
        title: "Ohereza Ubutumwa",
        name: "Amazina",
        email: "Imeyili",
        message: "Ubutumwa",
        namePlaceholder: "Amazina yawe yuzuye",
        emailPlaceholder: "imeyili.yawe@urugero.com",
        messagePlaceholder: "Ubutumwa bwawe hano...",
        button: "Ohereza Ubutumwa"
      },
      info: {
        title: "Amakuru yo Kuvugana",
        email: "Imeyili",
        location: "Ahantu",
        locationText: "Gufasha imiryango mu Rwanda"
      },
      successMessage: "Murakoze ku butumwa bwawe! Tuzasubiza vuba. (Icyitonderwa: Gukomeza guhuza na backend bizakorwa mu mihindagurikire y'igihe kizaza.)"
    },
    login: {
      title: "Injira",
      subtitle: "Kwinjira mu konti yawe ya PublicVoice",
      email: "Imeyili",
      password: "Ijambobanga",
      emailPlaceholder: "imeyili.yawe@urugero.com",
      passwordPlaceholder: "Injiza ijambobanga ryawe",
      button: "Injira",
      noAccount: "Ntugira konti?",
      signUp: "Kwiyandikisha",
      backToHome: "← Subira ku Ntangiriro",
      alertMessage: "Inzira y'ubwiyemezi izakorwa mu mihindagurikire y'igihe kizaza."
    },
    register: {
      title: "Kwiyandikisha",
      subtitle: "Kurema konti yawe ya PublicVoice",
      fullName: "Amazina Yuzuye",
      email: "Imeyili",
      password: "Ijambobanga",
      role: "Urwego (Bihitamo)",
      fullNamePlaceholder: "Amazina yawe yuzuye",
      emailPlaceholder: "imeyili.yawe@urugero.com",
      passwordPlaceholder: "Kurema ijambobanga",
      roleCitizen: "Umuturage",
      roleAdmin: "Umuyobozi",
      button: "Kwiyandikisha",
      hasAccount: "Ufite konti?",
      signIn: "Injira",
      backToHome: "← Subira ku Ntangiriro",
      alertMessage: "Inzira y'iyandikisha izakorwa mu mihindagurikire y'igihe kizaza."
    },
    report: {
      hero: {
        title: "Tanga Ikibazo",
        description: "Gufasha guteza imbere umuryango wawe binyuze mu gutanga ibibazo"
      },
      form: {
        title: "Sobanura Ikibazo Cyawe",
        category: "Icyiciro",
        categoryPlaceholder: "Hitamo icyiciro",
        description: "Sobanura Ikibazo",
        descriptionPlaceholder: "Nyamuneka tanga amakuru ku kibazo, harimo ahantu, ubukana, n'andi makuru afite agaciro...",
        button: "Ohereza Raporo"
      },
      categories: {
        select: "Hitamo icyiciro",
        roads: "Imihanda n'Ubwubatsi",
        water: "Amazi",
        security: "Umutekano n'Umutekano",
        sanitation: "Gukoresha neza n'Imyanda",
        electricity: "Amashanyarazi",
        health: "Serivisi z'Ubuzima",
        education: "Uburezi",
        other: "Ikindi"
      },
      whyReport: {
        title: "Kuki Watanze Raporo?",
        reason1: "Gufasha abategetsi guhitamo ibibazo",
        reason2: "Kurikirana iterambere mu gihe cy'ukuri",
        reason3: "Guteza imbere umuryango wawe"
      },
      successMessage: "Murakoze ku raporo yawe! Ikibazo cyawe cyoherejwe. (Icyitonderwa: Gukomeza guhuza na backend bizakorwa mu mihindagurikire y'igihe kizaza.)"
    }
  },
};