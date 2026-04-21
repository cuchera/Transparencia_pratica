export interface Politician {
  id: string;
  name: string;
  party: string;
  state: string;
  position: string;
  photo: string;
  score: number;
  productivity: number;
  expenses: number;
  costPerProductivity: number;
  yearsInOffice: number;
  proposalsSubmitted: number;
  proposalsApproved: number;
  attendance: number;
  career: CareerEvent[];
  monthlyExpenses: ExpenseData[];
  monthlyProductivity: ProductivityData[];
}

export interface CareerEvent {
  year: number;
  position: string;
  location: string;
}

export interface ExpenseData {
  month: string;
  amount: number;
}

export interface ProductivityData {
  month: string;
  proposals: number;
}

export const mockPoliticians: Politician[] = [
  {
    id: "1",
    name: "Maria Santos",
    party: "Democratic Party",
    state: "California",
    position: "Senator",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
    score: 87,
    productivity: 145,
    expenses: 450000,
    costPerProductivity: 3103,
    yearsInOffice: 6,
    proposalsSubmitted: 145,
    proposalsApproved: 89,
    attendance: 94,
    career: [
      { year: 2020, position: "Senator", location: "California" },
      { year: 2016, position: "State Representative", location: "California" },
      { year: 2012, position: "City Council", location: "San Francisco, CA" },
    ],
    monthlyExpenses: [
      { month: "Jan", amount: 35000 },
      { month: "Feb", amount: 38000 },
      { month: "Mar", amount: 42000 },
      { month: "Apr", amount: 37000 },
      { month: "May", amount: 40000 },
      { month: "Jun", amount: 36000 },
      { month: "Jul", amount: 39000 },
      { month: "Aug", amount: 41000 },
      { month: "Sep", amount: 38000 },
      { month: "Oct", amount: 43000 },
      { month: "Nov", amount: 37000 },
      { month: "Dec", amount: 44000 },
    ],
    monthlyProductivity: [
      { month: "Jan", proposals: 12 },
      { month: "Feb", proposals: 10 },
      { month: "Mar", proposals: 15 },
      { month: "Apr", proposals: 11 },
      { month: "May", proposals: 14 },
      { month: "Jun", proposals: 9 },
      { month: "Jul", proposals: 13 },
      { month: "Aug", proposals: 12 },
      { month: "Sep", proposals: 11 },
      { month: "Oct", proposals: 16 },
      { month: "Nov", proposals: 10 },
      { month: "Dec", proposals: 12 },
    ],
  },
  {
    id: "2",
    name: "John Anderson",
    party: "Republican Party",
    state: "Texas",
    position: "Representative",
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400",
    score: 72,
    productivity: 98,
    expenses: 380000,
    costPerProductivity: 3878,
    yearsInOffice: 4,
    proposalsSubmitted: 98,
    proposalsApproved: 52,
    attendance: 88,
    career: [
      { year: 2022, position: "Representative", location: "Texas" },
      { year: 2018, position: "State Senator", location: "Texas" },
      { year: 2014, position: "Mayor", location: "Austin, TX" },
    ],
    monthlyExpenses: [
      { month: "Jan", amount: 30000 },
      { month: "Feb", amount: 32000 },
      { month: "Mar", amount: 35000 },
      { month: "Apr", amount: 31000 },
      { month: "May", amount: 33000 },
      { month: "Jun", amount: 29000 },
      { month: "Jul", amount: 34000 },
      { month: "Aug", amount: 36000 },
      { month: "Sep", amount: 32000 },
      { month: "Oct", amount: 38000 },
      { month: "Nov", amount: 31000 },
      { month: "Dec", amount: 39000 },
    ],
    monthlyProductivity: [
      { month: "Jan", proposals: 8 },
      { month: "Feb", proposals: 7 },
      { month: "Mar", proposals: 9 },
      { month: "Apr", proposals: 8 },
      { month: "May", proposals: 10 },
      { month: "Jun", proposals: 6 },
      { month: "Jul", proposals: 9 },
      { month: "Aug", proposals: 8 },
      { month: "Sep", proposals: 7 },
      { month: "Oct", proposals: 11 },
      { month: "Nov", proposals: 7 },
      { month: "Dec", proposals: 8 },
    ],
  },
  {
    id: "3",
    name: "Robert Chen",
    party: "Democratic Party",
    state: "New York",
    position: "Senator",
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400",
    score: 91,
    productivity: 167,
    expenses: 520000,
    costPerProductivity: 3114,
    yearsInOffice: 8,
    proposalsSubmitted: 167,
    proposalsApproved: 112,
    attendance: 96,
    career: [
      { year: 2018, position: "Senator", location: "New York" },
      { year: 2012, position: "State Representative", location: "New York" },
      { year: 2008, position: "District Attorney", location: "New York, NY" },
    ],
    monthlyExpenses: [
      { month: "Jan", amount: 42000 },
      { month: "Feb", amount: 44000 },
      { month: "Mar", amount: 48000 },
      { month: "Apr", amount: 43000 },
      { month: "May", amount: 46000 },
      { month: "Jun", amount: 41000 },
      { month: "Jul", amount: 45000 },
      { month: "Aug", amount: 47000 },
      { month: "Sep", amount: 44000 },
      { month: "Oct", amount: 49000 },
      { month: "Nov", amount: 42000 },
      { month: "Dec", amount: 49000 },
    ],
    monthlyProductivity: [
      { month: "Jan", proposals: 14 },
      { month: "Feb", proposals: 13 },
      { month: "Mar", proposals: 16 },
      { month: "Apr", proposals: 13 },
      { month: "May", proposals: 15 },
      { month: "Jun", proposals: 12 },
      { month: "Jul", proposals: 14 },
      { month: "Aug", proposals: 15 },
      { month: "Sep", proposals: 13 },
      { month: "Oct", proposals: 17 },
      { month: "Nov", proposals: 12 },
      { month: "Dec", proposals: 13 },
    ],
  },
  {
    id: "4",
    name: "Lisa Rodriguez",
    party: "Democratic Party",
    state: "Florida",
    position: "Representative",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
    score: 78,
    productivity: 112,
    expenses: 410000,
    costPerProductivity: 3661,
    yearsInOffice: 5,
    proposalsSubmitted: 112,
    proposalsApproved: 68,
    attendance: 90,
    career: [
      { year: 2021, position: "Representative", location: "Florida" },
      { year: 2017, position: "State Senator", location: "Florida" },
      { year: 2013, position: "County Commissioner", location: "Miami-Dade, FL" },
    ],
    monthlyExpenses: [
      { month: "Jan", amount: 33000 },
      { month: "Feb", amount: 35000 },
      { month: "Mar", amount: 38000 },
      { month: "Apr", amount: 34000 },
      { month: "May", amount: 36000 },
      { month: "Jun", amount: 32000 },
      { month: "Jul", amount: 37000 },
      { month: "Aug", amount: 39000 },
      { month: "Sep", amount: 35000 },
      { month: "Oct", amount: 41000 },
      { month: "Nov", amount: 34000 },
      { month: "Dec", amount: 42000 },
    ],
    monthlyProductivity: [
      { month: "Jan", proposals: 9 },
      { month: "Feb", proposals: 8 },
      { month: "Mar", proposals: 11 },
      { month: "Apr", proposals: 9 },
      { month: "May", proposals: 10 },
      { month: "Jun", proposals: 7 },
      { month: "Jul", proposals: 10 },
      { month: "Aug", proposals: 9 },
      { month: "Sep", proposals: 8 },
      { month: "Oct", proposals: 12 },
      { month: "Nov", proposals: 9 },
      { month: "Dec", proposals: 10 },
    ],
  },
  {
    id: "5",
    name: "David Miller",
    party: "Republican Party",
    state: "Ohio",
    position: "Senator",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    score: 65,
    productivity: 89,
    expenses: 470000,
    costPerProductivity: 5281,
    yearsInOffice: 7,
    proposalsSubmitted: 89,
    proposalsApproved: 41,
    attendance: 82,
    career: [
      { year: 2019, position: "Senator", location: "Ohio" },
      { year: 2013, position: "State Representative", location: "Ohio" },
      { year: 2009, position: "City Councilor", location: "Columbus, OH" },
    ],
    monthlyExpenses: [
      { month: "Jan", amount: 38000 },
      { month: "Feb", amount: 40000 },
      { month: "Mar", amount: 43000 },
      { month: "Apr", amount: 39000 },
      { month: "May", amount: 41000 },
      { month: "Jun", amount: 37000 },
      { month: "Jul", amount: 42000 },
      { month: "Aug", amount: 44000 },
      { month: "Sep", amount: 40000 },
      { month: "Oct", amount: 46000 },
      { month: "Nov", amount: 39000 },
      { month: "Dec", amount: 47000 },
    ],
    monthlyProductivity: [
      { month: "Jan", proposals: 7 },
      { month: "Feb", proposals: 6 },
      { month: "Mar", proposals: 8 },
      { month: "Apr", proposals: 7 },
      { month: "May", proposals: 9 },
      { month: "Jun", proposals: 5 },
      { month: "Jul", proposals: 8 },
      { month: "Aug", proposals: 7 },
      { month: "Sep", proposals: 6 },
      { month: "Oct", proposals: 10 },
      { month: "Nov", proposals: 6 },
      { month: "Dec", proposals: 10 },
    ],
  },
  {
    id: "6",
    name: "Jennifer Park",
    party: "Democratic Party",
    state: "Washington",
    position: "Representative",
    photo: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400",
    score: 83,
    productivity: 128,
    expenses: 395000,
    costPerProductivity: 3086,
    yearsInOffice: 3,
    proposalsSubmitted: 128,
    proposalsApproved: 79,
    attendance: 92,
    career: [
      { year: 2023, position: "Representative", location: "Washington" },
      { year: 2020, position: "State Senator", location: "Washington" },
      { year: 2016, position: "School Board Member", location: "Seattle, WA" },
    ],
    monthlyExpenses: [
      { month: "Jan", amount: 31000 },
      { month: "Feb", amount: 33000 },
      { month: "Mar", amount: 36000 },
      { month: "Apr", amount: 32000 },
      { month: "May", amount: 34000 },
      { month: "Jun", amount: 30000 },
      { month: "Jul", amount: 35000 },
      { month: "Aug", amount: 37000 },
      { month: "Sep", amount: 33000 },
      { month: "Oct", amount: 39000 },
      { month: "Nov", amount: 32000 },
      { month: "Dec", amount: 40000 },
    ],
    monthlyProductivity: [
      { month: "Jan", proposals: 11 },
      { month: "Feb", proposals: 10 },
      { month: "Mar", proposals: 12 },
      { month: "Apr", proposals: 10 },
      { month: "May", proposals: 11 },
      { month: "Jun", proposals: 9 },
      { month: "Jul", proposals: 11 },
      { month: "Aug", proposals: 10 },
      { month: "Sep", proposals: 10 },
      { month: "Oct", proposals: 13 },
      { month: "Nov", proposals: 10 },
      { month: "Dec", proposals: 11 },
    ],
  },
];

export const states = [
  "All States",
  "California",
  "Texas",
  "Florida",
  "New York",
  "Ohio",
  "Washington",
];

export const parties = [
  "All Parties",
  "Democratic Party",
  "Republican Party",
  "Independent",
];

export const positions = ["All Positions", "Senator", "Representative"];

export const years = ["2026", "2025", "2024", "2023", "2022", "2021"];
