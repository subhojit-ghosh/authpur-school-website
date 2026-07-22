export const school = {
  name: "Authpur National Model Higher Secondary School",
  shortName: "Authpur National Model",
  initials: "ANM",
  tagline: "Knowledge · Character · Service",
  established: 1982,
  motto: "Tamaso Mā Jyotirgamaya",
  mottoMeaning: "Lead me from darkness to light",
  address: {
    line1: "Ghosh Para Road, Authpur",
    line2: "Shyamnagar, North 24 Parganas",
    city: "Kolkata",
    state: "West Bengal",
    pin: "743128",
  },
  phone: "+91 33 2588 0000",
  phoneHref: "tel:+913325880000",
  admissionsPhone: "+91 98300 00000",
  email: "office@authpurnationalmodel.edu.in",
  mapQuery:
    "Authpur National Model Higher Secondary School, Ghosh Para Rd, Authpur, Shyamnagar, West Bengal 743128",
} as const;

export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Academics", href: "#academics" },
  { label: "Campus Life", href: "#campus" },
  { label: "Notices", href: "#notices" },
  { label: "Contact", href: "#contact" },
] as const;

export const stats = [
  { value: "1982", label: "Established", hint: "Four decades of learning" },
  { value: "2,400+", label: "Students", hint: "Pre-primary to Class 12" },
  { value: "95+", label: "Faculty", hint: "Qualified & caring" },
  { value: "98%", label: "Board Results", hint: "Class 10 & 12 pass rate" },
] as const;

export const programmes = [
  {
    key: "primary",
    title: "Primary School",
    grades: "Class I – V",
    blurb:
      "A joyful, activity-led foundation where children build literacy, numeracy and curiosity through play and discovery.",
    points: ["Play-based learning", "Reading & phonics", "Art, music & movement"],
  },
  {
    key: "secondary",
    title: "Secondary School",
    grades: "Class VI – X",
    blurb:
      "A rigorous, concept-first programme aligned to the WBBSE curriculum that prepares students for the Madhyamik examination.",
    points: ["Science & maths labs", "Language & humanities", "Board exam readiness"],
  },
  {
    key: "higher-secondary",
    title: "Higher Secondary",
    grades: "Class XI – XII",
    blurb:
      "Specialised streams under WBCHSE guiding students toward university, competitive exams and confident careers.",
    points: ["Science stream", "Commerce stream", "Humanities stream"],
  },
] as const;

export const streams = ["Science", "Commerce", "Humanities"] as const;

export const features = [
  {
    icon: "flask",
    title: "Modern Science Labs",
    text: "Dedicated Physics, Chemistry, Biology and Computer labs for hands-on, inquiry-driven learning.",
  },
  {
    icon: "book",
    title: "Well-stocked Library",
    text: "Over 15,000 titles, periodicals and a quiet reading room to grow a lifelong love of books.",
  },
  {
    icon: "monitor",
    title: "Smart Classrooms",
    text: "Digitally-enabled classrooms that blend traditional teaching with interactive media.",
  },
  {
    icon: "trophy",
    title: "Sports & Athletics",
    text: "A spacious playground, indoor games and coaching in cricket, football, kabaddi and athletics.",
  },
  {
    icon: "palette",
    title: "Arts & Culture",
    text: "Music, dance, recitation and fine arts nurtured through clubs and annual cultural programmes.",
  },
  {
    icon: "bus",
    title: "Safe Transport",
    text: "GPS-tracked school buses covering Shyamnagar, Naihati, Bhatpara and neighbouring areas.",
  },
] as const;

export const notices = [
  {
    date: "2026-07-18",
    tag: "Admissions",
    title: "Admissions open for the 2026–27 session (Nursery – Class XI)",
  },
  {
    date: "2026-07-10",
    tag: "Result",
    title: "Class XII students achieve 98% pass rate in WBCHSE examinations",
  },
  {
    date: "2026-06-28",
    tag: "Event",
    title: "Annual Science & Innovation Fair scheduled for August 2026",
  },
  {
    date: "2026-06-15",
    tag: "Notice",
    title: "Summer reading challenge — book list now available at the library",
  },
] as const;

