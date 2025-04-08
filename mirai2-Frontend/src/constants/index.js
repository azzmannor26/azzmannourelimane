import {
  benefitIcon1,
  benefitIcon2,
  benefitIcon3,
  benefitIcon4,
  benefitImage2,
  chromecast,
  disc02,
  discord,
  discordBlack,
  facebook,
  figma,
  file02,
  framer,
  homeSmile,
  instagram,
  notification2,
  notification3,
  notification4,
  notion,
  photoshop,
  plusSquare,
  protopie,
  raindrop,
  recording01,
  recording03,
  Features1,
  Features2,
  Features3,
  Features4,
  searchMd,
  slack,
  sliders04,
  telegram,
  twitter,
  yourlogo,
} from "../assets";


export const navigation = [
  {
    id: "0",
    title: "Features",
    url: "/features",
  },
  {
    id: "3",
    title: "Blog",
    url: "/blog",
  },
  {
    id: "1",
    title: "About Us",
    url: "/about-us", // Update to match the route in App.js
  },
  {
    id: "2",
    title: "For Interns",
    url: "/for-interns",
  },
  {
    id: "2",
    title: "Home",
    url: "/",
  },
  {
    id: "5",
    title: "Login",
    url: "/login",
    onlyMobile: true,
  },
];


export const heroIcons = [homeSmile, file02, searchMd, plusSquare];

export const notificationImages = [notification4, notification3, notification2];

export const companyLogos = [yourlogo, yourlogo, yourlogo, yourlogo, yourlogo];

export const brainwaveServices = [
  "Progress Tracking",
  "Performance Reviews",
  "Data-Driven Decisions",
];

export const brainwaveServicesIcons = [
  recording03,
  recording01,
  disc02,
  chromecast,
  sliders04,
];

export const features = [
  {
    id: "0",
    title: "Automated CV Analysis",
    text: "Harness AI to evaluate and analyze CVs, ensuring the best candidates are matched with suitable opportunities effortlessly.",
    date: "Dec 2024",
    status: "done",
    imageUrl: Features1,
    colorful: true,
},
{
    id: "1",
    title: "Personalized Intern Spaces",
    text: "Provide interns with a dedicated space to chat with supervisors, track tasks, and manage their progress seamlessly.",
    date: "Dec 2024",
    status: "done",
    imageUrl: Features4,
},
{
    id: "2",
    title: "Automated Credential Delivery",
    text: "Automatically send login credentials to accepted interns, simplifying the onboarding process and saving time.",
    date: "Dec 2024",
    status: "done",
    imageUrl: Features3,
},
{
    id: "3",
    title: "Comprehensive Automation",
    text: "Automate every step of the internship lifecycle, from application submission to onboarding and performance tracking.",
    date: "Dec 2024",
    status: "done",
    imageUrl: Features2 ,
},

];

export const collabText =
  "With smart automation and top-notch security, it's the perfect solution for teams looking to work smarter.";

export const collabContent = [
  {
    id: "0",
    title: "Seamless Integration",
    text: collabText,
  },
  {
    id: "1",
    title: "Smart Automation",
  },
  {
    id: "2",
    title: "Top-notch Security",
  },
];

export const collabApps = [
  {
    id: "0",
    title: "Figma",
    icon: figma,
    width: 26,
    height: 36,
  },
  {
    id: "1",
    title: "Notion",
    icon: notion,
    width: 34,
    height: 36,
  },
  {
    id: "2",
    title: "Discord",
    icon: discord,
    width: 36,
    height: 28,
  },
  {
    id: "3",
    title: "Slack",
    icon: slack,
    width: 34,
    height: 35,
  },
  {
    id: "4",
    title: "Photoshop",
    icon: photoshop,
    width: 34,
    height: 34,
  },
  {
    id: "5",
    title: "Protopie",
    icon: protopie,
    width: 34,
    height: 34,
  },
  {
    id: "6",
    title: "Framer",
    icon: framer,
    width: 26,
    height: 34,
  },
  {
    id: "7",
    title: "Raindrop",
    icon: raindrop,
    width: 38,
    height: 32,
  },
];

export const pricing = [
  {
    id: "0",
    title: "Basic",
    description: "AI chatbot, personalized recommendations",
    price: "0",
    features: [
      "An AI chatbot that can understand your queries",
      "Personalized recommendations based on your preferences",
      "Ability to explore the app and its features without any cost",
    ],
  },
  {
    id: "1",
    title: "Premium",
    description: "Advanced AI chatbot, priority support, analytics dashboard",
    price: "9.99",
    features: [
      "An advanced AI chatbot that can understand complex queries",
      "An analytics dashboard to track your conversations",
      "Priority support to solve issues quickly",
    ],
  },
  {
    id: "2",
    title: "Enterprise",
    description: "Custom AI chatbot, advanced analytics, dedicated account",
    price: null,
    features: [
      "An AI chatbot that can understand your queries",
      "Personalized recommendations based on your preferences",
      "Ability to explore the app and its features without any cost",
    ],
  },
];

