/* Lead Desk demo data. Everything here is fictional: companies, people, emails (example.com), phone numbers (555).
   Drafts and replies are prerecorded text, not live AI output. */
window.DEMO = {
  business: {
    name: "Bluebird Catering Co.",
    address: "100 Example Street, Springfield",
    sender: "Riley Chen",
    email: "hello@bluebird-catering.example.com",
    phone: "(555) 010-0100"
  },
  /* Fake menu used by the fake calculator. Made-up prices for the demo only. */
  menus: [
    { id: "boxed", name: "Boxed lunch", perGuest: 16, note: "Sandwich, salad, cookie" },
    { id: "buffet", name: "Hot buffet", perGuest: 26, note: "Two mains, three sides" },
    { id: "bbq", name: "Crew BBQ, grill on site", perGuest: 30, note: "For teams of 30 to 80" }
  ],
  approvals: [
    {
      id: "a1", org: "Northwind Roofing", contact: "Dana Whitfield", role: "Office Manager",
      email: "dana.whitfield@northwind-roofing.example.com", segment: "Local employers, team events",
      confidence: "Verified", fit: 86, kind: "lead",
      subject: "Food for the 20-year crew picnic",
      body: [
        "Hi Dana,",
        "Congrats on [[20 years in business|1]]. I saw you are planning [[a crew picnic in June|1]].",
        "We cater outdoor lunches for teams of 30 to 80, with a [[grill-on-site BBQ menu|2]] built for crews coming off a job site.",
        "Would a short call next week help? I can send a sample menu first.",
        "Thanks,\nRiley Chen\nBluebird Catering Co."
      ],
      sources: [
        { n: 1, where: "northwind-roofing.example.com/news/20-years", quote: "This June we turn 20, and the whole crew is getting together for a picnic to celebrate." },
        { n: 2, where: "Business profile > offers > Crew BBQ", quote: "Grill-on-site BBQ for teams of 30 to 80." }
      ],
      angle: "A dated team event at a local employer matches the Crew BBQ offer.",
      trail: [["Scout", "Found the company in a local business directory"], ["Sourcer", "Found the contact on the team page"], ["Verifier", "Name and email both printed on the fetched page"], ["Signal", "Dated news item: 20th anniversary picnic"], ["Drafter", "Wrote a 92-word draft from the profile"], ["Quality gate", "All checks passed"]]
    },
    {
      id: "a2", org: "Acme Dental", contact: "Morgan Ellis", role: "Practice Administrator",
      email: "morgan.ellis@acme-dental.example.com", segment: "Healthcare offices",
      confidence: "Verified", fit: 78, kind: "lead",
      subject: "Lunch for the new hygienist team",
      body: [
        "Hi Morgan,",
        "I saw Acme Dental is [[hiring four new hygienists|1]]. Congrats on the growth.",
        "A lot of practices welcome new staff with a team lunch. We do [[boxed lunches for groups of 10 or more|2]], delivered between patients.",
        "Happy to send a sample menu if that would help.",
        "Thanks,\nRiley Chen\nBluebird Catering Co."
      ],
      sources: [
        { n: 1, where: "acme-dental.example.com/careers", quote: "We are hiring four registered dental hygienists to join our growing team." },
        { n: 2, where: "Business profile > offers > Boxed lunch", quote: "Boxed lunches for groups of 10 or more." }
      ],
      angle: "New hires at a growing office suggest a welcome lunch.",
      trail: [["Scout", "Found the practice through a hiring signal"], ["Sourcer", "Found the contact on the About page"], ["Verifier", "Name and email both printed on the fetched page"], ["Signal", "Job post dated this month"], ["Drafter", "Wrote an 81-word draft"], ["Quality gate", "All checks passed"]]
    },
    {
      id: "a3", org: "Contoso Credit Union", contact: "Jordan Pike", role: "Events Coordinator",
      email: "jordan.pike@contoso-cu.example.com", segment: "Member organizations",
      confidence: "Verified", fit: 82, kind: "lead",
      subject: "Catering for the new branch opening",
      body: [
        "Hi Jordan,",
        "I read that Contoso is [[opening a second branch in March|1]].",
        "We cater [[grand opening events with a hot buffet|2]], and we can work around your member hours.",
        "Would it help if I sent a sample menu and a rough quote?",
        "Thanks,\nRiley Chen\nBluebird Catering Co."
      ],
      sources: [
        { n: 1, where: "contoso-cu.example.com/news", quote: "Our second branch opens this March on Elm Avenue." },
        { n: 2, where: "Business profile > offers > Hot buffet", quote: "Hot buffet for openings, parties and member events." }
      ],
      angle: "A dated grand opening needs food for members and staff.",
      trail: [["Scout", "Found the opening in local news"], ["Sourcer", "Found the contact on the staff page"], ["Verifier", "Name and email both printed on the fetched page"], ["Signal", "Dated news item: branch opening"], ["Drafter", "Wrote a 74-word draft"], ["Quality gate", "All checks passed"]]
    },
    {
      id: "a4", org: "Phone call: Sam Ortega", contact: "Sam Ortega", role: "Caller",
      email: "sam.ortega@example.com", segment: "Inbound inquiry",
      confidence: "From the call", fit: 70, kind: "intake",
      subject: "Your question about a vegan menu",
      body: [
        "Hi Sam,",
        "Thanks for calling Bluebird. Yes, we have a [[vegan option on every menu|1]].",
        "For 25 guests on a hot buffet, the estimate is [[$650 before tax and delivery|2]]. Our team confirms the final price.",
        "Would you like us to hold Friday the 13th for you?",
        "Thanks,\nRiley Chen\nBluebird Catering Co."
      ],
      sources: [
        { n: 1, where: "Business profile > facts > dietary", quote: "Every menu has a vegan and a gluten-free option." },
        { n: 2, where: "Demo calculator", quote: "Hot buffet, 25 guests x $26 = $650." }
      ],
      angle: "Inbound call. The AI phone agent logged the ask, and the reply uses only the business's own facts.",
      trail: [["Phone agent", "Answered the call and wrote a summary"], ["Intake", "Rated the inquiry Warm"], ["Calculator", "Estimated the price"], ["Drafter", "Wrote the reply draft"], ["Quality gate", "All checks passed"]]
    }
  ],
  ready: [
    { org: "Adventure Works", contact: "Chris Navarro", email: "chris.navarro@adventure-works.example.com", subject: "Spring retreat lunch", by: "Riley Chen" },
    { org: "Riverbend Library Friends", contact: "Pat Lindqvist", email: "pat@riverbend-friends.example.com", subject: "Food for the fundraiser", by: "Riley Chen" }
  ],
  pipeline: [
    ["New", [["Litware Labs", "Office move"], ["Tailspin Toys", "Toy drive volunteers"], ["Wide World Importers", "Client lunch"]], 9],
    ["Verified", [["Fabrikam Logistics", "Holiday party"], ["Woodgrove Bank", "Staff day"]], 6],
    ["Awaiting approval", [], 0],
    ["Sent", [["Adventure Works", "Spring retreat"], ["Riverbend Library Friends", "Fundraiser"]], 11],
    ["Replied", [["Proseware Inc.", "Asked for a quote"]], 3]
  ],
  calls: [
    ["09:12", "Jordan Pike", "(555) 010-4471", "Lunch for 30 on a Friday", "good", "Hot", "Reply drafted"],
    ["Yesterday", "Sam Ortega", "(555) 010-2290", "Asked about a vegan menu", "warn", "Warm", "In Approvals"],
    ["Mon", "Unknown caller", "(555) 010-9034", "Wrong number", "mute", "Skip", "Logged"]
  ],
  signals: [
    ["Contoso Credit Union", "Opening a second branch in March", "contoso-cu.example.com/news", "Grand opening lunch", "New", 86],
    ["Acme Dental", "Hiring 4 new hygienists", "acme-dental.example.com/careers", "Welcome lunch for new staff", "New", 78],
    ["Fabrikam Logistics", "Named a top local workplace", "springfield-news.example.com/biz", "Staff celebration", "New", 74],
    ["Litware Labs", "Moving into a larger office", "litware.example.com/blog", "Office warming party", "Follow-up", 69],
    ["Tailspin Toys", "Annual toy drive in December", "tailspintoys.example.com/events", "Volunteer lunch", "Follow-up", 61]
  ],
  dropped: [
    ["Wide World Importers", "Story about pay and salaries", "No reason to pitch"],
    ["Proseware Inc.", "Event already happened", "Out of date"],
    ["Adventure Works", "Gift the company gave to a charity", "Not a reason to pitch"]
  ],
  inquiries: [
    {
      id: "q1", label: "Email: lunch for 30 on Friday the 13th",
      text: "Hi, we need lunch for about 30 people at our office on Friday, November 13. Something hot if possible. What would that cost? Thanks, Alex (alex.moreno@fabrikam.example.com)",
      guests: 30, menu: "buffet", date: "Fri Nov 13", rating: ["good", "Worth it"],
      reply: ["Hi Alex,", "Thanks for reaching out. Friday, November 13 is open on our calendar[[3]].", "For 30 guests, our hot buffet has two mains and three sides[[1]]. The estimate is below. Our team confirms the final price.", "Every menu has a vegan and a gluten-free option[[2]]. Would you like us to hold the date?", "Thanks,\nRiley Chen\nBluebird Catering Co."]
    },
    {
      id: "q2", label: "Call summary: crew BBQ for 60",
      text: "Phone agent summary: Caller Jamie from Northwind Roofing, (555) 010-3381. Wants a BBQ for 60 crew members at their yard in June. Asked if we can grill on site.",
      guests: 60, menu: "bbq", date: "June (date not set)", rating: ["good", "Worth it"],
      reply: ["Hi Jamie,", "Thanks for calling. Yes, we grill on site for teams of 30 to 80[[1]].", "For 60 guests the estimate is below. Our team confirms the final price.", "We need 7 days' notice for groups over 50[[4]]. Once you pick a June date, we can check it and hold it.", "Thanks,\nRiley Chen\nBluebird Catering Co."]
    },
    {
      id: "q3", label: "Email: boxed lunch for a 12-person board meeting",
      text: "Do you deliver boxed lunches? Board meeting for 12, next Tuesday, two of us are vegan. - Casey, Acme Dental (casey@acme-dental.example.com)",
      guests: 12, menu: "boxed", date: "Next Tuesday", rating: ["warn", "Needs info"],
      reply: ["Hi Casey,", "Yes, we deliver boxed lunches for groups of 10 or more[[1]].", "Every menu has a vegan option[[2]], so your two vegan guests are covered.", "The estimate for 12 is below. Our team confirms the final price. Could you send the delivery address so we can confirm the delivery fee?", "Thanks,\nRiley Chen\nBluebird Catering Co."]
    }
  ],
  replySources: {
    1: ["Business profile > offers", "The menu and group size for this offer."],
    2: ["Business profile > facts > dietary", "Every menu has a vegan and a gluten-free option."],
    3: ["Calendar", "No event booked on this date."],
    4: ["Business profile > rules", "Seven days' notice for groups over 50."]
  },
  calendar: { year: 2026, month: 10, today: null, events: [[6, "Office lunch, 25", "booked"], [12, "Board lunch, 12", "booked"], [13, "Hold: Fabrikam, 30", "proposal"], [19, "Library fundraiser", "booked"], [20, "Hold: Contoso tasting", "proposal"], [27, "Team BBQ, 45", "booked"]] },
  analytics: {
    weeks: ["Wk 1", "Wk 2", "Wk 3", "Wk 4"],
    found: [6, 8, 12, 7], approved: [2, 3, 5, 4], replies: [0, 1, 1, 1],
    sources: [["Public web pages", 14], ["Local news signals", 8], ["Owner's own list", 6], ["Contact database", 5]]
  }
};