export const events = [
  { day: "05", month: "Aug", title: "Science & Innovation Fair", place: "Main Auditorium" },
  { day: "15", month: "Aug", title: "Independence Day Celebration", place: "School Ground" },
  { day: "12", month: "Sep", title: "Inter-house Sports Meet", place: "Athletics Field" },
] as const;

export const testimonials = [
  {
    quote:
      "The teachers here treat every child as their own. My daughter grew not just in marks, but in confidence and kindness.",
    name: "Mrs. Ananya Sen",
    role: "Parent, Class VIII",
  },
  {
    quote:
      "From the science labs to the debate club, Authpur gave me the space to find what I love. I am now studying engineering.",
    name: "Rohan Das",
    role: "Alumnus, Batch of 2023",
  },
  {
    quote:
      "A school that balances discipline with warmth. The values my son learned here will stay with him for life.",
    name: "Mr. Sameer Chatterjee",
    role: "Parent, Class XI",
  },
] as const;

export const galleryTiles = [
  { label: "Campus", span: "row-span-2" },
  { label: "Science Lab", span: "" },
  { label: "Library", span: "" },
  { label: "Sports Day", span: "" },
  { label: "Cultural Fest", span: "" },
] as const;

/* ------------------------------------------------------------------ */
/*  Navigation (grouped, multi-page)                                    */
/* ------------------------------------------------------------------ */

export type NavChild = { label: string; href: string; desc?: string };
export type NavItem = { label: string; href?: string; children?: NavChild[] };

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About",
    children: [
      { label: "Our School", href: "/#about", desc: "Vision, mission & values" },
      { label: "Chairman's Message", href: "/chairmans-message", desc: "From our governing body" },
      { label: "Principal's Message", href: "/principals-message", desc: "A note from the head" },
    ],
  },
  {
    label: "Academics",
    children: [
      { label: "Programmes", href: "/#academics", desc: "Primary to Higher Secondary" },
      { label: "School Labs", href: "/labs", desc: "Science & computer labs" },
      { label: "School Timings", href: "/school-timings", desc: "Daily & section-wise hours" },
    ],
  },
  {
    label: "Admissions",
    children: [
      { label: "Admission", href: "/admissions", desc: "Process, dates & fees" },
      { label: "Admission Enquiry", href: "/admission-enquiry", desc: "Send us your details" },
    ],
  },
  { label: "Gallery", href: "/gallery" },
  { label: "Notice Board", href: "/notices" },
  { label: "Contact", href: "/#contact" },
];

export const footerExplore = [
  { label: "Admission", href: "/admissions" },
  { label: "Admission Enquiry", href: "/admission-enquiry" },
  { label: "School Timings", href: "/school-timings" },
  { label: "School Labs", href: "/labs" },
  { label: "Gallery", href: "/gallery" },
  { label: "Notice Board", href: "/notices" },
];

export const footerNavigate = [
  { label: "Chairman's Message", href: "/chairmans-message" },
  { label: "Principal's Message", href: "/principals-message" },
  { label: "Programmes", href: "/#academics" },
  { label: "Campus Life", href: "/#campus" },
  { label: "Contact", href: "/#contact" },
];

/* ------------------------------------------------------------------ */
/*  Hero image carousel                                                 */
/* ------------------------------------------------------------------ */
/*  Full-width rotating banner images. To use your own photos, replace  */
/*  the files in /public/banners (keep the same names), or add entries  */
/*  here pointing at new files placed in /public.                       */

export type HeroImage = { src: string; alt: string };

export const heroImages: HeroImage[] = [
  { src: "/banners/hero-1.jpg", alt: "Students learning together in a bright classroom" },
  { src: "/banners/hero-2.jpg", alt: "Young students focused on their studies" },
  { src: "/banners/hero-3.jpg", alt: "Students collaborating on a project" },
  { src: "/banners/hero-4.jpg", alt: "The school campus building" },
  { src: "/banners/hero-5.jpg", alt: "Books and reading in the school library" },
];

