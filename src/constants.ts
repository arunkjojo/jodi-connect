export const LANGUAGES = [
    { code: 'en', name: 'English', nativeName: 'English', icon: 'E' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', icon: 'മ' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', icon: 'हि' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', icon: 'ಕ' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', icon: 'த' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', icon: 'తె' }
];

export const GRID_BREAKPOINTS = {
    mobile: 'grid-cols-1',
    tablet: 'sm:grid-cols-2',
    desktop: 'md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6'
};

export const TESTIMONIALS = [
    {
        id: 1,
        quote: "Found my soulmate on JodiConnect!",
        author: "@PriyaSharma",
        source: "Instagram Comment Screenshot",
        color: "from-yellow-400 to-orange-400"
    },
    {
        id: 2,
        quote: "Truly the best for matrimonial connections!",
        author: "Rahul G.",
        source: "WhatsApp Chat Screenshot",
        color: "from-cyan-400 to-blue-400"
    },
    {
        id: 3,
        quote: "Amazing platform with genuine profiles!",
        author: "Sneha K.",
        source: "App Store Review",
        color: "from-pink-400 to-purple-400"
    },
    {
        id: 4,
        quote: "Found my perfect match within 2 months!",
        author: "Arjun M.",
        source: "Google Play Review",
        color: "from-green-400 to-teal-400"
    },
    {
        id: 5,
        quote: "Excellent customer service and support!",
        author: "Meera P.",
        source: "Facebook Review",
        color: "from-indigo-400 to-blue-400"
    },
    {
        id: 6,
        quote: "Safe and secure platform for finding life partner!",
        author: "Sameer S.",
        source: "Trustpilot Review",
        color: "from-red-400 to-pink-400"
    },
    {
        id: 7,
        quote: "Great user experience and interface!",
        author: "Kavya R.",
        source: "Play Store Review",
        color: "from-purple-400 to-pink-400"
    },
    {
        id: 8,
        quote: "Highly recommended for serious relationships!",
        author: "Vikram T.",
        source: "App Store Review",
        color: "from-teal-400 to-cyan-400"
    },
    {
        id: 9,
        quote: "Found genuine connections here!",
        author: "Deepika M.",
        source: "Google Review",
        color: "from-orange-400 to-red-400"
    },
    {
        id: 10,
        quote: "Best matrimony app in India!",
        author: "Rajesh K.",
        source: "Trustpilot Review",
        color: "from-blue-400 to-indigo-400"
    },
    {
        id: 11,
        quote: "Smooth and hassle-free experience!",
        author: "Pooja S.",
        source: "Facebook Review",
        color: "from-green-400 to-blue-400"
    },
    {
        id: 12,
        quote: "Perfect platform for finding life partner!",
        author: "Arun V.",
        source: "WhatsApp Review",
        color: "from-pink-400 to-red-400"
    }
];

export const HOW_IT_WORKS_STEPS = [
    {
        number: 1,
        title: "Find Yourself",
        description: "Discover your ideal partner from a pool of curated matches. You'll share your interests and contact preferences directly.",
        icon: "🔍",
        plans: "Rs 600 / Rs 1200"
    },
    {
        number: 2,
        title: "We Help",
        description: "Let our experts assist you until a match is confirmed based on shared interests and preferences.",
        icon: "🤝",
        chargesNow: "Rs 0",
        confirmedMatch: "Rs 2400"
    },
    {
        number: 3,
        title: "Connect & Meet",
        description: "Start meaningful conversations with verified profiles and arrange meetings with our guidance.",
        icon: "💬",
        plans: "Included in all plans"
    },
    {
        number: 4,
        title: "Find Your Jodi",
        description: "Build lasting relationships with compatible matches and find your perfect life partner.",
        icon: "💕",
        plans: "Success guaranteed"
    }
];

export const NAVIGATION_ITEMS = [
    { path: '/dashboard', icon: 'Home', label: 'Home' },
    { path: '/search', icon: 'Search', label: 'Search' },
    { path: '/matches', icon: 'Heart', label: 'Matches' },
    { path: '/settings', icon: 'Settings', label: 'Settings' }
];

export const FILTER_OPTIONS = {
    dietary: ['Vegetarian', 'Non-Vegetarian', 'Eggetarian'],
    smoking: ['Non-Smoker', 'Occasional', 'Smoker'],
    drinking: ['Non-Drinker', 'Social Drinker', 'Drinker'],
    relationship: ['Marriage', 'Long-Term Relationship', 'Casual Dating', 'Friendship'],
    interests: ['Reading', 'Travel', 'Movies', 'Music', 'Foodie', 'Sports', 'Art', 'Cooking', 'Yoga', 'Meditation', 'Tech & Gadgets', 'Outdoors']
};

export const STATES_AND_DISTRICTS = {
    'Karnataka': ['Bengaluru', 'Mysuru', 'Mangaluru', 'Hubli', 'Belagavi'],
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'],
    'Delhi': ['New Delhi', 'Central Delhi', 'South Delhi', 'North Delhi', 'East Delhi'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar']
};

export const RELIGIONS = [
    'Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Other'
];

export const CASTES = [
    'Brahmin', 'Kshatriya', 'Vaishya', 'Shudra', 'Other'
];

export const MARITAL_STATUS = [
    'Never Married', 'Divorced', 'Widowed', 'Separated'
  ];