export const cards = [
  {
    id: "0",
    title: "Streamlined Applications",
    text: "Simplifies the internship application process for candidates and HR teams, saving time and effort.",
    backgroundUrl: "./src/assets/Cards/card-1.svg",
    iconUrl: benefitIcon1,
    imageUrl: benefitImage2,
  },
  {
    id: "1",
    title: "Enhanced Candidate Matching",
    text: "Leverages smart algorithms to match interns with the most suitable opportunities based on their skills and preferences.",
    backgroundUrl: "./src/assets/Cards/card-2.svg",
    iconUrl: benefitIcon2,
    imageUrl: benefitImage2,
    light: true,
  },
  {
    id: "2",
    title: "Seamless Communication",
    text: "Facilitates smooth and effective communication between interns and HR teams through a unified platform.",
    backgroundUrl: "./src/assets/Cards/card-3.svg",
    iconUrl: benefitIcon3,
    imageUrl: benefitImage2,
  },
  {
    id: "3",
    title: "Effortless Onboarding",
    text: "Simplifies the onboarding process with digital tools that help interns and supervisors get started quickly.",
    backgroundUrl: "./src/assets/Cards/card-4.svg",
    iconUrl: benefitIcon4,
    imageUrl: benefitImage2,
    light: true,
  },
  {
    id: "4",
    title: "Comprehensive Tracking",
    text: "Offers tools to track progress, performance, and feedback for a productive internship experience.",
    backgroundUrl: "./src/assets/Cards/card-5.svg",
    iconUrl: benefitIcon1,
    imageUrl: benefitImage2,
  },
  {
    id: "5",
    title: "Insightful Analytics",
    text: "Provides HR teams with data-driven insights to improve internship programs and make informed decisions.",
    backgroundUrl: "./src/assets/Cards/card-6.svg",
    iconUrl: benefitIcon2,
    imageUrl: benefitImage2,
  },
];

export const socials = [
  {
    id: "0",
    title: "Discord",
    iconUrl: discordBlack,
    url: "#",
  },
  {
    id: "1",
    title: "Twitter",
    iconUrl: twitter,
    url: "#",
  },
  {
    id: "2",
    title: "Instagram",
    iconUrl: instagram,
    url: "#",
  },
  {
    id: "3",
    title: "Telegram",
    iconUrl: telegram,
    url: "#",
  },
  {
    id: "4",
    title: "Facebook",
    iconUrl: facebook,
    url: "#",
  },


];
export const internsData = [
  { id: 1, name: "Jason Price", email: "janick_parislan@yahoo.com", image: "https://i.pravatar.cc/150?img=1" },
  { id: 2, name: "Jukkoe Sisao", email: "sibyl_koe@gmail.com", image: "https://i.pravatar.cc/150?img=2" },
  { id: 3, name: "Harriet Krig", email: "nadia_blo@hotmail.com", image: "https://i.pravatar.cc/150?img=3" },
  { id: 4, name: "Lenora Benson", email: "fei.wallace@kund.eu", image: "https://i.pravatar.cc/150?img=4" },
  { id: 5, name: "Olivia Reese", email: "kemmer.hattie@cremi.nu", image: "https://i.pravatar.cc/150?img=5" },
  { id: 6, name: "Bertha Valdez", email: "loraine.koe@tromp.io", image: "https://i.pravatar.cc/150?img=6" },
  { id: 7, name: "Harriett Payne", email: "nannie.wats@estrell.atv", image: "https://i.pravatar.cc/150?img=7" },
  { id: 8, name: "George Bryant", email: "delmer.kirby@gmail.com", image: "https://i.pravatar.cc/150?img=8" },
  { id: 9, name: "Lily French", email: "lucienne.her@fian.hotmail", image: "https://i.pravatar.cc/150?img=9" },
  { id: 10, name: "Howard Adkins", email: "wiegand.lector@herman.us", image: "https://i.pravatar.cc/150?img=10" },
  { id: 11, name: "Earl Bowman", email: "waino.alt@nicolet.tv", image: "https://i.pravatar.cc/150?img=11" },
  { id: 12, name: "Patrick Padilla", email: "octavia.meisel@gleich.net", image: "https://i.pravatar.cc/150?img=12" },
];

