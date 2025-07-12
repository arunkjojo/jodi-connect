// Location data structure
// Replace this with your actual location data from locations.js/locations.json

export const locationData = {
  states: [
    {
      id: 1,
      name: "Karnataka",
      localName: "ಕರ್ನಾಟಕ",
      available: true,
      districts: [
        {
          id: 1,
          name: "Bengaluru Urban",
          localName: "ಬೆಂಗಳೂರು ನಗರ",
          available: true,
          stateId: 1,
        },
        {
          id: 2,
          name: "Mysuru",
          localName: "ಮೈಸೂರು",
          available: true,
          stateId: 1,
        },
        {
          id: 3,
          name: "Mangaluru",
          localName: "ಮಂಗಳೂರು",
          available: true,
          stateId: 1,
        },
      ],
    },
    {
      id: 2,
      name: "Maharashtra",
      localName: "महाराष्ट्र",
      available: true,
      districts: [
        {
          id: 4,
          name: "Mumbai",
          localName: "मुंबई",
          available: true,
          stateId: 2,
        },
        {
          id: 5,
          name: "Pune",
          localName: "पुणे",
          available: true,
          stateId: 2,
        },
        {
          id: 6,
          name: "Nagpur",
          localName: "नागपूर",
          available: true,
          stateId: 2,
        },
      ],
    },
    {
      id: 3,
      name: "Tamil Nadu",
      localName: "தமிழ் நாடு",
      available: true,
      districts: [
        {
          id: 7,
          name: "Chennai",
          localName: "சென்னை",
          available: true,
          stateId: 3,
        },
        {
          id: 8,
          name: "Coimbatore",
          localName: "கோயம்புத்தூர்",
          available: true,
          stateId: 3,
        },
        {
          id: 9,
          name: "Madurai",
          localName: "மதுரை",
          available: true,
          stateId: 3,
        },
      ],
    },
    {
      id: 4,
      name: "Kerala",
      localName: "കേരളം",
      available: true,
      districts: [
        {
          id: 10,
          name: "Thiruvananthapuram",
          localName: "തിരുവനന്തപുരം",
          available: true,
          stateId: 4,
        },
        {
          id: 11,
          name: "Kochi",
          localName: "കൊച്ചി",
          available: true,
          stateId: 4,
        },
        {
          id: 12,
          name: "Kozhikode",
          localName: "കോഴിക്കോട്",
          available: true,
          stateId: 4,
        },
      ],
    },
    {
      id: 5,
      name: "Andhra Pradesh",
      localName: "ఆంధ్ర ప్రదేశ్",
      available: false,
      districts: [
        {
          id: 13,
          name: "Anantapur",
          localName: "అనంతపురం",
          available: false,
          stateId: 5,
        },
      ],
    },
  ],
};

// If you have a separate locations.json file, you can import it like this:
// import locationDataJson from './locations.json';
// export const locationData = locationDataJson;