/* ------------------------------------------------------------------ */
/*  Leadership messages                                                 */
/* ------------------------------------------------------------------ */

export const chairman = {
  name: "Sri Bimal Krishna Ghosh",
  role: "Chairman, Governing Body",
  initials: "BG",
  photoTag: "Chairman",
  message: [
    "It gives me immense pride to welcome you to Authpur National Model Higher Secondary School — an institution built on the belief that every child carries within them a spark waiting to be kindled.",
    "For over four decades, our school has stood as a pillar of learning in Shyamnagar. We have grown, modernised our facilities and broadened our horizons, yet the values on which we were founded — integrity, discipline and compassion — remain unchanged.",
    "As Chairman, my vision is simple: to give the children of our community an education that opens doors, builds character and prepares them not only for examinations, but for life. I invite you to become a part of our extended family.",
  ],
};

export const principal = {
  name: "Dr. (Mrs.) Rina Bhattacharya",
  role: "Principal",
  initials: "RB",
  photoTag: "Principal",
  message: [
    "Dear parents and students, it is my privilege to lead a school where learning is a joy and every child is known, valued and encouraged.",
    "At Authpur National Model, we believe that true education goes far beyond textbooks. Our dedicated teachers work tirelessly to nurture curiosity in the classroom, courage on the playground and kindness in every interaction.",
    "We combine academic rigour with a warm, supportive environment — because a confident, happy child is a child who learns. As you explore our website, I hope you will sense the spirit of care and excellence that defines our school.",
    "I look forward to welcoming your family and to watching your child flourish with us.",
  ],
};

/* ------------------------------------------------------------------ */
/*  School timings                                                      */
/* ------------------------------------------------------------------ */

export const dailySchedule = [
  { label: "School gates open", time: "7:30 AM" },
  { label: "Morning assembly", time: "7:50 AM" },
  { label: "First period begins", time: "8:00 AM" },
  { label: "Tiffin break", time: "10:40 – 11:00 AM" },
  { label: "Classes conclude", time: "2:30 PM" },
] as const;

export const sectionTimings = [
  { section: "Pre-Primary", days: "Mon – Fri", time: "8:00 AM – 11:30 AM" },
  { section: "Primary (Class I – V)", days: "Mon – Sat", time: "8:00 AM – 1:30 PM" },
  { section: "Secondary (Class VI – X)", days: "Mon – Sat", time: "8:00 AM – 2:30 PM" },
  { section: "Higher Secondary (XI – XII)", days: "Mon – Sat", time: "8:00 AM – 2:30 PM" },
] as const;

export const officeHours = "Monday – Saturday · 8:00 AM – 4:00 PM (2nd & 4th Saturdays closed)";
export const timingsNote =
  "Timings may vary during the summer months, examination periods and on special occasions. Any changes are communicated in advance through the notice board.";

/* ------------------------------------------------------------------ */
/*  Laboratories                                                        */
/* ------------------------------------------------------------------ */

export const labs = [
  {
    icon: "atom",
    name: "Physics Laboratory",
    text: "A fully-equipped lab where students verify the laws of motion, optics and electricity through guided experiments.",
    highlights: ["Optics & mechanics kits", "Electrical measurement bench", "Seats 30 students"],
  },
  {
    icon: "flask",
    name: "Chemistry Laboratory",
    text: "Safe, ventilated workspaces with fume hoods for titrations, qualitative analysis and organic chemistry practicals.",
    highlights: ["Fume extraction", "Reagent store room", "Individual work stations"],
  },
  {
    icon: "microscope",
    name: "Biology Laboratory",
    text: "Microscopes, models and specimens that bring the living world to life for our Class 9–12 students.",
    highlights: ["Compound microscopes", "Botanical & zoological models", "Dissection facilities"],
  },
  {
    icon: "cpu",
    name: "Computer Laboratory",
    text: "Modern desktops with high-speed internet for coding, digital literacy and computer-science practicals.",
    highlights: ["40+ workstations", "Broadband connectivity", "Projector & smart board"],
  },
  {
    icon: "languages",
    name: "Language & Maths Lab",
    text: "An interactive space with audio-visual tools and manipulatives that make languages and mathematics tangible.",
    highlights: ["Audio-visual stations", "Maths manipulative kits", "Reading corner"],
  },
  {
    icon: "shield",
    name: "Safety First",
    text: "Every laboratory is fitted with fire extinguishers, first-aid kits and clearly displayed safety protocols.",
    highlights: ["Fire safety equipment", "First-aid stations", "Trained lab assistants"],
  },
] as const;

