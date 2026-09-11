# Remix of Remix of Lexie AI Legal

Role: You are a Senior Full-Stack Developer and UI/UX Designer specializing in LegalTech.

Task: Build a unified, AI-powered legal practice management application called "Lexie". The goal is to eliminate the need for lawyers to use multiple disjointed resources (DCMS website, separate AI tools, physical registers, etc.).

Tech Stack: React (Next.js), Tailwind CSS, Shadcn UI (for a clean, professional look), and an AI integration (mock the API calls if necessary).



Core Vision: A user-friendly dashboard that handles the entire lifecycle of a case: from checking the causelist to arguing in court and filing in the registry.



---



1. Dashboard & Navigation



Create a sidebar navigation with the following tabs:



· Live Causelist (The "DCMS Killer" Feature)

· Case Vault (Saving & Tracking)

· AI Research & Verification

· Drafting & Registry

· Commentary & Resources



---



2. Feature Specifications (Based on User Inputs)



Tab A: Live Causelist (Solving DCMS Issues)



The current DCMS system has severe lag and UI issues. Build a superior alternative:



· Unified Interface: Ensure the UI looks identical on mobile and desktop (solving Issue #4).

· Smart Refresh: Implement a WebSocket or a polling mechanism that force-refreshes the data when the user returns to the tab or wakes their phone, preventing stale data (solving Issue #5).

· Break Timer: Add a prominent banner at the top of the list indicating "Bench Status: Sitting / On Break / Risen." If on break, show the expected return time (solving Issue #6).

· Clickable Case Numbers: Make the case number clickable. Clicking it should open a modal with full case details (Parties, Advocates, Section, Stage) without leaving the page (solving Issue #7).

· User-Reported Status: Add a button for "Crowdsourced Updates." If a court isn't using the digital system (Issue #1) or the staff is untrained (Issue #3), allow lawyers to mark a case as "Called Out" or "Passed Over" to help others in the courtroom.

· Order Flag: Show a badge if the judge is calling cases out of serial order (Issue #2).



Tab B: Case Vault (Chronology & Notes)



Create a repository for the lawyer's personal case data.



· Chronology Table: Create a dynamic table generator. Columns: Case Name, Advocate Appearing, Time, Case Status, Remarks.

· Daily Log: A feature to "Save Case for Today." The user selects cases from the Causelist, and it adds them to a "Today's Schedule" with an option to add notes.

· Case Mind Maps: When a case is opened, provide a "Visualize" button. This should generate a flowchart/mind map (using Mermaid.js or similar) connecting: Facts -> Issues -> Ratio Decidendi -> Judgment.

· Argument Notes: A rich-text editor specifically for "Extension Arguments" (for junior lawyers) or "Main Arguments."



Tab C: AI Research & Verification



Address the "Fake Citation" problem and commentary needs.



· Citation Verifier: A search bar where a user can paste a citation or upload a PDF. The AI scans it against a mock database to flag "Fake/Unverified" citations in red and "Verified" in green.

· Auto-Pull Judgments: If a user uploads a case document, the app should extract all cited judgments and display "Download" buttons for each.

· Segregation Logic: Provide tabs to filter research by "Civil" or "Criminal" or "BNSS" (as requested by Abhirami).

· Commentary Tab: A section for articles, research papers, and books. Categorize them by subject (Admin Law, Consti Law).



Tab D: Drafting & Registry Automation



Solve the "Outside Courtroom Clerical Work" headache.



· Smart Links: Create a "Registry" section. If a user selects "File Writ Petition (Maharashtra)," automatically display links and buttons to: Bombay High Court Portal, CAT (Central Administrative Tribunal), NCLAT, etc.

· Auto-Draft Templates: Provide a "Draft" button. When clicked, ask for basic inputs (Petitioner, Respondent, Facts) and generate a formatted draft for a Writ Petition or Vakalatnama.



---



3. UI/UX Guidelines (The "Vibe")



· Aesthetic: Professional, trustworthy, but modern. Use "Legal Blue" and white space. Avoid clutter.

· Typography: Serif fonts for reading judgments, Sans-serif for UI elements.

· Mobile First: Since lawyers are constantly on the move, the mobile view must be flawless.



4. Implementation Steps for the AI



1. Scaffold the Layout: Create the Sidebar and Top Navigation.

2. Build the "Live Causelist" Component: Focus on the UI for the table, the "On Break" banner, and the "Click to View Details" modal.

3. Create the "Case Vault" CRUD: Allow users to add cases to a list, edit status, and view a mock "Mind Map" (you can just draw a static image or a simple node graph for the demo).

4. Mock the AI: Create a UI for the "Verifier" where a user inputs text and sees a loading spinner, followed by a mock result showing "Citation Verified."

5. Drafting Module: Create a form that accepts user input and outputs a formatted text block.



Start Coding: Generate the file structure and the main page.tsx (or App.js) first, then drill down into the Live Causelist component as it is the highest priority feature.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://lexie-flow-logic.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/57e7a94d-00f8-4c66-98e2-2a649f862ea7).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
