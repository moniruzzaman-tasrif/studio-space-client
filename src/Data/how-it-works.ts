import {
  BadgeCheck,
  CalendarCheck,
  CalendarDays,
  ClipboardList,
  DollarSign,
  Headset,
  Search,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";

export const GUEST_STEPS = [
  {
    number: "01",
    title: "Discover Spaces",
    description:
      "Browse studios by location, type, price, and amenities to find the right space.",
    icon: Search,
    points: ["Filter by city and category", "See real photos", "Compare amenities"],
  },
  {
    number: "02",
    title: "Select Shoot Hours",
    description: "Choose the date and hours that fit your production schedule.",
    icon: CalendarDays,
    points: ["Pick your date", "Choose your hours", "Review availability"],
  },
  {
    number: "03",
    title: "Book Instantly",
    description:
      "Review the booking details and total cost, then submit your reservation.",
    icon: CalendarCheck,
    points: ["Clear pricing", "Secure checkout", "Booking confirmation"],
  },
  {
    number: "04",
    title: "Create & Produce",
    description:
      "Arrive at your studio and bring your creative project to life.",
    icon: Sparkles,
    points: ["Professional equipment", "Host support", "Leave a review"],
  },
];

export const CREATOR_ASSURANCES = [
  {
    title: "Liability Protection",
    description:
      "Eligible bookings include liability protection. Review the booking terms for coverage details.",
    icon: ShieldCheck,
  },
  {
    title: "Verified Profiles",
    description:
      "Profile verification helps creators and hosts know who they are working with.",
    icon: BadgeCheck,
  },
  {
    title: "Equipment Safety",
    description:
      "Studio equipment details and host instructions help you plan a safe production.",
    icon: Wrench,
  },
  {
    title: "24/7 Host Support",
    description:
      "Reach out for help with your booking and studio questions whenever you need it.",
    icon: Headset,
  },
];

export const HOST_STEPS = [
  {
    title: "Create an Account",
    description: "Sign up and tell us a little about yourself.",
    icon: ClipboardList,
  },
  {
    title: "Add Your Studio",
    description: "Upload photos, set your price, and list your amenities.",
    icon: Sparkles,
  },
  {
    title: "Get Bookings",
    description: "Review reservation requests and welcome new creators.",
    icon: CalendarCheck,
  },
  {
    title: "Get Paid",
    description: "Earn from your space and grow your creative business.",
    icon: DollarSign,
  },
];

export const HOW_IT_WORKS_QUESTIONS = [
  {
    question: "How do I cancel a booking?",
    answer:
      "Open My Bookings and select Cancel Booking on a pending reservation. For confirmed bookings, contact the host to discuss your options.",
  },
  {
    question: "Is my payment secure?",
    answer:
      "Your payment details are handled securely. The booking page displays the rate, service fee, and any security deposit before you submit a request.",
  },
  {
    question: "How do I become a host?",
    answer:
      "Create an account, choose Add New Studio, and provide your studio details, photos, amenities, and pricing.",
  },
  {
    question: "What if the studio doesn’t match the listing?",
    answer:
      "Contact your host as soon as possible. You can also reach out to StudioSpace support with your booking details.",
  },
  {
    question: "How much does it cost to list a studio?",
    answer:
      "Creating a studio listing is free. Any fees associated with a reservation are shown before a guest submits a booking request.",
  },
];