export const internsData2 = [
  {
    id: 1,
    name: "Jason Price",
    email: "jason.price@example.com",
    department: "Engineering",
    establishment: "MIT",
    phone: "123-456-7890",
    image: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    name: "Jukkoe Sisao",
    email: "jukkoe.sisao@example.com",
    department: "Marketing",
    establishment: "Harvard University",
    phone: "234-567-8901",
    image: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: 3,
    name: "Harriet Krig",
    email: "harriet.krig@example.com",
    department: "HR",
    establishment: "Stanford",
    phone: "345-678-9012",
    image: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: 4,
    name: "Lenora Benson",
    email: "lenora.benson@example.com",
    department: "Finance",
    establishment: "Yale",
    phone: "456-789-0123",
    image: "https://i.pravatar.cc/150?img=4",
  },
  {
    id: 5,
    name: "Olivia Reese",
    email: "olivia.reese@example.com",
    department: "Engineering",
    establishment: "Caltech",
    phone: "567-890-1234",
    image: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: 6,
    name: "Bertha Valdez",
    email: "bertha.valdez@example.com",
    department: "Marketing",
    establishment: "UCLA",
    phone: "678-901-2345",
    image: "https://i.pravatar.cc/150?img=6",
  },
  {
    id: 7,
    name: "Harriett Payne",
    email: "harriett.payne@example.com",
    department: "HR",
    establishment: "Oxford University",
    phone: "789-012-3456",
    image: "https://i.pravatar.cc/150?img=7",
  },
  {
    id: 8,
    name: "George Bryant",
    email: "george.bryant@example.com",
    department: "Finance",
    establishment: "Cambridge",
    phone: "890-123-4567",
    image: "https://i.pravatar.cc/150?img=8",
  },
  {
    id: 9,
    name: "Lily French",
    email: "lily.french@example.com",
    department: "Engineering",
    establishment: "Georgia Tech",
    phone: "901-234-5678",
    image: "https://i.pravatar.cc/150?img=9",
  },
  {
    id: 10,
    name: "Howard Adkins",
    email: "howard.adkins@example.com",
    department: "Marketing",
    establishment: "Princeton",
    phone: "012-345-6789",
    image: "https://i.pravatar.cc/150?img=10",
  },
  {
    id: 11,
    name: "Earl Bowman",
    email: "earl.bowman@example.com",
    department: "HR",
    establishment: "Cornell University",
    phone: "123-456-7891",
    image: "https://i.pravatar.cc/150?img=11",
  },
  {
    id: 12,
    name: "Patrick Padilla",
    email: "patrick.padilla@example.com",
    department: "Finance",
    establishment: "Johns Hopkins",
    phone: "234-567-8910",
    image: "https://i.pravatar.cc/150?img=12",
  },
];
export const supervisors = [
  "John Doe",
  "Jane Smith",
  "Alice Johnson",
  "Bob Brown",
  "Charlie Wilson",
];

export const supervisorsData2 = [
  {
    id: 1,
    name: "John Doe",
    team: "Development",
    weeksLeft: 3,
    progress: 70,
  },
  {
    id: 2,
    name: "Jane Smith",
    team: "Marketing",
    weeksLeft: 5,
    progress: 40,
  },
  {
    id: 3,
    name: "Alice Johnson",
    team: "HR",
    weeksLeft: 2,
    progress: 90,
  },
  {
    id: 4,
    name: "Robert Brown",
    team: "Finance",
    weeksLeft: 4,
    progress: 60,
  }
];
///////////////////
export const reportsData = [
  {
    id: 1,
    image: "https://via.placeholder.com/50x50", // Placeholder image URL
    internName: "Apple Watch Series 4",
    projectName: "Digital Product",
    submissionDate: "$690.00",
    status: "pending",
  },
  {
    id: 2,
    image: "https://via.placeholder.com/50x50",
    internName: "Microsoft Headsquare",
    projectName: "Digital Product",
    submissionDate: "$190.00",
    status: "valid",
  },
  {
    id: 3,
    image: "https://via.placeholder.com/50x50",
    internName: "Women's Dress",
    projectName: "Fashion",
    submissionDate: "$640.00",
    status: "valid",
  },
  {
    id: 4,
    image: "https://via.placeholder.com/50x50",
    internName: "Samsung A50",
    projectName: "Mobile",
    submissionDate: "$400.00",
    status: "pending",
  },
  {
    id: 5,
    image: "https://via.placeholder.com/50x50",
    internName: "Camera",
    projectName: "Electronic",
    submissionDate: "$420.00",
    status: "invalid",
  },
];
///////////
export const initialOccupations = [
  { id: 1, title: "Design Conference", location: "Meaghanberg", from: "2019-10-02", to: "2019-10-02", color: "bg-purple-200" },
  { id: 2, title: "Weekend Festival", location: "City Park", from: "2019-10-16", to: "2019-10-16", color: "bg-pink-300" },
  { id: 3, title: "Glastonbury Festival", location: "Glastonbury", from: "2019-10-26", to: "2019-10-28", color: "bg-orange-200" },
];