/* ------------------------------------------------------------------ */
/*  Gallery                                                             */
/* ------------------------------------------------------------------ */

export const gallery = [
  { label: "Main Building", category: "Campus", gradient: "from-brand via-brand-muted to-brand" },
  { label: "Morning Assembly", category: "Campus", gradient: "from-[oklch(0.5_0.12_150)] to-[oklch(0.4_0.1_165)]" },
  { label: "Physics Practical", category: "Academics", gradient: "from-[oklch(0.55_0.11_200)] to-[oklch(0.42_0.1_220)]" },
  { label: "Reading in the Library", category: "Academics", gradient: "from-[oklch(0.62_0.13_30)] to-[oklch(0.5_0.12_20)]" },
  { label: "Annual Sports Meet", category: "Sports", gradient: "from-[oklch(0.6_0.14_45)] to-[oklch(0.48_0.12_35)]" },
  { label: "Football Team", category: "Sports", gradient: "from-[oklch(0.5_0.12_150)] to-[oklch(0.42_0.1_160)]" },
  { label: "Cultural Evening", category: "Events", gradient: "from-gold to-[oklch(0.62_0.13_60)]" },
  { label: "Independence Day", category: "Events", gradient: "from-[oklch(0.55_0.14_25)] to-[oklch(0.45_0.12_15)]" },
  { label: "Science Fair", category: "Events", gradient: "from-[oklch(0.52_0.12_260)] to-[oklch(0.4_0.1_270)]" },
] as const;

export const galleryCategories = ["All", "Campus", "Academics", "Sports", "Events"] as const;

/* ------------------------------------------------------------------ */
/*  Admissions                                                          */
/* ------------------------------------------------------------------ */

export const admissionSteps = [
  { title: "Enquire & collect form", text: "Visit the school office or submit an online enquiry to receive the prospectus and application form." },
  { title: "Submit application", text: "Return the completed form with the required documents and registration fee before the last date." },
  { title: "Interaction", text: "A friendly interaction with the child and parents (and a simple assessment for higher classes)." },
  { title: "Confirm admission", text: "On selection, complete the admission formalities and fee payment to secure the seat." },
] as const;

export const admissionDates = [
  { event: "Forms available", date: "Now open" },
  { event: "Last date to apply", date: "31 August 2026" },
  { event: "Interaction / assessment", date: "First week, September 2026" },
  { event: "Session begins", date: "April 2027" },
] as const;

export const eligibility = [
  { level: "Nursery", criteria: "3+ years as on 1st April" },
  { level: "Class I", criteria: "5+ years as on 1st April" },
  { level: "Class VI", criteria: "Passed Class V from a recognised school" },
  { level: "Class XI", criteria: "Passed Class X (Madhyamik) — stream as per marks" },
] as const;

export const feeStructure = [
  { head: "Registration (one-time)", amount: "₹500" },
  { head: "Admission fee (one-time)", amount: "₹4,000 – ₹6,000" },
  { head: "Monthly tuition — Primary", amount: "₹700" },
  { head: "Monthly tuition — Secondary", amount: "₹900" },
  { head: "Monthly tuition — Higher Secondary", amount: "₹1,200" },
] as const;

export const admissionDocuments = [
  "Birth certificate of the child",
  "Passport-size photographs (4 copies)",
  "Aadhaar card of the child & parents",
  "Report card / transfer certificate from previous school",
  "Residential address proof",
] as const;

export const feeNote =
  "Indicative fees for the 2026–27 session. Please contact the school office for the exact, class-wise fee schedule and available concessions.";
