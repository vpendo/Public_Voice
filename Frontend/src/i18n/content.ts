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
        description: "Connect with local authorities. Report issues, track responses, and help improve your neighbourhood—across Rwanda.",
        exploreServices: "Explore Services",
        getInTouch: "Get In Touch"
      },
      forCitizens: {
        title: "For Rwandan Citizens",
        body: "From Kigali to every district: report roads, water, security, sanitation, and other local issues. Your report goes to the right department and you can follow its status until resolution.",
        reportCta: "Submit a Report"
      },
      howItWorks: {
        title: "How It Works",
        subtitle: "Three steps from report to resolution",
        step1: {
          title: "Report Issue",
          description: "Submit with details, location, and category. No account required to report."
        },
        step2: {
          title: "Auto Categorize",
          description: "Reports are routed to the right authority automatically."
        },
        step3: {
          title: "Track Progress",
          description: "See status and official responses in one place."
        }
      },
      whyMatters: {
        title: "Why It Matters",
        transparency: {
          title: "Transparency",
          description: "Clear process and visibility so outcomes are accountable."
        },
        fasterResponse: {
          title: "Faster Response",
          description: "Structured workflow so issues reach the right desk quickly."
        },
        citizenPower: {
          title: "Citizen Power",
          description: "One platform for all Rwandans to participate in local governance."
        }
      },
      cta: {
        title: "Report an Issue in Your Area",
        description: "Submit your report in a few steps. We route it to the right department and keep you updated.",
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
      successMessage: "Thank you for your message! We will get back to you soon. "
    },
    login: {
      welcomeBack: "Welcome Back.",
      welcomeSubtitle: "Access your PublicVoice account and community reports.",
      signInHeadline: "Sign in — Citizens and Government Admins",
      overlayTitle: "Sign In",
      overlayTagline: "Citizens: sign in to report and track issues. Admins: sign in to manage reports.",
      adminLoginOnly: "Admins do not register here. Use the email and password created for you by the system.",
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
      signUpHeadline: "Create your citizen account to report and track issues",
      citizenOnly: "For citizens only. Government admins cannot register here — they sign in with credentials provided by the system.",
      overlayTitle: "Citizen Registration",
      overlayTagline: "Create your account to submit issues and track their status.",
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
      signOut: "Sign out",
      loading: "Loading reports...",
      error: "Could not load reports.",
      adminRequired: "Admin access required to view reports."
    },
    admin: {
      sidebar: {
        dashboard: "Dashboard",
        allIssues: "All Issues",
        respond: "Respond to Issues",
        users: "Users",
      },
      overview: "Admin overview",
      dashboardTitle: "Dashboard",
      dateReports: "Reports and users across Rwanda",
      viewAllIssues: "View all issues",
      totalUsers: "Total users",
      totalReports: "Total reports",
      pending: "Pending",
      resolved: "Resolved",
      reportsByStatus: "Reports by status",
      reportsByCategory: "Reports by category",
      noReportData: "No report data yet",
      noCategoriesYet: "No categories yet",
      recentReports: "Recent reports",
      viewAll: "View all",
      noReportsYet: "No reports yet",
      quickActions: "Quick actions",
      respondToIssues: "Respond to issues",
      allIssues: "All issues",
      usersLabel: "Users",
      pendingCount: "pending",
      totalCount: "total",
      registered: "registered",
      respondLink: "Respond",
      loading: "Loading dashboard...",
      tableId: "ID",
      tableCategory: "Category",
      tableStatus: "Status",
      tableDate: "Date",
      categories: {
        roads: "Roads & Infrastructure",
        water: "Water",
        security: "Security",
        sanitation: "Sanitation",
        electricity: "Electricity",
        health: "Health",
        education: "Education",
        other: "Other",
      },
      statusPending: "Pending",
      statusResolved: "Resolved",
      statusRejected: "Rejected",
      tableUser: "User",
      tableTitle: "Title",
      tableAction: "Action",
      viewRespond: "View / Respond",
      adminLabel: "Admin",
      allIssuesPage: {
        title: "All Issues",
        subtitle: "View and respond to citizen reports",
        total: "total",
        loading: "Loading issues...",
        error: "Could not load reports.",
        emptyTitle: "No reports yet",
        emptyHint: "Reports submitted by citizens will appear here. Share the report link with your community to get started.",
      },
      respondListPage: {
        title: "Respond to Issues",
        subtitle: "Select an issue to add or edit your response",
        needResponse: "need response",
        loading: "Loading...",
        error: "Could not load reports.",
        emptyTitle: "No issues to respond to",
        emptyHint: "All reports are up to date or none have been submitted yet.",
      },
      respondPage: {
        backToList: "Back to Respond list",
        title: "Respond to Issue",
        loading: "Loading report...",
        citizenReport: "Citizen report",
        yourResponse: "Your response",
        responseSaved: "Response saved successfully.",
        statusLabel: "Status",
        responseToCitizen: "Response to citizen",
        responsePlaceholder: "Write your response to the citizen...",
        saving: "Saving...",
        saveResponse: "Save response",
        errorLoad: "Could not load this report.",
        errorUpdate: "Failed to update report.",
      },
      usersPage: {
        title: "Users",
        subtitle: "Registered users",
        totalSummary: "total",
        adminCount: "admin",
        citizensCount: "citizens",
        adminBadge: "Admin",
        citizensBadge: "Citizens",
        loading: "Loading users...",
        error: "Could not load users.",
        emptyTitle: "No users yet",
        emptyHint: "Registered users will appear here. Citizens can sign up from the public site.",
        tableName: "Name",
        tableEmail: "Email",
        tableRole: "Role",
        roleAdmin: "Admin",
        roleUser: "User",
      },
    },
    user: {
      citizen: "Citizen",
      sidebar: {
        dashboard: "Dashboard",
        submitIssue: "Submit Issue",
        myIssues: "My Issues",
        profile: "Profile",
      },
      dashboard: {
        hello: "Hello",
        tagline: "Use your voice. Report community issues and track how authorities respond.",
        totalReports: "Total reports",
        pending: "Pending",
        resolved: "Resolved",
        quickAction: "Quick action",
        quickActionDesc: "Spotted a problem in your community? Submit a report so authorities can take action.",
        submitNewIssue: "Submit a new issue",
        howItWorks: "How it works",
        step1: "Submit your issue with details and location.",
        step2: "Authorities review and may contact you.",
        step3: "Track status and read responses here.",
        viewMyIssues: "View and track all your submitted issues.",
        myIssues: "My Issues",
      },
      submitIssue: {
        citizenReport: "Citizen report",
        title: "Submit Issue",
        subtitle: "Report a community issue. Authorities will review and respond.",
        reportForm: "Report form",
        titleLabel: "Title",
        titlePlaceholder: "Short title for the issue",
        description: "Description",
        descriptionPlaceholder: "Describe the issue in detail (what, where, when). You can write in English or Kinyarwanda.",
        category: "Category",
        categoryPlaceholder: "Select category",
        phone: "Phone",
        phonePlaceholder: "e.g. 0781234567",
        locationOptional: "Location (optional)",
        locationPlaceholder: "District, sector, cell or landmark",
        submitButton: "Submit Issue",
        submitting: "Submitting...",
        submitError: "Failed to submit. Please try again.",
      },
      categories: {
        roads: "Roads & Infrastructure",
        water: "Water Supply",
        security: "Security & Safety",
        sanitation: "Sanitation & Waste",
        electricity: "Electricity",
        health: "Health Services",
        education: "Education",
        other: "Other",
      },
      myIssues: {
        yourReports: "Your reports",
        title: "My Issues",
        subtitle: "Track your submitted reports and see responses",
        total: "total",
        pending: "pending",
        newIssue: "New issue",
        loading: "Loading your issues...",
        error: "Could not load your issues.",
        noIssues: "No issues yet",
        noIssuesHint: "Submit your first issue and authorities will review it. You can track status and read responses here.",
        submitFirst: "Submit your first issue",
        viewDetails: "View details",
        titleHeader: "Title",
        categoryHeader: "Category",
        dateHeader: "Date",
        statusHeader: "Status",
        actionHeader: "Action",
      },
      issueDetail: {
        backToIssues: "Back to My Issues",
        issueDetail: "Issue detail",
        yourReport: "Your report",
        responseFromAuthorities: "Response from authorities",
        noResponseYet: "No response yet. Authorities will review your report and respond here.",
        loading: "Loading issue...",
        error: "Could not load this issue.",
      },
      statusLabels: {
        pending: "Pending",
        resolved: "Resolved",
        rejected: "Rejected",
      },
      profile: {
        yourAccount: "Your account",
        title: "Profile",
        subtitle: "Your account information.",
        account: "Account",
        fullName: "Full name",
        email: "Email",
        role: "Role",
        changePassword: "Change password",
        currentPassword: "Current password",
        newPassword: "New password",
        updatePassword: "Update password",
      },
    },
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
        description: "Ihuze n'abategetsi bo hafi. Tanga ibibazo, kurikirana ibisubizo, kandi ufate umugabane mu guteza imbere umudugudu wawe—mu Rwanda wose.",
        exploreServices: "Reba Serivisi",
        getInTouch: "Twandikire"
      },
      forCitizens: {
        title: "Kubaturage b'u Rwanda",
        body: "Kuva i Kigali kugeza kuri buri karere: tanga ibibazo by'inzira, amazi, umutekano, isuku, n'ibindi. Raporo yawe igeza kuri serivisi iyo ari yo y'ibanze kandi ushobora kurikirana imiterere yayo kugeza ku gukemura.",
        reportCta: "Tanga Raporo"
      },
      howItWorks: {
        title: "Uko Ikora",
        subtitle: "Intambwe zitatu kuva kuri raporo kugeza ku gukemura",
        step1: {
          title: "Tanga Ikibazo",
          description: "Ohereza hamwe n'amakuru, ahantu, n'itsinda. Nta konti bisabwa kugira ngo utange raporo."
        },
        step2: {
          title: "Gutondekanya mu Buryo Bw'Ubwenge",
          description: "Raporo zoherezwa mu buryo bwikora ku bantu b'ibanze."
        },
        step3: {
          title: "Kurikirana Iterambere",
          description: "Raba imiterere n'ibisubizo by'ofisi mu gace kimwe."
        }
      },
      whyMatters: {
        title: "Kuki Bifite Agaciro",
        transparency: {
          title: "Kugaragaza",
          description: "Inzira isobanutse kandi iboneka kugirango ibyavuye bibe ngombwa."
        },
        fasterResponse: {
          title: "Gusubiza Vuba",
          description: "Inzira yoroshye kugira ngo ibibazo bigeze vuba kuri bureau iracyo."
        },
        citizenPower: {
          title: "Imbaraga z'Abaturage",
          description: "Plateforme imwe kubaturage b'u Rwanda bose kugira ngo bafate umugabane mu guteza imbere abategetsi bo hafi."
        }
      },
      cta: {
        title: "Tanga Ikibazo mu Gace Wawe",
        description: "Ohereza raporo yawe mu ntambwe nkeya. Tuzohereza kuri departimenti iracyo kandi turabamenyesha.",
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
      signInHeadline: "Injira — Abaturage n'Abadereva b'Leta",
      overlayTitle: "Injira",
      overlayTagline: "Abarurage: injira kugira ngo utange ugenzure raporo. Abadereva: injira kugira ngo ugenzure raporo.",
      adminLoginOnly: "Abadereva ntibandikisha hano. Koresha imeyili n'ijambobanga byatanzwe n'itsinda.",
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
      signUpHeadline: "Kurema konti yawe y'umuturage kugira ngo utange ugenzure raporo",
      citizenOnly: "Kubaturage gusa. Abadereva b'Leta ntashobora kwiyandikisha hano — binjira banyuze na konti itangwa n'itsinda.",
      overlayTitle: "Kwiyandikisha kw'Umuturage",
      overlayTagline: "Kurema konti yawe kugira ngo ohereze ibibazo ukurikirane imiterere.",
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
      signOut: "Sohoka",
      loading: "Kuramba raporo...",
      error: "Ntibyakunze gukurura raporo.",
      adminRequired: "Ukeneye uburenganzira bwo kureba raporo."
    },
    admin: {
      sidebar: {
        dashboard: "Dashboard",
        allIssues: "Ibibazo Byose",
        respond: "Subiza Ibibazo",
        users: "Abakoresha",
      },
      overview: "Inyungu y'Umudereva",
      dashboardTitle: "Dashboard",
      dateReports: "Raporo n'abakoresha mu Rwanda",
      viewAllIssues: "Reba ibibazo byose",
      totalUsers: "Abakoresha bose",
      totalReports: "Raporo zose",
      pending: "Bategereje",
      resolved: "Byakemuwe",
      reportsByStatus: "Raporo ku miterere",
      reportsByCategory: "Raporo ku cyiciro",
      noReportData: "Nta makuru y'raporo byari byageze",
      noCategoriesYet: "Nta cyiciro byari byageze",
      recentReports: "Raporo z'ubu",
      viewAll: "Reba byose",
      noReportsYet: "Nta raporo byari byageze",
      quickActions: "Ibikorwa vuba",
      respondToIssues: "Subiza ibibazo",
      allIssues: "Ibibazo byose",
      usersLabel: "Abakoresha",
      pendingCount: "bategereje",
      totalCount: "byose",
      registered: "bayandikishije",
      respondLink: "Subiza",
      loading: "Kuramba dashboard...",
      tableId: "ID",
      tableCategory: "Icyiciro",
      tableStatus: "Imiterere",
      tableDate: "Itariki",
      categories: {
        roads: "Imihanda n'Ubwubatsi",
        water: "Amazi",
        security: "Umutekano",
        sanitation: "Isuku",
        electricity: "Amashanyarazi",
        health: "Ubuzima",
        education: "Uburezi",
        other: "Ikindi",
      },
      statusPending: "Bategereje",
      statusResolved: "Byakemuwe",
      statusRejected: "Yahakanwe",
      tableUser: "Umukoresha",
      tableTitle: "Umutwe",
      tableAction: "Igikorwa",
      viewRespond: "Reba / Subiza",
      adminLabel: "Umudereva",
      allIssuesPage: {
        title: "Ibibazo Byose",
        subtitle: "Reba no gusubiza raporo z'abaturage",
        total: "byose",
        loading: "Kuramba ibibazo...",
        error: "Ntibyakunze gukurura raporo.",
        emptyTitle: "Nta raporo byari byageze",
        emptyHint: "Raporo abaturage batanga ziraboneka hano. Sangiye umurongo w'raporo n'umuryango wawe kugira ngo utangire.",
      },
      respondListPage: {
        title: "Subiza Ibibazo",
        subtitle: "Hitamo ikibazo kugira ngo ongeze cyangwa uhinduramo igisubizo cyawe",
        needResponse: "bakeneye igisubizo",
        loading: "Kuramba...",
        error: "Ntibyakunze gukurura raporo.",
        emptyTitle: "Nta kibazo cyo gusubiza",
        emptyHint: "Raporo zose ziri ku gihe cyangwa nta zo byari byoherejwe.",
      },
      respondPage: {
        backToList: "Subira ku rutonde rwa Subiza",
        title: "Subiza Ikibazo",
        loading: "Kuramba raporo...",
        citizenReport: "Raporo y'umuturage",
        yourResponse: "Igisubizo cyawe",
        responseSaved: "Igisubizo cyasizwe neza.",
        statusLabel: "Imiterere",
        responseToCitizen: "Igisubizo ku muturage",
        responsePlaceholder: "Andika igisubizo cyawe ku muturage...",
        saving: "Kuramba...",
        saveResponse: "Siza igisubizo",
        errorLoad: "Ntibyakunze gukurura iyi raporo.",
        errorUpdate: "Ntibyakunze gukusanya raporo.",
      },
      usersPage: {
        title: "Abakoresha",
        subtitle: "Abakoresha bayandikishije",
        totalSummary: "byose",
        adminCount: "abadereva",
        citizensCount: "abaturage",
        adminBadge: "Umudereva",
        citizensBadge: "Abaturage",
        loading: "Kuramba abakoresha...",
        error: "Ntibyakunze gukurura abakoresha.",
        emptyTitle: "Nta mukoresha byari byageze",
        emptyHint: "Abakoresha bayandikishije bazaboneka hano. Abaturage bashobora kwiyandikisha ku rupapuro rusange.",
        tableName: "Amazina",
        tableEmail: "Imeyili",
        tableRole: "Urwego",
        roleAdmin: "Umudereva",
        roleUser: "Umuturage",
      },
    },
    user: {
      citizen: "Umuturage",
      sidebar: {
        dashboard: "Dashboard",
        submitIssue: "Tanga Ikibazo",
        myIssues: "Ibibazo Byanjye",
        profile: "Porofayili",
      },
      dashboard: {
        hello: "Murakaze",
        tagline: "Koresha ijwi ryawe. Tanga ibibazo by'umuryango ukurikirane uko abategetsi basubiza.",
        totalReports: "Raporo zose",
        pending: "Bategereje",
        resolved: "Byakemuwe",
        quickAction: "Igikorwa vuba",
        quickActionDesc: "Wabonye ikibazo mu muryango wawe? Tanga raporo kugira ngo abategetsi bakore.",
        submitNewIssue: "Tanga ikibazo gishya",
        howItWorks: "Uko bikora",
        step1: "Tanga ikibazo cyawe hamwe n'amakuru n'ahantu.",
        step2: "Abategetsi bareba kandi bashobora kuvugana nawe.",
        step3: "Kurikirana imiterere no gusoma ibisubizo hano.",
        viewMyIssues: "Reba no kurikirana ibibazo byawe byose byatanzwe.",
        myIssues: "Ibibazo Byanjye",
      },
      submitIssue: {
        citizenReport: "Raporo y'umuturage",
        title: "Tanga Ikibazo",
        subtitle: "Tanga ikibazo cy'umuryango. Abategetsi bazacyareba bakasubiza.",
        reportForm: "Fomu y'raporo",
        titleLabel: "Umutwe",
        titlePlaceholder: "Umutwe mfupi w'ikibazo",
        description: "Ibisobanuro",
        descriptionPlaceholder: "Sobanura ikibazo mu buce (iki, aha, ryari). Urashobora kwandika mu Icyongereza cyangwa Ikinyarwanda.",
        category: "Icyiciro",
        categoryPlaceholder: "Hitamo icyiciro",
        phone: "Telefone",
        phonePlaceholder: "urugero: 0781234567",
        locationOptional: "Ahantu (bihitamo)",
        locationPlaceholder: "Akarere, umurenge, akagari cyangwa ikimenyetso",
        submitButton: "Tanga Ikibazo",
        submitting: "Kuramba kohereza...",
        submitError: "Ntibyakunze kohereza. Ongera ugerageze.",
      },
      categories: {
        roads: "Imihanda n'Ubwubatsi",
        water: "Amazi",
        security: "Umutekano n'Umutekano",
        sanitation: "Gukoresha neza n'Imyanda",
        electricity: "Amashanyarazi",
        health: "Serivisi z'Ubuzima",
        education: "Uburezi",
        other: "Ikindi",
      },
      myIssues: {
        yourReports: "Raporo z'awe",
        title: "Ibibazo Byanjye",
        subtitle: "Kurikirana raporo zawe zoherejwe no kubona ibisubizo",
        total: "byose",
        pending: "bategereje",
        newIssue: "Ikibazo gishya",
        loading: "Kuramba ibibazo byawe...",
        error: "Ntibyakunze gukurura ibibazo byawe.",
        noIssues: "Nta kibazo byari byageze",
        noIssuesHint: "Tanga ikibazo cyawe cya mbere kandi abategetsi bazacyareba. Urashobora kurikirana imiterere no gusoma ibisubizo hano.",
        submitFirst: "Tanga ikibazo cyawe cya mbere",
        viewDetails: "Reba ibisobanuro",
        titleHeader: "Umutwe",
        categoryHeader: "Icyiciro",
        dateHeader: "Itariki",
        statusHeader: "Imiterere",
        actionHeader: "Igikorwa",
      },
      issueDetail: {
        backToIssues: "Subira ku Bibazo Byanjye",
        issueDetail: "Ibisobanuro by'ikibazo",
        yourReport: "Raporo yawe",
        responseFromAuthorities: "Igisubizo gituruka ku bategetsi",
        noResponseYet: "Nta gisubizo byari byageze. Abategetsi bazareba raporo yawe bakasubiza hano.",
        loading: "Kuramba ikibazo...",
        error: "Ntibyakunze gukurura iki kibazo.",
      },
      statusLabels: {
        pending: "Bategereje",
        resolved: "Byakemuwe",
        rejected: "Yahakanwe",
      },
      profile: {
        yourAccount: "Konti yawe",
        title: "Porofayili",
        subtitle: "Amakuru y'konti yawe.",
        account: "Konti",
        fullName: "Amazina yuzuye",
        email: "Imeyili",
        role: "Urwego",
        changePassword: "Hindura ijambobanga",
        currentPassword: "Ijambobanga ryo none",
        newPassword: "Ijambobanga rishya",
        updatePassword: "Hindura ijambobanga",
      },
    },
  },
};