import {
  AirVent,
  Building2,
  Camera,
  Check,
  Clapperboard,
  CookingPot,
  Film,
  Mic,
  Music,
  Music2,
  Palette,
  ParkingCircle,
  PersonStanding,
  Sparkles,
  Toilet,
  Wifi,
  type LucideIcon,
} from "lucide-react";

export type StudioCategoryOption = {
  name: string;
  icon: LucideIcon;
};

export const STUDIO_CATEGORIES = [
  { name: "Photo Studio", icon: Camera },
  { name: "Music Suite", icon: Music2 },
  { name: "Art Space", icon: Palette },
  { name: "Dance Studio", icon: PersonStanding },
  { name: "Podcast Lounge", icon: Mic },
  { name: "Film Stage", icon: Clapperboard },
] satisfies StudioCategoryOption[];

export const STUDIO_AMENITIES = [
  { name: "Wi-Fi", icon: Wifi },
  { name: "Parking", icon: ParkingCircle },
  { name: "Air Conditioning", icon: AirVent },
  { name: "Natural Light", icon: Sparkles },
  { name: "Kitchen", icon: Building2 },
  { name: "Restroom", icon: Check },
  { name: "Soundproof", icon: Mic },
  { name: "Lighting Equipment", icon: Camera },
] satisfies StudioCategoryOption[];

export const EDIT_STUDIO_AMENITIES = [
  { name: "Wi-Fi", icon: Wifi },
  { name: "Parking", icon: ParkingCircle },
  { name: "Air Conditioning", icon: AirVent },
  { name: "Natural Light", icon: Sparkles },
  { name: "Kitchen", icon: CookingPot },
  { name: "Restroom", icon: Toilet },
  { name: "Soundproof", icon: Mic },
  { name: "Lighting Equipment", icon: Camera },
] satisfies StudioCategoryOption[];

export const CATEGORY_FILTERS = [
  { label: "All Studios", value: "" },
  { label: "Photography", value: "Photo Studio" },
  { label: "Music", value: "Music Suite" },
  { label: "Art", value: "Workshop" },
  { label: "Dance", value: "Dance Studio" },
  { label: "Podcast", value: "Podcast Lounge" },
  { label: "Film", value: "Film Stage" },
];

export const HOME_CATEGORY_CARDS = [
  {
    name: "Photo Studios",
    catItem: "Photo Studio",
    icon: Camera,
    count: "420 studios",
  },
  {
    name: "Sound Stages",
    catItem: "Film Stage",
    icon: Film,
    count: "156 studios",
  },
  {
    name: "Podcast Rooms",
    catItem: "Podcast Lounge",
    icon: Mic,
    count: "178 studios",
  },
  {
    name: "Music Suites",
    catItem: "Music Suite",
    icon: Music,
    count: "385 studios",
  },
  {
    name: "Art Workshops",
    catItem: "Art Space",
    icon: Palette,
    count: "290 studios",
  },
  {
    name: "Dance",
    catItem: "Dance Studio",
    icon: PersonStanding,
    count: "290 studios",
  },
];
