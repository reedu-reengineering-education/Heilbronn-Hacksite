/**
 * English strings. This is the site's only language: `Dictionary` is derived
 * from this object's shape, so adding a key here is all that's needed to make
 * it available to components.
 */
const en = {
  meta: {
    title: "Green City Hackathon",
    description: "Data for the Heilbronn of Tomorrow",
  },
  nav: {
    home: "Home",
    info: "Schedule",
    topics: "Topics",
    resources: "Material",
    mentors: "Mentors & Jury",
    teams: "Teams",
    greenCity: "Green City",
    skipToContent: "Skip to content",
  },
  footer: {
    contact: "Contact",
    privacy: "Privacy policy",
    rights: "All rights reserved.",
  },
  home: {
    heroCta: "Registration",
    heroWhenLabel: "When",
    countdownLabel: "Starts in",
    countdownDays: "Days",
    countdownHours: "Hours",
    countdownMinutes: "Min",
    countdownSeconds: "Sec",
    whatTitle: "How can a city become more sustainable and liveable? And how can data help?",
    whereTitle: "Where",
    scheduleTitle: "Schedule",
    expectTitle: "What to expect",
    expectItems: [
      "Working with real environmental data from Heilbronn",
      "Analysing, interpreting and visualising data",
      "Developing your own ideas and prototypes as a team",
      "Exchanging ideas with other participants",
      "Support from experienced mentors",
    ],
    prizesTitle: "Prizes",
    prizesLead: "For the top 3 teams.",
    prizeCreditsTitle: "Up to €250 in AI credits",
    prizeCreditsBody:
      "OpenRouter access: ChatGPT, Claude, Gemini & co. Credits go into your project, so you can keep developing it.",
    prizeCreditsTiers: [
      { medal: "🥇", amount: "€250" },
      { medal: "🥈", amount: "€200" },
      { medal: "🥉", amount: "€150" },
    ],
    prizePitchTitle: "Pitch it to city hall",
    prizePitchBody:
      "Your own session with Deputy Mayor Andreas Ringle. Real feedback from someone who helps shape what gets built in this city. Ask the questions. Get the answers. Green Capital 2027 starts now.",
    prizeCourseTitle: "Exclusive follow-up course",
    prizeCourseBody:
      "Sensors, hardware, software — whatever your project needs. Real experts and mentors help you turn your idea into a product.",
    participantsTitle: "Who can take part",
    participantsText: "The Event is for anybody from 16 to 99 years old (or above). If you are younger and want to participate, check out the Autumn School.",
    bringTitle: "What do I need to bring to the Hackathon?",
    bringText: "We offer lunch and dinner, plenty of drinks and snacks, toilets, showers and a place where you can setup your sleeping area. Mattresses, blankets, bath items like towels, toothpaste, shower gel etc. are NOT provided and need to be supplied by yourself if you want to sleep on site! Bring your laptop, cables, adapters and any hardware you want or need to use.",
    faqTitle: "FAQ",
    soloTitle: "Do I need a team, or can I apply solo?",
    soloText:
      "The Hackathon will be done in Teams of up to 6, but you can apply solo and find teammates on site.",
    feeTitle: "Is a fee or deposit required for participation?",
    feeText: "No! The entire event is free of charge, we also don't request deposits for hardware usage provided by us.",
    experienceTitle: "Do I need experience or prior knowledge in software or hardware?",
    experienceText:
      "Absolutely not! Everybody is invited to sign up for the Hackathon. We have plenty of mentors, experts and experienced peers on site to help you with all the technical questions and challenges. Don't be discouraged, you will learn plenty of new stuff if you just try it out!",
  },
  info: {
    scheduleTitle: "Schedule",
  },
  topics: {
    title: "Topics",
    lead: "Potential topics for your project.",
    flipHint: "Show details",
    flipBack: "Back",
    items: {
      waste: {
        name: "Waste & Recycling",
        description:
          "Where does our waste come from, where does it go, and how can more of it be reused or avoided?",
      },
      water: {
        name: "Water",
        description:
          "Rivers, groundwater, rainfall and drinking water: how healthy is the city's water, and how is it used?",
      },
      noise: {
        name: "Noise",
        description:
          "Traffic, construction and nightlife: where is Heilbronn loud, when, and what does it do to people?",
      },
      air: {
        name: "Air quality",
        description:
          "Particulate matter, nitrogen oxides and pollen: what are we breathing, street by street?",
      },
      biodiversity: {
        name: "Biodiversity",
        description:
          "Parks, trees, insects and birds: how can we see, protect and grow nature in the city?",
      },
      protection: {
        name: "Climate protection",
        description:
          "Cutting emissions from energy, mobility and buildings: what can the city and its people do?",
      },
      adaptation: {
        name: "Climate adaptation",
        description:
          "Heat, drought and heavy rain are coming: how do we prepare the city and protect those most at risk?",
      },
    },
    solutionsTitle: "What can you build?",
    solutionsLead: "Your idea can take one of these forms, or combine several.",
    solutions: [
      "Apps",
      "Infographics",
      "Dashboard tiles",
      "Maps",
      "Websites",
      "Data analysis",
      "Data cleaning",
      "Measurement campaigns",
      "Measurement devices",
    ],
    otherIdea: "Have a different idea? Please reach out to a mentor!",
  },
  resources: {
    title: "Material",
    dataTitle: "Data",
    hardwareTitle: "Hardware",
    softwareTitle: "Software & APIs",
    linksTitle: "Further reading",
  },
  greenCity: {
    title: "Green Capital Heilbronn",
    intro: [
      "Heilbronn is the European Green Capital for 2027, and the Green City Heilbronn is part of that initiative. Together with Arkadia, aim and re:edu, we offer exciting educational and citizen science projects that everyone can join.",
      "Our goal: to bring people together, raise awareness about the environment, and work together to make Heilbronn more sustainable.",
    ],
    whatTitle: "What do we do at Green City Heilbronn?",
    what:
      "We develop workshops, hackathons (just like this one), and other participatory formats where we collectively collect, analyze, share, and visualize data on topics such as particulate matter, mobility, and biodiversity.",
    dashboard: {
      before: "All the data we collect ends up on our public ",
      link: "dashboard",
      after: ", where you can explore it, compare it, and build on it.",
    },
  },
  mentorsJury: {
    mentorsTitle: "Mentors",
    mentorsLead: "Ask them anything — that's what they're here for.",
    areaOfInterest: "Area of interest",
    juryTitle: "Jury",
  },
  teams: {
    title: "Teams",
    empty: "No team has registered yet. Be the first!",
    count: "{count} teams",
    noIdea: "No idea described yet.",
    noMembers: "No members listed yet.",
    membersLabel: "Members",
    lookingBadge: "Looking for members",
    register: "Register your team",
    manage: "Manage your team",
  },
  team: {
    title: "Your team",
    signUpTitle: "Register a new team",
    signUpIntro:
      "Pick a team name and a passphrase. Everyone on the team needs both — that is all we ask for, no email address.",
    logInTitle: "Sign in to your team",
    logInIntro: "Already registered? Name and passphrase get you back in.",
    nameLabel: "Team name",
    passphraseLabel: "Passphrase",
    emojiLabel: "Team emoji",
    emojiChange: "Change team emoji",
    signUpButton: "Create team",
    logInButton: "Sign in",
    logOutButton: "Sign out",
    passphraseHint:
      "At least 6 characters. Share it only within your team — anyone who knows it can edit your team.",
    editTitle: "Team details",
    ideaLabel: "Your idea",
    ideaHint: "What do you want to build, and which data will you use? Up to 2000 characters.",
    membersLabel: "Members",
    membersHint: "Up to 6 people.",
    memberPlaceholder: "Name of a team member",
    addMember: "Add",
    removeMember: "Remove {name}",
    lookingLabel: "We are still looking for more team members",
    newPassphraseLabel: "New passphrase",
    newPassphraseHint: "Leave empty to keep the current one.",
    saveButton: "Save changes",
    saved: "Saved.",
    viewOverview: "← See all teams",
    deleteTitle: "Delete this team",
    deleteBody: "Removes your team and its entry from the overview. This cannot be undone.",
    deleteConfirm: "Really delete this team? This cannot be undone.",
    signInToManage: "Sign in to manage {team}.",
    deleteButton: "Delete team",
    errors: {
      nameTooShort: "The team name needs at least 2 characters.",
      nameTooLong: "The team name can be at most 40 characters.",
      passphraseTooShort: "The passphrase needs at least 6 characters.",
      passphraseTooLong: "That passphrase is too long.",
      nameTaken: "That team name is taken.",
      badCredentials: "Team name or passphrase is not right.",
      ideaTooLong: "The idea description can be at most 2000 characters.",
      tooManyMembers: "A team can have at most 6 members.",
      notSignedIn: "Your session has ended. Please sign in again.",
      generic: "That did not work. Please try again.",
    },
  },
};

export default en;
export type Dictionary = typeof en;
