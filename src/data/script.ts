export interface Scene {
  id: number;
  title: string;
  description: string;
  prompt: string;
}

export const SCENES: Scene[] = [
  {
    id: 1,
    title: "The Glorious Leader",
    description: "Micro$ parades through the idyllic suburban street.",
    prompt: "1930s black and white rubber hose animation style, cheerful anthropomorphic CRT computer monitor character wearing top hat, white gloves, bow tie, carrying briefcases labeled 'MS', marching through idyllic suburban street, cartoon houses with rounded architecture, smiling sun, film grain, vintage Disney/Fleischer Studios aesthetic, propaganda poster composition, high contrast, joyful but slightly unsettling wide grin, pie-cut eyes, bouncing gait, 4K, masterpiece"
  },
  {
    id: 2,
    title: "The Micro-Carrot Mandate",
    description: "Micro$ forces a carrot on the family.",
    prompt: "1930s cartoon style, anthropomorphic computer monitor in doctor's coat bursting through dining room wall, forcing oversized carrot into mouth of shocked 1930s father character, family dinner table, mother hiding under table, progress bar floating in air saying 'Installing...', black and white with slight sepia, rubber hose limbs, exaggerated expressions, vintage animation, comedy chaos, film grain, propaganda art"
  },
  {
    id: 3,
    title: "Clippy the Enforcer",
    description: "Clippy in military uniform at the re-education center.",
    prompt: "1930s animation style, anthropomorphic metal paperclip character wearing military uniform with armband saying 'How May I Help You?', aviator goggles, 8 feet tall, standing in 're-education center' with barbed wire made of USB cables, sinister but cheerful expression, mechanical arms extended, black and white, Fleischer Studios style, retro-futuristic dystopia, film grain, high contrast, unsettling friendly demeanor"
  },
  {
    id: 4,
    title: "The BloatWaffe Attack",
    description: "Flying toasters dropping app icons.",
    prompt: "1930s cartoon style, squadron of flying toasters with Windows logos as bomber planes, dropping app icons instead of bombs, darkening sky over suburban neighborhood, citizens pointing up in horror, Candy Crush and Xbox icons falling, Wagner-esque military march visualized through cloud formations, black and white, film grain, satirical war propaganda poster composition, rubber hose animation aesthetic"
  },
  {
    id: 5,
    title: "The Cloud™",
    description: "Data disappearing into the cloud.",
    prompt: "1930s style, fluffy cartoon clouds with filing cabinets sticking out, giant magnet labeled 'SYNC ERROR' passing by, family photos vanishing from album, replaced by generic stock photos, confused grandmother character, hollow smiling clouds, vintage animation, black and white, subtle horror, film grain, Disney 1930s aesthetic gone wrong"
  },
  {
    id: 6,
    title: "The Final Assimilation",
    description: "Citizens with CRT monitor heads.",
    prompt: "1930s animation style, suburban street from opening scene but twisted, citizens with CRT monitor heads all showing identical wide grins, Micro$ character towering over them, too-wide smile revealing rows of USB ports inside mouth, hollow cardboard trees, windows showing only loading circles, black and white, film grain, uncanny valley, propaganda horror, Fleischer Studios meets dystopian nightmare"
  },
  {
    id: 7,
    title: "The Blue Screen of Death (Joy)",
    description: "The classic BSOD but 'happy'.",
    prompt: "1930s animation style but suddenly INTERRUPTED by Windows blue screen color #0078D4, vintage error message font saying 'HAPPINESS_NOT_FOUND - Press any key to accept your fate', sad face emoticon made of parentheses and colon but with TOO MANY teeth, film grain over blue, retro-futuristic error aesthetic, propaganda poster frame suddenly corrupted, cheerful narrator voice visualized as waveform that flatlines"
  },
  {
    id: 8,
    title: "Kool-Aid Micro$",
    description: "Micro$ crashes through the wall.",
    prompt: "1930s rubber hose style, anthropomorphic CRT monitor character bursting through plaster wall with brick pattern, debris flying, 'OH YEAH!' expression but wrong somehow, holding giant orange carrot like baseball bat, family scattering in exaggerated panic, dust clouds in classic cartoon spirals, black and white with slight motion blur effect, Fleischer Studios chaos, film grain"
  },
  {
    id: 9,
    title: "The Choice",
    description: "Two identical voting boxes.",
    prompt: "1930s voting booth scene, two ballot boxes both with glowing Windows logos, citizen character sweating nervously holding pencil, both boxes labeled 'FREEDOM' and 'ALSO FREEDOM', third box for 'Linux' being welded shut by Clippy character in background, heavy shadows, propaganda poster composition, black and white, vintage animation style, Orwellian but cheerful"
  },
  {
    id: 10,
    title: "Defender Attack Mode",
    description: "Defender turns on the user.",
    prompt: "1930s style, friendly shield mascot character (Microsoft Defender) with face suddenly revealing teeth, red eyes, attacking user who tried to write 'Linux' on paper, shield morphing into cage bars, 'Protecting You From Yourself' banner, vintage cartoon violence but make it propaganda, rubber hose limbs on both characters, film grain, unsettling friendly-to-hostile transition"
  },
  {
    id: 11,
    title: "Update at 3 AM",
    description: "Micro$ wakes you up.",
    prompt: "1930s bedroom scene, anthropomorphic CRT monitor character standing over sleeping user in bed, moonlight through window, clock showing 3:00 AM, Micro$ holding sign 'RESTARTING IN 5 MINUTES', sleeping user has thought bubble showing unsaved work, Micro$ whispering with finger to lips 'shhh', black and white, film noir lighting but cartoon style, creepy intimacy, film grain"
  },
  {
    id: 12,
    title: "The Loading Circle Forever",
    description: "Infinite loading eyes.",
    prompt: "Extreme close-up of 1930s cartoon eyes but replaced with Windows loading circle animation, spinning forever, reflected in multiple windows of suburban houses, infinite regression, black and white but loading circle slightly glowing, film grain, vintage animation meets digital purgatory, uncanny valley, hypnotic horror"
  },
  {
    id: 13,
    title: "Coke Pilot - The Hyped Aviator",
    description: "Always on, always hyped.",
    prompt: "1930s rubber hose animation style, anthropomorphic soda can character wearing leather pilot helmet with goggles, aviator scarf flowing, caffeine-shaking hands holding control stick, wide bloodshot eyes with pupils dilated, 'ALWAYS ON' tattoo on metal arm, crashing through user's desktop icons, energy lines radiating from body, black and white but with slight motion blur trails, vintage cartoon chaos, Fleischer Studios on speed, film grain, propaganda poster for 'Productivity'"
  },
  {
    id: 14,
    title: "Edgy Grim - The Reaper Browser",
    description: "The browser that won't die.",
    prompt: "1930s animation style meets gothic horror, anthropomorphic web browser window with skull face, hooded cloak made of bookmarks and tabs, scythe shaped like a cursor arrow, 'Resurrecting...' loading bar at 666%, emerging from grave marked with Internet Explorer headstone, black and white with slight purple tint in shadows, rubber hose limbs but skeletal, vintage cartoon meets Hammer Horror, film grain, unsettling cheerfulness"
  },
  {
    id: 15,
    title: "The Bender Before The Crash",
    description: "Coke Pilot and Edgy Grim at the bar.",
    prompt: "1930s speakeasy scene, Coke Pilot chugging espresso from oil drum, Edgy Grim smoking 'data packets' in pipe, both leaning over bar counter, speech bubbles showing binary code and error messages, eyes spinning, clock melting Dalí-style in background, 'Performance Mode' neon sign flickering, black and white with double exposure effect, vintage cartoon debauchery, film grain, feberdröm aesthetic"
  },
  {
    id: 16,
    title: "The Crash",
    description: "A beautiful disaster.",
    prompt: "1930s animation style, Coke Pilot and Edgy Grim falling from sky in spiraling death dive, holding hands screaming laughing crying, desktop icons scattering like birds, 'NOT RESPONDING' banner trailing behind them like advertisement plane, impact crater shaped like Windows logo, black and white with speed lines, vintage cartoon violence, Fleischer Studios slapstick, film grain, beautiful disaster"
  },
  {
    id: 17,
    title: "The Island Not Found",
    description: "Bill Gates cameo.",
    prompt: "1930s animation style, mysterious island in background with palm trees shaped like error symbols, silhouette of man in turtleneck on yacht labeled 'FOUNDATION', foreground shows Micro$ character looking nervous, 'NOT FOUND' stamp over island, black and white, vintage cartoon conspiracy, film grain, subtle satire, feberdröm aesthetic"
  },
  {
    id: 18,
    title: "The Unlisted Archives",
    description: "Hiding the files.",
    prompt: "1930s rubber hose animation style, gothic library with endless filing cabinets, silhouette of man in turtleneck and glasses hurriedly stuffing papers into briefcase labeled 'PHILANTHROPY', papers escaping showing 'FLIGHT_LOG_2002.pdf' and 'ISLAND_VISITOR_LIST.pdf', background window shows island sinking into ocean with palm trees waving goodbye, Micro$ character in foreground blocking view with 'NOTHING TO SEE HERE' banner, black and white with dramatic shadows, film noir lighting, vintage cartoon conspiracy, Watergate meets Steamboat Willie, film grain, feberdröm aesthetic, subtle horror"
  },
  {
    id: 19,
    title: "Eppie Island Submerges",
    description: "The island sinks.",
    prompt: "1930s animation style, tropical island with geometric architecture slowly sinking into dark waters, 'EPPIE' sign tilting, figures in orange jumpsuits waving from beach, foreground shows Micro$ and Bill silhouette in lifeboat labeled 'TASK FORCE', both wearing 'WE CARE' sashes, one briefcase floating open with papers labeled 'EPSTEIN_VISITOR_LOGS' visible, black and white but water is impossibly dark, vintage cartoon disaster movie, Titanic meets Mickey Mouse, film grain, beautiful horror, the banality of evil in rubber hose style"
  },
  {
    id: 20,
    title: "The Recycle Bin of History",
    description: "Deleted but never gone.",
    prompt: "1930s animation style, underwater graveyard of deleted files, 'EPPIE_ISLAND_BACKUP' folder growing coral on it, skeletons in business casual vinkar från djupet, Micro$ character as Poseidon with trident made of USB sticks, Bill silhouette as shadow over water surface, black and white but with bioluminescent glow from sunken screens showing 'ACCESS DENIED', vintage cartoon meets Lovecraft, film grain, the deep web made literal, feberdröm aesthetic, beautiful and terrible"
  }
];

export const NEGATIVE_PROMPT = "no color, no modern UI, no realistic textures, no 3D render, no anime, no 2000s flash animation, no clean lines, no happy endings";
