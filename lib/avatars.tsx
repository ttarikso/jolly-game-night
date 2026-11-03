import React from "react";

export interface CartoonAvatar {
  id: string;
  name: string;
  shortName: string;
  title: string;
  bg: string;
  ring: string;
  svg: React.ReactNode;
}

export const AVATARS: CartoonAvatar[] = [
  {
    id: "santa",
    name: "Jolly Santa",
    shortName: "Santa",
    title: "The Big Boss",
    bg: "linear-gradient(135deg, #D92638 0%, #8E1220 100%)",
    ring: "#F0C96E",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Hat */}
        <path d="M18 44 C20 15, 65 12, 84 36 L72 46 Z" fill="#E63946" />
        <circle cx="84" cy="36" r="9" fill="#FFFBF3" />
        {/* Face */}
        <circle cx="50" cy="54" r="24" fill="#FFDCB8" />
        <circle cx="36" cy="56" r="5" fill="#FF8FA3" opacity="0.6" />
        <circle cx="64" cy="56" r="5" fill="#FF8FA3" opacity="0.6" />
        {/* Beard */}
        <path d="M24 54 C20 78, 38 92, 50 92 C62 92, 80 78, 76 54 C70 60, 30 60, 24 54 Z" fill="#FFFBF3" />
        {/* Hat Brim */}
        <rect x="20" y="34" width="60" height="12" rx="6" fill="#FFFBF3" />
        {/* Eyes & Glasses */}
        <circle cx="41" cy="50" r="3.5" fill="#1F1B16" />
        <circle cx="59" cy="50" r="3.5" fill="#1F1B16" />
        <circle cx="41" cy="50" r="7" fill="none" stroke="#F0C96E" strokeWidth="2.5" />
        <circle cx="59" cy="50" r="7" fill="none" stroke="#F0C96E" strokeWidth="2.5" />
        {/* Nose & Mustache */}
        <circle cx="50" cy="56" r="5" fill="#F28482" />
        <path d="M32 64 Q42 58 50 63 Q58 58 68 64 Q58 70 50 65 Q42 70 32 64 Z" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    id: "elf-boy",
    name: "Zippy the Elf",
    shortName: "Zippy",
    title: "Toy Maker",
    bg: "linear-gradient(135deg, #22694F 0%, #0E3B2E 100%)",
    ring: "#F0C96E",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Pointy Ears */}
        <path d="M14 48 L28 46 L26 62 Z" fill="#FFDCB8" />
        <path d="M86 48 L72 46 L74 62 Z" fill="#FFDCB8" />
        {/* Face */}
        <circle cx="50" cy="56" r="23" fill="#FFDCB8" />
        {/* Elf Hat */}
        <path d="M22 44 C30 10, 68 12, 82 32 L74 44 Z" fill="#2A9D8F" />
        <path d="M20 40 L80 40 L76 48 L24 48 Z" fill="#E63946" />
        <circle cx="82" cy="30" r="7" fill="#F0C96E" />
        {/* Eyes & Big Smile */}
        <circle cx="41" cy="54" r="4" fill="#1F1B16" />
        <circle cx="59" cy="54" r="4" fill="#1F1B16" />
        <circle cx="42.5" cy="52.5" r="1.5" fill="#FFF" />
        <circle cx="60.5" cy="52.5" r="1.5" fill="#FFF" />
        <circle cx="35" cy="60" r="4" fill="#FF758F" opacity="0.55" />
        <circle cx="65" cy="60" r="4" fill="#FF758F" opacity="0.55" />
        <path d="M40 64 Q50 74 60 64" fill="none" stroke="#1F1B16" strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "rudolph",
    name: "Ruby the Reindeer",
    shortName: "Ruby",
    title: "Sleigh Leader",
    bg: "linear-gradient(135deg, #9C6644 0%, #582F0E 100%)",
    ring: "#F6DC9C",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Antlers */}
        <path d="M28 36 L18 16 M23 26 L14 24 M25 22 L32 16" stroke="#F6DC9C" strokeWidth="5" strokeLinecap="round" />
        <path d="M72 36 L82 16 M77 26 L86 24 M75 22 L68 16" stroke="#F6DC9C" strokeWidth="5" strokeLinecap="round" />
        {/* Ears */}
        <ellipse cx="24" cy="44" rx="8" ry="5" transform="rotate(-25 24 44)" fill="#7F4F24" />
        <ellipse cx="76" cy="44" rx="8" ry="5" transform="rotate(25 76 44)" fill="#7F4F24" />
        {/* Head */}
        <circle cx="50" cy="56" r="24" fill="#A66E38" />
        <ellipse cx="50" cy="64" rx="16" ry="13" fill="#DDB892" />
        {/* Eyes */}
        <circle cx="40" cy="48" r="4" fill="#1F1B16" />
        <circle cx="60" cy="48" r="4" fill="#1F1B16" />
        <circle cx="41.5" cy="46.5" r="1.5" fill="#FFF" />
        <circle cx="61.5" cy="46.5" r="1.5" fill="#FFF" />
        {/* Cute Reindeer Nose & Bell Collar */}
        <ellipse cx="50" cy="59" rx="6.5" ry="5" fill="#582F0E" />
        <circle cx="48" cy="57.5" r="2" fill="#A66E38" />
        <path d="M43 68 Q50 73 57 68" fill="none" stroke="#1F1B16" strokeWidth="3" strokeLinecap="round" />
        <path d="M32 76 Q50 84 68 76" fill="none" stroke="#D62839" strokeWidth="5" strokeLinecap="round" />
        <circle cx="50" cy="82" r="5" fill="#F6DC9C" />
      </svg>
    ),
  },
  {
    id: "snowman",
    name: "Chilly the Snowman",
    shortName: "Chilly",
    title: "Coolest in Town",
    bg: "linear-gradient(135deg, #3A86FF 0%, #1D3557 100%)",
    ring: "#A8DADC",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Cozy Knit Winter Beanie */}
        <path d="M28 38 C30 16, 70 16, 72 38 Z" fill="#22694F" />
        <circle cx="50" cy="15" r="7" fill="#FFFFFF" />
        <rect x="26" y="32" width="48" height="8" rx="4" fill="#D62839" />
        {/* Snow Head */}
        <circle cx="50" cy="58" r="24" fill="#FFFFFF" />
        {/* Scarf */}
        <path d="M28 74 Q50 82 72 74 L70 84 Q50 90 30 84 Z" fill="#D62839" />
        <rect x="56" y="76" width="10" height="18" rx="4" fill="#22694F" />
        {/* Eyes & Carrot Nose */}
        <circle cx="41" cy="50" r="3.5" fill="#1F1B16" />
        <circle cx="59" cy="50" r="3.5" fill="#1F1B16" />
        <polygon points="48,54 68,58 48,61" fill="#FB8500" />
        {/* Smile */}
        <path d="M40 66 Q50 73 60 66" fill="none" stroke="#1F1B16" strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "grinch",
    name: "Grumpy Goblin",
    shortName: "Goblin",
    title: "Bah Humbug Club",
    bg: "linear-gradient(135deg, #52B788 0%, #1B4332 100%)",
    ring: "#B7E4C7",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Goblin Pointy Ears */}
        <polygon points="12,50 28,44 26,62" fill="#52B788" />
        <polygon points="88,50 72,44 74,62" fill="#52B788" />
        {/* Striped Winter Cap */}
        <path d="M26 38 C34 14, 66 14, 74 38 Z" fill="#185443" />
        <rect x="24" y="33" width="52" height="8" rx="4" fill="#D62839" />
        {/* Round Goblin Face */}
        <circle cx="50" cy="56" r="23" fill="#52B788" />
        {/* Grumpy Brows & Dark Eyes */}
        <path d="M33 46 L45 50" stroke="#1B4332" strokeWidth="4" strokeLinecap="round" />
        <path d="M67 46 L55 50" stroke="#1B4332" strokeWidth="4" strokeLinecap="round" />
        <circle cx="40" cy="54" r="4" fill="#1B4332" />
        <circle cx="60" cy="54" r="4" fill="#1B4332" />
        <circle cx="41" cy="52.5" r="1.5" fill="#FFFFFF" />
        <circle cx="61" cy="52.5" r="1.5" fill="#FFFFFF" />
        {/* Little Fang Grin */}
        <path d="M38 66 Q50 62 62 66" fill="none" stroke="#1B4332" strokeWidth="3.5" strokeLinecap="round" />
        <polygon points="43,65 46,60 49,65" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    id: "gingerbread",
    name: "Gingy Cookie",
    shortName: "Gingy",
    title: "Sweet & Crispy",
    bg: "linear-gradient(135deg, #D4A373 0%, #8A5A44 100%)",
    ring: "#FFFBF3",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="54" r="27" fill="#BC6C25" />
        {/* Icing Hair Squiggle */}
        <path d="M32 34 Q40 40 50 34 Q60 40 68 34" fill="none" stroke="#FFFBF3" strokeWidth="4.5" strokeLinecap="round" />
        {/* Icing Eyes */}
        <circle cx="40" cy="50" r="4.5" fill="#FFFBF3" />
        <circle cx="60" cy="50" r="4.5" fill="#FFFBF3" />
        <circle cx="41" cy="50" r="2" fill="#1F1B16" />
        <circle cx="61" cy="50" r="2" fill="#1F1B16" />
        {/* Rosy Cheeks */}
        <circle cx="33" cy="58" r="4" fill="#FF4D6D" />
        <circle cx="67" cy="58" r="4" fill="#FF4D6D" />
        {/* Icing Smile */}
        <path d="M38 63 Q50 73 62 63" fill="none" stroke="#FFFBF3" strokeWidth="4" strokeLinecap="round" />
        {/* Bowtie */}
        <polygon points="38,79 50,85 38,91" fill="#E63946" />
        <polygon points="62,79 50,85 62,91" fill="#E63946" />
        <circle cx="50" cy="85" r="3.5" fill="#F0C96E" />
      </svg>
    ),
  },
  {
    id: "mrs-claus",
    name: "Mama Claus",
    shortName: "Mama Claus",
    title: "Cookie Queen",
    bg: "linear-gradient(135deg, #B5283B 0%, #641220 100%)",
    ring: "#F6DC9C",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Hair Bun */}
        <circle cx="50" cy="24" r="14" fill="#E5E5E5" />
        <circle cx="50" cy="56" r="23" fill="#FFDCB8" />
        {/* White Hair */}
        <path d="M26 52 C26 32, 74 32, 74 52 C64 42, 36 42, 26 52 Z" fill="#F8F9FA" />
        {/* Glasses */}
        <circle cx="41" cy="55" r="7" fill="none" stroke="#E8B850" strokeWidth="2.5" />
        <circle cx="59" cy="55" r="7" fill="none" stroke="#E8B850" strokeWidth="2.5" />
        <line x1="48" y1="55" x2="52" y2="55" stroke="#E8B850" strokeWidth="2.5" />
        <circle cx="41" cy="55" r="3" fill="#1F1B16" />
        <circle cx="59" cy="55" r="3" fill="#1F1B16" />
        {/* Cheeks & Warm Smile */}
        <circle cx="34" cy="63" r="4.5" fill="#FF8FA3" opacity="0.6" />
        <circle cx="66" cy="63" r="4.5" fill="#FF8FA3" opacity="0.6" />
        <path d="M42 66 Q50 73 58 66" fill="none" stroke="#B5283B" strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "penguin",
    name: "Pingo Penguin",
    shortName: "Pingo",
    title: "Ice Skater",
    bg: "linear-gradient(135deg, #0077B6 0%, #03045E 100%)",
    ring: "#90E0EF",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Beanie Hat */}
        <path d="M28 38 C30 18, 70 18, 72 38 Z" fill="#E63946" />
        <circle cx="50" cy="18" r="6" fill="#FFFBF3" />
        {/* Body/Head */}
        <circle cx="50" cy="58" r="25" fill="#1D2D44" />
        <ellipse cx="50" cy="61" rx="18" ry="18" fill="#FFFFFF" />
        {/* Eyes & Beak */}
        <circle cx="41" cy="52" r="3.5" fill="#1D2D44" />
        <circle cx="59" cy="52" r="3.5" fill="#1D2D44" />
        <polygon points="44,57 56,57 50,65" fill="#FFB703" />
        <circle cx="35" cy="58" r="3.5" fill="#FF8FA3" opacity="0.6" />
        <circle cx="65" cy="58" r="3.5" fill="#FF8FA3" opacity="0.6" />
      </svg>
    ),
  },
  {
    id: "polar-bear",
    name: "Barnaby Bear",
    shortName: "Barnaby",
    title: "Arctic Hugger",
    bg: "linear-gradient(135deg, #457B9D 0%, #1D3557 100%)",
    ring: "#F1FAEE",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="28" cy="34" r="9" fill="#FFFBF3" />
        <circle cx="72" cy="34" r="9" fill="#FFFBF3" />
        <circle cx="28" cy="34" r="5" fill="#FFCCD5" />
        <circle cx="72" cy="34" r="5" fill="#FFCCD5" />
        <circle cx="50" cy="56" r="25" fill="#FFFBF3" />
        <ellipse cx="50" cy="62" rx="11" ry="9" fill="#E5E5E5" />
        <circle cx="40" cy="50" r="3.5" fill="#1F1B16" />
        <circle cx="60" cy="50" r="3.5" fill="#1F1B16" />
        <ellipse cx="50" cy="59" rx="5" ry="3.5" fill="#1F1B16" />
        <path d="M45 65 Q50 69 55 65" fill="none" stroke="#1F1B16" strokeWidth="2.5" strokeLinecap="round" />
        {/* Scarf */}
        <rect x="30" y="76" width="40" height="9" rx="4.5" fill="#2A9D8F" />
      </svg>
    ),
  },
  {
    id: "nutcracker",
    name: "Captain Tinsel",
    shortName: "Tinsel",
    title: "Toy Soldier",
    bg: "linear-gradient(135deg, #7209B7 0%, #3A0CA3 100%)",
    ring: "#F0C96E",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Tall Soldier Hat */}
        <rect x="30" y="14" width="40" height="24" rx="4" fill="#1F1B16" />
        <rect x="30" y="33" width="40" height="5" fill="#F0C96E" />
        <circle cx="50" cy="24" r="5" fill="#E63946" />
        {/* Face */}
        <rect x="32" y="38" width="36" height="36" rx="10" fill="#FFDCB8" />
        <circle cx="41" cy="50" r="3.5" fill="#1F1B16" />
        <circle cx="59" cy="50" r="3.5" fill="#1F1B16" />
        <circle cx="36" cy="58" r="4" fill="#E63946" opacity="0.6" />
        <circle cx="64" cy="58" r="4" fill="#E63946" opacity="0.6" />
        {/* Handlebar Mustache */}
        <path d="M34 63 Q44 58 50 63 Q56 58 66 63" fill="none" stroke="#1F1B16" strokeWidth="4" strokeLinecap="round" />
        <rect x="44" y="66" width="12" height="6" rx="1" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    id: "elf-girl",
    name: "Holly Sparkle",
    shortName: "Holly",
    title: "Gift Wrapper",
    bg: "linear-gradient(135deg, #EC4899 0%, #9D174D 100%)",
    ring: "#FDE68A",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Ears */}
        <path d="M15 52 L28 48 L26 62 Z" fill="#FFDCB8" />
        <path d="M85 52 L72 48 L74 62 Z" fill="#FFDCB8" />
        {/* Hair */}
        <circle cx="50" cy="54" r="25" fill="#6D2E46" />
        <circle cx="50" cy="58" r="21" fill="#FFDCB8" />
        {/* Hat */}
        <path d="M24 42 C34 14, 66 14, 76 42 Z" fill="#E63946" />
        <path d="M22 38 L78 38 L75 45 L25 45 Z" fill="#2A9D8F" />
        {/* Eyes & Smile */}
        <circle cx="41" cy="55" r="3.5" fill="#1F1B16" />
        <circle cx="59" cy="55" r="3.5" fill="#1F1B16" />
        <path d="M42 65 Q50 72 58 65" fill="none" stroke="#E63946" strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "christmas-cat",
    name: "Whiskers Noel",
    shortName: "Whiskers",
    title: "Tree Climber",
    bg: "linear-gradient(135deg, #F59E0B 0%, #B45309 100%)",
    ring: "#FEF3C7",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Cat Ears */}
        <polygon points="24,46 30,22 44,36" fill="#FB8500" />
        <polygon points="76,46 70,22 56,36" fill="#FB8500" />
        <circle cx="50" cy="56" r="24" fill="#FFB703" />
        {/* Eyes */}
        <circle cx="40" cy="52" r="4" fill="#1F1B16" />
        <circle cx="60" cy="52" r="4" fill="#1F1B16" />
        <circle cx="41.5" cy="50.5" r="1.5" fill="#FFF" />
        <circle cx="61.5" cy="50.5" r="1.5" fill="#FFF" />
        {/* Pink Nose & Whiskers */}
        <polygon points="46,58 54,58 50,63" fill="#FF4D6D" />
        <path d="M44 65 Q50 69 56 65" fill="none" stroke="#1F1B16" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="20" y1="56" x2="33" y2="58" stroke="#FFFBF3" strokeWidth="2" strokeLinecap="round" />
        <line x1="20" y1="62" x2="33" y2="62" stroke="#FFFBF3" strokeWidth="2" strokeLinecap="round" />
        <line x1="80" y1="56" x2="67" y2="58" stroke="#FFFBF3" strokeWidth="2" strokeLinecap="round" />
        <line x1="80" y1="62" x2="67" y2="62" stroke="#FFFBF3" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "holiday-pup",
    name: "Buster Pup",
    shortName: "Buster",
    title: "Sleigh Helper",
    bg: "linear-gradient(135deg, #10B981 0%, #047857 100%)",
    ring: "#A7F3D0",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Floppy Ears */}
        <ellipse cx="24" cy="56" rx="9" ry="16" fill="#6C584C" />
        <ellipse cx="76" cy="56" rx="9" ry="16" fill="#6C584C" />
        <circle cx="50" cy="54" r="23" fill="#DDB892" />
        {/* Single Antler Headband */}
        <path d="M50 31 L50 13 M50 21 L42 16 M50 18 L58 14" stroke="#9C6644" strokeWidth="4.5" strokeLinecap="round" />
        {/* Eyes & Tongue */}
        <circle cx="41" cy="50" r="4" fill="#1F1B16" />
        <circle cx="59" cy="50" r="4" fill="#1F1B16" />
        <ellipse cx="50" cy="58" rx="5.5" ry="4" fill="#1F1B16" />
        <path d="M46 66 Q50 76 54 66 Z" fill="#FF4D6D" />
      </svg>
    ),
  },
  {
    id: "snow-owl",
    name: "Hootie Owl",
    shortName: "Hootie",
    title: "Quiz Master",
    bg: "linear-gradient(135deg, #6366F1 0%, #312E81 100%)",
    ring: "#C7D2FE",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="56" r="25" fill="#E2E8F0" />
        <circle cx="39" cy="50" r="10" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="2" />
        <circle cx="61" cy="50" r="10" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="2" />
        <circle cx="39" cy="50" r="4.5" fill="#1E293B" />
        <circle cx="61" cy="50" r="4.5" fill="#1E293B" />
        <polygon points="46,56 54,56 50,64" fill="#F59E0B" />
        {/* Scarf */}
        <rect x="28" y="75" width="44" height="8" rx="4" fill="#E63946" />
      </svg>
    ),
  },
  {
    id: "arctic-fox",
    name: "Foxy Tinsel",
    shortName: "Foxy",
    title: "Sleigh Navigator",
    bg: "linear-gradient(135deg, #F97316 0%, #9A3412 100%)",
    ring: "#FED7AA",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <polygon points="22,46 28,18 44,36" fill="#EA580C" />
        <polygon points="78,46 72,18 56,36" fill="#EA580C" />
        <circle cx="50" cy="56" r="24" fill="#F97316" />
        <path d="M26 58 Q38 56 50 76 Q62 56 74 58 C72 74, 28 74, 26 58 Z" fill="#FFFBF3" />
        <circle cx="40" cy="50" r="3.5" fill="#1F1B16" />
        <circle cx="60" cy="50" r="3.5" fill="#1F1B16" />
        <circle cx="50" cy="64" r="4" fill="#1F1B16" />
      </svg>
    ),
  },
  {
    id: "hot-cocoa",
    name: "Cocoa Mug",
    shortName: "Cocoa",
    title: "Cozy Champion",
    bg: "linear-gradient(135deg, #EC4899 0%, #701A75 100%)",
    ring: "#FBCFE8",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Whipped Cream Top */}
        <path d="M28 42 C28 22, 72 22, 72 42 Z" fill="#FFFBF3" />
        {/* Mug */}
        <rect x="24" y="38" width="48" height="44" rx="10" fill="#E63946" />
        <path d="M72 48 C84 48, 84 68, 72 68" fill="none" stroke="#E63946" strokeWidth="6" strokeLinecap="round" />
        {/* Cute Face on Mug */}
        <circle cx="39" cy="56" r="3.5" fill="#FFFBF3" />
        <circle cx="57" cy="56" r="3.5" fill="#FFFBF3" />
        <path d="M42 64 Q48 70 54 64" fill="none" stroke="#FFFBF3" strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "yeti",
    name: "Blizzard Yeti",
    shortName: "Blizzard",
    title: "Snow Monster",
    bg: "linear-gradient(135deg, #06B6D4 0%, #164E63 100%)",
    ring: "#A5F3FC",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Horns */}
        <path d="M26 34 Q16 22 24 16" fill="none" stroke="#F0C96E" strokeWidth="6" strokeLinecap="round" />
        <path d="M74 34 Q84 22 76 16" fill="none" stroke="#F0C96E" strokeWidth="6" strokeLinecap="round" />
        {/* Fluffy Fur */}
        <circle cx="50" cy="56" r="26" fill="#E0F2FE" />
        {/* Blue Face */}
        <rect x="33" y="42" width="34" height="26" rx="12" fill="#38BDF8" />
        <circle cx="42" cy="52" r="3.5" fill="#0F172A" />
        <circle cx="58" cy="52" r="3.5" fill="#0F172A" />
        <path d="M40 61 L60 61" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
        <polygon points="42,61 45,66 48,61" fill="#FFFFFF" />
        <polygon points="52,61 55,66 58,61" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    id: "snow-queen",
    name: "Ice Queen Nova",
    shortName: "Nova",
    title: "Winter Royalty",
    bg: "linear-gradient(135deg, #3B82F6 0%, #1E3A8A 100%)",
    ring: "#93C5FD",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Snowflake Tiara */}
        <polygon points="32,36 40,18 50,26 60,18 68,36" fill="#93C5FD" stroke="#FFFFFF" strokeWidth="2" />
        <circle cx="50" cy="20" r="3.5" fill="#FFFFFF" />
        <circle cx="50" cy="56" r="22" fill="#FFDCB8" />
        {/* Dark Winter Hair */}
        <path d="M27 52 C28 32, 72 32, 73 52 C62 42, 38 42, 27 52 Z" fill="#1E293B" />
        <circle cx="41" cy="54" r="3.5" fill="#1E3A8A" />
        <circle cx="59" cy="54" r="3.5" fill="#1E3A8A" />
        <path d="M43 65 Q50 70 57 65" fill="none" stroke="#E11D48" strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "sloth",
    name: "Cozy Sloth",
    shortName: "Sloth",
    title: "Nap Champion",
    bg: "linear-gradient(135deg, #8B5CF6 0%, #4C1D95 100%)",
    ring: "#DDD6FE",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="56" r="25" fill="#A68A64" />
        <ellipse cx="50" cy="58" rx="19" ry="16" fill="#EDE0D4" />
        <ellipse cx="38" cy="54" rx="7" ry="5" fill="#582F0E" />
        <ellipse cx="62" cy="54" rx="7" ry="5" fill="#582F0E" />
        <circle cx="38" cy="54" r="2.5" fill="#FFF" />
        <circle cx="62" cy="54" r="2.5" fill="#FFF" />
        <ellipse cx="50" cy="59" rx="4" ry="3" fill="#582F0E" />
        <path d="M43 65 Q50 70 57 65" fill="none" stroke="#582F0E" strokeWidth="2.5" strokeLinecap="round" />
        {/* Santa Hat */}
        <path d="M28 38 C36 16, 66 16, 72 38 Z" fill="#E63946" />
        <rect x="26" y="34" width="48" height="7" rx="3.5" fill="#FFFBF3" />
      </svg>
    ),
  },
  {
    id: "star-kid",
    name: "Twinkle Star",
    shortName: "Twinkle",
    title: "Tree Topper",
    bg: "linear-gradient(135deg, #EAB308 0%, #713F12 100%)",
    ring: "#FEF08A",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <polygon
          points="50,12 61,35 86,38 67,56 72,82 50,69 28,82 33,56 14,38 39,35"
          fill="#FACC15"
          stroke="#FEF08A"
          strokeWidth="2"
        />
        <circle cx="42" cy="48" r="3.5" fill="#1F1B16" />
        <circle cx="58" cy="48" r="3.5" fill="#1F1B16" />
        <circle cx="36" cy="54" r="3.5" fill="#F97316" opacity="0.6" />
        <circle cx="64" cy="54" r="3.5" fill="#F97316" opacity="0.6" />
        <path d="M43 57 Q50 63 57 57" fill="none" stroke="#1F1B16" strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function getAvatar(id?: string): CartoonAvatar {
  return AVATARS.find((a) => a.id === id) || AVATARS[0];
}

export function AvatarBadge({
  id,
  size = "md",
  className = "",
}: {
  id?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const av = getAvatar(id);
  const dims = {
    xs: "w-7 h-7",
    sm: "w-9 h-9",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-20 h-20",
  }[size];
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full overflow-hidden shadow-md border-2 border-white/80 ${dims} ${className}`}
      style={{ background: av.bg }}
      title={av.name}
    >
      {av.svg}
    </span>
  );
}
