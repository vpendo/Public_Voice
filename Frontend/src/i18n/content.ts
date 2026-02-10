export type Language = 'English' | 'Kinyarwanda';

// Use Record<Language, any> to tell TS that 'English' and 'Kinyarwanda' are valid keys
export const content: Record<Language, any> = {
  English: {
    nav: { 
      home: "Home",
      services: "Our Services",
      report: "Report",
      about: "About Us", 
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
        description: "Rwanda's civic engagement platform—connect with local authorities and make your community better.",
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
        description: "Tools for Rwandan citizens and local authorities to report, route, and resolve community issues"
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
        description: "Civic-tech for Rwanda—transforming how citizens and local authorities work together"
      },
      rwandaReach: {
        title: "Serving All of Rwanda",
        description: "From Kigali to every province and district. PublicVoice connects citizens with local government for faster, transparent issue resolution."
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
        description: "Reach the PublicVoice team—we serve citizens and partners across Rwanda"
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
      welcomeBack: "Welcome Back.",
      welcomeSubtitle: "Access your PublicVoice account and community reports.",
      signInHeadline: "Sign in to the admin dashboard",
      overlayTitle: "Admin Sign In",
      overlayTagline: "Access the dashboard to view and manage citizen reports.",
      adminOnlyNote: "For administrators only. Citizens can report without an account.",
      title: "Sign In",
      subtitle: "Access your PublicVoice admin dashboard",
      step2Subtitle: "Enter your password",
      email: "Email",
      password: "Password",
      emailPlaceholder: "your.email@example.com",
      passwordPlaceholder: "Enter your password",
      button: "Sign In",
      next: "Next",
      back: "Back",
      changeEmail: "Use a different email",
      forgotPassword: "Forgot?",
      passwordRequired: "Password is required",
      rememberMe: "Remember me",
      orContinueWith: "or continue with",
      continueWithGoogle: "Continue with Google",
      noAccount: "Don't have an account?",
      signUp: "Register Now",
      backToHome: "← Back to Home",
      alertMessage: "Authentication logic will be implemented in future versions."
    },
    register: {
      title: "Sign Up",
      subtitle: "Create your PublicVoice account",
      signUpHeadline: "Create your account to get started",
      overlayTitle: "Admin Registration",
      overlayTagline: "Create an admin account to access the dashboard and manage reports.",
      adminOnlyNote: "For administrators only. Citizens submit reports from the Report page.",
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
        description: "Report community issues across Rwanda."
      },
      form: {
        title: "Submit Your Report",
        name: "Full Name",
        namePlaceholder: "Your full name",
        phone: "Phone Number",
        phonePlaceholder: "e.g. 0781234567",
        location: "Location",
        locationPlaceholder: "District, sector, cell or landmark",
        institution: "Tag institution where the problem is",
        institutionPlaceholder: "Select the institution concerned",
        category: "Category",
        categoryPlaceholder: "Select a category",
        description: "Describe the Problem",
        descriptionPlaceholder: "Describe the issue in detail (what, where, when). This helps authorities respond faster.",
        button: "Submit Report"
      },
      institutions: {
        select: "Select institution",
        district: "District (Akarere)",
        sector: "Sector (Umurenge)",
        cell: "Cell (Akagari)",
        village: "Village (Umudugudu)",
        mininfra: "MININFRA (Infrastructure)",
        mineduc: "MINEDUC (Education)",
        minisante: "MINISANTE (Health)",
        localGov: "Local Government",
        other: "Other"
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
        reason1: "Help local authorities prioritize and respond",
        reason2: "Contribute to better services across Rwanda",
        reason3: "Your report stays confidential; only admins see the dashboard"
      },
      howProcess: {
        title: "What Happens Next?",
        step1: "Your report is received and categorized",
        step2: "It is forwarded to the right authority (district, sector)",
        step3: "Authorities work on resolution; you may be contacted if needed"
      },
      successMessage: "Thank you! Your report has been submitted. Authorities will review it.",
      noAccountNeeded: "You don't need an account to report. Only admins sign in to view reports in the dashboard."
    },
    dashboard: {
      title: "Admin Dashboard",
      subtitle: "Citizen reports appear here. AI converts informal (e.g. Kinyarwanda) submissions into structured, formal reports.",
      noReports: "No reports yet.",
      noReportsHint: "Reports submitted by citizens on the Report page will appear here. AI will structure them for easier review.",
      rawReport: "Original submission",
      structuredReport: "Structured report (AI)",
      signOut: "Sign out"
    }
  },
  Kinyarwanda: {
    nav: { 
      home: "Ahabanza",
      services: "Serivisi Zacu",
      report: "Tanga Ikibazo",
      about: "Abo Turibo", 
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
        description: "Porogaramu y'ubugenzacyaha y'u Rwanda—ihuze n'abategetsi bo hafi kandi uleteza imbere umuryango wawe.",
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
        description: "Ibikoresho kubaturage b'u Rwanda n'abategetsi bo hafi kugira ngo batange, bohereze, bakanemure ibibazo by'umuryango"
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
        description: "Ikoranabuhanga y'ubugenzacyaha y'u Rwanda—guhindura uko abaturage n'abategetsi bo hafi bakorana"
      },
      rwandaReach: {
        title: "Gusaba u Rwanda Wose",
        description: "Kuva i Kigali kugeza k'intara n'uturere twose. PublicVoice ihuza abaturage n'ubutegetsi bwa hafi kugira ngo gukemura ibibazo vuba kandi biri k'umurongo."
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
        description: "Fata ikigo cya PublicVoice—dufasha abaturage n'abafatanyabikorwa mu Rwanda yose"
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
      welcomeBack: "Murakaze neza.",
      welcomeSubtitle: "Kwinjira mu konti yawe ya PublicVoice n'amakuru y'umuryango.",
      signInHeadline: "Injira mu dashboard y'abadereva",
      overlayTitle: "Injira (Abadereva)",
      overlayTagline: "Fata dashboard kugira ngo urebe ugenzure raporo z'abaturage.",
      adminOnlyNote: "Kubadereva gusa. Abaturage batanga raporo batakeneye konti.",
      title: "Injira",
      subtitle: "Kwinjira mu dashboard ya PublicVoice",
      step2Subtitle: "Injiza ijambobanga ryawe",
      email: "Imeyili",
      password: "Ijambobanga",
      emailPlaceholder: "imeyili.yawe@urugero.com",
      passwordPlaceholder: "Injiza ijambobanga ryawe",
      button: "Injira",
      next: "Ibikurikira",
      back: "Subira",
      changeEmail: "Koresha imeyili yindi",
      forgotPassword: "Wibagiwe?",
      passwordRequired: "Ijambobanga birakenewe",
      rememberMe: "Nyibuka",
      orContinueWith: "cyangwa komeza na",
      continueWithGoogle: "Komeza na Google",
      noAccount: "Ntugira konti?",
      signUp: "Iyandikishe nonaha",
      backToHome: "← Subira ku Ntangiriro",
      alertMessage: "Inzira y'ubwiyemezi izakorwa mu mihindagurikire y'igihe kizaza."
    },
    register: {
      title: "Kwiyandikisha",
      subtitle: "Kurema konti yawe ya PublicVoice",
      signUpHeadline: "Kurema konti yawe kugira ngo utangire",
      overlayTitle: "Kwiyandikisha (Abadereva)",
      overlayTagline: "Kurema konti y'umudereva kugira ngo ufate dashboard ugenzure raporo.",
      adminOnlyNote: "Kubadereva gusa. Abaturage batanga raporo ku rupapuro rwa Raporo.",
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
        description: "Tanga ibibazo by'umuryango mu Rwanda yose."
      },
      form: {
        title: "Ohereza Raporo Yawe",
        name: "Amazina Yuzuze",
        namePlaceholder: "Amazina yawe yuzuze",
        phone: "Nomero y'Telefone",
        phonePlaceholder: "urugero: 0781234567",
        location: "Ahantu",
        locationPlaceholder: "Akarere, umurenge, akagari cyangwa ikimenyetso",
        institution: "Tagira ikigo aho ikibazo kiri",
        institutionPlaceholder: "Hitamo ikigo gihuza",
        category: "Icyiciro",
        categoryPlaceholder: "Hitamo icyiciro",
        description: "Sobanura Ikibazo",
        descriptionPlaceholder: "Sobanura ikibazo mu buce (iki, aha, ryari). Ibi bifasha abategetsi gusubiza vuba.",
        button: "Ohereza Raporo"
      },
      institutions: {
        select: "Hitamo ikigo",
        district: "Akarere",
        sector: "Umurenge",
        cell: "Akagari",
        village: "Umudugudu",
        mininfra: "MININFRA (Ubwubatsi)",
        mineduc: "MINEDUC (Uburezi)",
        minisante: "MINISANTE (Ubuzima)",
        localGov: "Gutegetsi bwa hafi",
        other: "Ikindi"
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
        reason1: "Gufasha abategetsi bo hafi guhitamo no gusubiza",
        reason2: "Gutanga umusanzu ku serivisi ziza mu Rwanda",
        reason3: "Raporo yawe ihari; abadereva gusa ni bo bareba dashboard"
      },
      howProcess: {
        title: "Ni iki Gikurikira?",
        step1: "Raporo yawe yakiriwe kandi itondekanywa",
        step2: "Yoherezwa ku mutgetsi ukwiye (akarere, umurenge)",
        step3: "Abategetsi bakora gukemura; washobora kuvugwa niba bikenewe"
      },
      successMessage: "Murakoze! Raporo yawe yoherejwe. Abategetsi bazayireba.",
      noAccountNeeded: "Ntugira konti kugira ngo utange raporo. Abadereva gusa ni bo binjira kureba raporo mu dashboard."
    },
    dashboard: {
      title: "Dashboard y'Umudereva",
      subtitle: "Raporo z'abaturage ziraboneka hano. AI ihindura raporo z'ubucyo (urugero Kinyarwanda) zigeze kuba zirabigenza.",
      noReports: "Nta raporo byari byageze.",
      noReportsHint: "Raporo abaturage batanga ku rupapuro rwa Raporo ziraboneka hano. AI izazitura kugira ngo zisomeke neza.",
      rawReport: "Raporo y'umwimerere",
      structuredReport: "Raporo yatorewe (AI)",
      signOut: "Sohoka"
    }
  },
};