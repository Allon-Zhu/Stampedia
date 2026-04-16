window.__STAMPEDIA_CONFIG__ = Object.assign(
  {
    openAiApiKey: "",
    model: "gpt-5.4-mini"
  },
  window.__STAMPEDIA_CONFIG__ || {}
);

window.StampediaReviewData = {
  storageKey: "stampedia.review.demo.state.v1",
  maxReviewEntries: 5,
  structuredQuestionLimit: 4,
  userProfile: {
    firstName: "Jamie",
    fullName: "Jamie L.",
    travelStyle: "blended business and city-weekend traveler",
    historySummary: [
      "Jamie often mentions reliable Wi-Fi when a stay doubles as a work base.",
      "Jamie repeatedly calls out quiet rooms, smooth arrivals, breakfast convenience, and whether the property feels true to the listing.",
      "Jamie cares about value and cleanliness, with parking only becoming important on drive-heavy stays."
    ],
    topicWeights: {
      wifi: 95,
      noise: 92,
      checkin: 88,
      breakfast: 84,
      listing_accuracy: 82,
      value: 79,
      cleanliness: 74,
      location: 68,
      service: 63,
      parking: 46
    }
  },
  topicLabels: {
    listing_accuracy: "listing accuracy",
    wifi: "Wi-Fi reliability",
    location: "location convenience",
    value: "value",
    checkin: "check-in",
    breakfast: "breakfast",
    parking: "parking",
    noise: "nighttime quiet",
    cleanliness: "cleanliness",
    service: "service",
    additional: "anything else"
  },
  fallbackTopicOptions: {
    listing_accuracy: [
      "Yes, the room and amenities matched the listing.",
      "No, some details felt outdated or missing."
    ],
    wifi: [
      "The Wi-Fi was strong enough for work and streaming.",
      "The Wi-Fi was spotty or slower than expected."
    ],
    location: [
      "Getting around felt easy and convenient.",
      "Getting around took more effort than the listing suggested."
    ],
    value: [
      "The stay felt worth the price.",
      "The price felt high for what was delivered."
    ],
    checkin: [
      "Check-in was quick and clear.",
      "Check-in was confusing or slower than expected."
    ],
    breakfast: [
      "Breakfast was easy, useful, and worth it.",
      "Breakfast felt limited, crowded, or not worth the effort."
    ],
    parking: [
      "Parking was easy and transparent.",
      "Parking had friction, extra fees, or surprises."
    ],
    noise: [
      "The room stayed quiet overnight.",
      "Noise made it harder to rest."
    ],
    cleanliness: [
      "The room and bathroom felt clean on arrival.",
      "Cleanliness was inconsistent or below expectation."
    ],
    service: [
      "Staff was responsive and helpful.",
      "Service felt slow, uneven, or hard to reach."
    ],
    additional: []
  },
  verifiedStays: [
    {
      id: "stay-broomfield-0411",
      propertyId: "db38b19b897dbece3e34919c662b3fd66d23b615395d11fb69264dd3a9b17723",
      displayName: "Flatiron Peaks Resort",
      city: "Broomfield",
      region: "Colorado",
      country: "United States",
      theme: "stay-theme-broomfield",
      checkedOutOn: "Apr 11",
      nights: 3,
      passportLabel: "Broomfield",
      starRating: 4.0,
      expediaScore: 9.2,
      reviewCount: 1006,
      latestReview: "2026-02-04",
      daysSinceLatestReview: 2,
      propertySummary: "Suburban resort with restaurants, pools, spa access, free parking, and strong business-travel utility.",
      amenityCallouts: ["pool", "spa", "free parking", "breakfast available", "Wi-Fi"],
      questionCandidates: [
        { topic: "listing_accuracy", score: 87.04, daysSinceLastSignal: 550, recentSignalShare: 0.0, staleness: 1.0, question: "Did the room and amenities match what the listing promised?" },
        { topic: "wifi", score: 73.29, daysSinceLastSignal: 302, recentSignalShare: 0.005, staleness: 0.8274, question: "How reliable was the Wi-Fi for browsing, streaming, or work?" },
        { topic: "location", score: 65.03, daysSinceLastSignal: 15, recentSignalShare: 0.135, staleness: 0.0411, question: "How convenient and walkable did the location feel during your stay?" },
        { topic: "breakfast", score: 57.74, daysSinceLastSignal: 82, recentSignalShare: 0.03, staleness: 0.2247, question: "If you used breakfast, how good and convenient was it?" },
        { topic: "checkin", score: 56.06, daysSinceLastSignal: 27, recentSignalShare: 0.035, staleness: 0.074, question: "Was check-in smooth and clear when you arrived?" },
        { topic: "value", score: 52.1, daysSinceLastSignal: 48, recentSignalShare: 0.04, staleness: 0.1315, question: "Did the stay feel like good value for the price you paid?" }
      ]
    },
    {
      id: "stay-bangkok-0410",
      propertyId: "e52d67a758ce4ad0229aacc97e5dfe89984c384c51a70208f9e0cc65c9cd4676",
      displayName: "Saffron Old Town Hotel",
      city: "Bangkok",
      region: "Old Town",
      country: "Thailand",
      theme: "stay-theme-bangkok",
      checkedOutOn: "Apr 10",
      nights: 2,
      passportLabel: "Bangkok",
      starRating: 3.0,
      expediaScore: 8.8,
      reviewCount: 50,
      latestReview: "2026-01-18",
      daysSinceLatestReview: 19,
      propertySummary: "Compact city-center hotel near Khaosan Road with free parking, Wi-Fi, and a simple arrival flow.",
      amenityCallouts: ["free parking", "24-hour front desk", "breakfast available", "Wi-Fi"],
      questionCandidates: [
        { topic: "value", score: 64.89, daysSinceLastSignal: 673, recentSignalShare: 0.0, staleness: 1.0, question: "Did the stay feel like good value for the price you paid?" },
        { topic: "listing_accuracy", score: 63.66, daysSinceLastSignal: 1072, recentSignalShare: 0.0, staleness: 1.0, question: "Did the room and amenities match what the listing promised?" },
        { topic: "wifi", score: 58.29, daysSinceLastSignal: 1072, recentSignalShare: 0.0, staleness: 1.0, question: "How reliable was the Wi-Fi for browsing, streaming, or work?" },
        { topic: "parking", score: 56.59, daysSinceLastSignal: 1072, recentSignalShare: 0.0, staleness: 1.0, question: "How easy was parking, and were there any extra fees or surprises?" },
        { topic: "checkin", score: 38.61, daysSinceLastSignal: 19, recentSignalShare: 0.0769, staleness: 0.0521, question: "Was check-in smooth and clear when you arrived?" },
        { topic: "breakfast", score: 35.34, daysSinceLastSignal: 19, recentSignalShare: 0.0769, staleness: 0.0521, question: "If you used breakfast, how good and convenient was it?" }
      ]
    },
    {
      id: "stay-monterey-0409",
      propertyId: "fa014137b3ea9af6a90c0a86a1d099e46f7e56d6eb33db1ad1ec4bdac68c3caa",
      displayName: "Harbor Lantern Inn",
      city: "Monterey",
      region: "Cannery Row",
      country: "United States",
      theme: "stay-theme-monterey",
      checkedOutOn: "Apr 09",
      nights: 1,
      passportLabel: "Monterey",
      starRating: 2.5,
      expediaScore: 8.8,
      reviewCount: 728,
      latestReview: "2026-02-05",
      daysSinceLatestReview: 1,
      propertySummary: "Beach-adjacent stay with free breakfast, free parking, and fast access to Cannery Row.",
      amenityCallouts: ["free breakfast", "free parking", "24-hour front desk", "Wi-Fi"],
      questionCandidates: [
        { topic: "listing_accuracy", score: 80.24, daysSinceLastSignal: 1089, recentSignalShare: 0.0, staleness: 1.0, question: "Did the room and amenities match what the listing promised?" },
        { topic: "wifi", score: 73.47, daysSinceLastSignal: 1046, recentSignalShare: 0.0, staleness: 1.0, question: "How reliable was the Wi-Fi for browsing, streaming, or work?" },
        { topic: "checkin", score: 55.9, daysSinceLastSignal: 56, recentSignalShare: 0.0163, staleness: 0.1534, question: "Was check-in smooth and clear when you arrived?" },
        { topic: "value", score: 54.38, daysSinceLastSignal: 104, recentSignalShare: 0.0244, staleness: 0.2849, question: "Did the stay feel like good value for the price you paid?" },
        { topic: "location", score: 48.85, daysSinceLastSignal: 22, recentSignalShare: 0.3171, staleness: 0.0603, question: "How convenient and walkable did the location feel during your stay?" },
        { topic: "breakfast", score: 39.48, daysSinceLastSignal: 1, recentSignalShare: 0.1463, staleness: 0.0027, question: "If you used breakfast, how good and convenient was it?" }
      ]
    },
    {
      id: "stay-san-isidro-0408",
      propertyId: "3b984f3ba8df55b2609a1e33fd694cf8407842e1d833c9b4d993b07fc83a2820",
      displayName: "Lucky's Hotel y Casino",
      city: "San Isidro de El General",
      region: "Puntarenas",
      country: "Costa Rica",
      theme: "stay-theme-costa-rica",
      checkedOutOn: "Apr 08",
      nights: 2,
      passportLabel: "San Isidro",
      starRating: 3.5,
      expediaScore: 8.6,
      reviewCount: 51,
      latestReview: "2025-12-16",
      daysSinceLatestReview: 52,
      propertySummary: "Casino hotel with included breakfast, room service, and a smaller review footprint than the larger city properties.",
      amenityCallouts: ["breakfast included", "room service", "Wi-Fi", "24-hour front desk"],
      questionCandidates: [
        { topic: "checkin", score: 72.72, daysSinceLastSignal: 1072, recentSignalShare: 0.0, staleness: 1.0, question: "Was check-in smooth and clear when you arrived?" },
        { topic: "breakfast", score: 66.57, daysSinceLastSignal: 1058, recentSignalShare: 0.0, staleness: 1.0, question: "If you used breakfast, how good and convenient was it?" },
        { topic: "location", score: 66.03, daysSinceLastSignal: 174, recentSignalShare: 0.1429, staleness: 0.4767, question: "How convenient and walkable did the location feel during your stay?" },
        { topic: "listing_accuracy", score: 63.68, daysSinceLastSignal: 1058, recentSignalShare: 0.0, staleness: 1.0, question: "Did the room and amenities match what the listing promised?" },
        { topic: "wifi", score: 58.31, daysSinceLastSignal: 589, recentSignalShare: 0.0, staleness: 1.0, question: "How reliable was the Wi-Fi for browsing, streaming, or work?" },
        { topic: "noise", score: 58.23, daysSinceLastSignal: 1072, recentSignalShare: 0.0, staleness: 1.0, question: "How quiet was the room at night?" }
      ]
    }
  ]
};
