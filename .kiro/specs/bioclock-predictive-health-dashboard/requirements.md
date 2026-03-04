# Requirements: BioClock Predictive Health Dashboard

## Overview
BioClock is an AI-powered predictive health monitoring system for the Indian population that analyzes 50 biomarkers across 6 tiers to predict chronic disease risk using 4 AI agents powered by Amazon Bedrock Nova.

## User Stories

### US-1: Patient Data Input Form
**As a** user  
**I want to** enter my health data (biomarkers, demographics) through a form  
**So that** the system can analyze my health

**Acceptance Criteria:**
- Form includes fields: Name, Age, Sex, BMI, City, Smoking status, Family history
- Form includes at minimum 10 key biomarkers: HbA1c, Fasting Glucose, Systolic BP, Diastolic BP, LDL, HDL, Triglycerides, Total Cholesterol, Creatinine, ALT
- Submit button calls POST /api/ingest with patient_id and biomarkers
- Success toast notification appears on successful submission
- Error toast notification appears on failed submission
- Form validation prevents submission of incomplete data

### US-2: Patient Dashboard
**As a** user  
**I want to** see a dashboard showing all patients with their risk levels  
**So that** I can quickly identify high-risk patients

**Acceptance Criteria:**
- Dashboard calls GET /api/patients to retrieve patient list with overall_risk
- Patients displayed as cards or table with color-coded risk indicators:
  - 🟢 Low risk (green)
  - 🟡 Moderate risk (yellow)
  - 🔴 High risk (red)
- Dashboard shows summary statistics: total patient count, risk distribution
- Clicking on a patient card navigates to patient detail page
- Dashboard is responsive on mobile and desktop

### US-3: AI Analysis Trigger
**As a** user  
**I want to** trigger AI analysis for a patient  
**So that** I can get disease predictions

**Acceptance Criteria:**
- "Run AI Analysis" button visible on patient detail page
- Button calls POST /api/analyze with patient_id
- Loading spinner displays during analysis
- Agent progress messages show: "Agent 1 running...", "Supervisor evaluating...", "Agent 2 running...", "Agent 3 running...", "Agent 4 running..."
- Results page displays when analysis completes
- Error message shows if analysis fails

### US-4: Agent Reasoning Panel
**As a** user  
**I want to** see what each AI agent found  
**So that** I can understand the reasoning behind predictions

**Acceptance Criteria:**
- Expandable panels for each agent's output:
  - Agent 1: Temporal Pattern Analysis (trends, concerning biomarkers)
  - Supervisor Decision: Continue/Skip with reasoning
  - Agent 2: Biomarker Correlations (clusters detected)
  - Agent 3: Disease Predictions (probability timeline chart)
  - Agent 4: Intervention Plan (diet, exercise, monitoring recommendations)
- Visual agent chain flow diagram: Agent 1 → Supervisor → Agent 2 → 3 → 4
- Each panel can be expanded/collapsed independently
- Data fetched from GET /api/reasoning/{sessionId}

### US-5: Biomarker Trend Charts
**As a** user  
**I want to** see charts showing my biomarker trends over time  
**So that** I can track my health progress

**Acceptance Criteria:**
- Line charts display for key biomarkers: HbA1c, Glucose, BP, LDL, HDL, Triglycerides
- Color zones indicate risk levels:
  - Green zone: normal range
  - Yellow zone: pre-disease range
  - Red zone: high risk range
- Rate of change annotations show trend direction
- Charts are interactive with tooltips
- Time range selector (3 months, 6 months, 1 year)

### US-6: Disease Prediction Timeline
**As a** user  
**I want to** see my disease risk probabilities over 1, 3, 5, 10 years  
**So that** I can understand my long-term health risks

**Acceptance Criteria:**
- Bar chart or gauge showing probability for each predicted condition
- Time periods: 1 year, 3 years, 5 years, 10 years
- Color-coded by severity (green → yellow → red)
- Key driver biomarkers listed for each prediction
- Data fetched from GET /api/predictions/{userId}

### US-7: Multilingual Translation
**As a** user  
**I want to** translate my health report to my local language  
**So that** I can better understand my health status

**Acceptance Criteria:**
- Translation buttons for: Hindi, Tamil, Telugu, Marathi
- Button calls POST /api/translate with text and target language code
- Translated text displays alongside English original
- Loading indicator shows during translation
- Error message if translation fails

### US-8: ETL Pipeline Trigger
**As an** admin  
**I want to** trigger the data pipeline to process raw data  
**So that** patient data is properly processed through Bronze → Silver → Gold layers

**Acceptance Criteria:**
- "Run ETL Pipeline" button visible to admin users
- Button calls POST /api/etl with patient_id
- Pipeline progress indicator shows: Bronze → Silver → Gold
- Success message displays when pipeline completes
- Error message shows if pipeline fails

## Functional Requirements

### FR-1: Navigation
- Landing page (/) with hero section, features overview, "Get Started" CTA
- Dashboard page (/dashboard) with patient list
- Patient detail page (/patient/:id) with biomarkers and trends
- Analysis results page (/analyze/:id) with agent reasoning
- Input form page (/input) for new patient data entry

### FR-2: API Integration
- Base URL: https://in69ou4s98.execute-api.ap-south-1.amazonaws.com/Dev
- Endpoints:
  - POST /api/ingest — Submit patient biomarker data
  - POST /api/etl — Run Medallion ETL pipeline
  - POST /api/analyze — Trigger 4-agent AI analysis
  - GET /api/patients — List all patients with risk levels
  - GET /api/predictions/{userId} — Get predictions for patient
  - GET /api/reasoning/{sessionId} — Get agent reasoning chain
  - POST /api/translate — Translate text to Indian languages

### FR-3: Data Visualization
- Line charts for biomarker trends (Recharts library)
- Bar charts for disease prediction timelines
- Color-coded risk indicators throughout UI
- Interactive tooltips and legends

### FR-4: Responsive Design
- Mobile-first approach
- Breakpoints for tablet and desktop
- Touch-friendly UI elements
- Optimized charts for small screens

## Non-Functional Requirements

### NFR-1: Performance
- Page load time < 2 seconds
- API response handling with loading states
- Optimized chart rendering for large datasets

### NFR-2: Usability
- Clean, medical/health-focused design aesthetic
- Intuitive navigation
- Clear visual hierarchy
- Accessible color contrast ratios

### NFR-3: Design System
- Primary color: Blue (#1E40AF)
- Risk level colors:
  - Low: Green (#10B981)
  - Moderate: Yellow (#F59E0B)
  - High: Red (#EF4444)
- Typography: System fonts, clear hierarchy
- Consistent spacing and padding

### NFR-4: Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ JavaScript support required

## Technical Constraints

### TC-1: Technology Stack
- React 18 with Vite build tool
- Tailwind CSS for styling
- Recharts for data visualization
- React Router for navigation
- Axios for API calls

### TC-2: Deployment
- AWS Amplify hosting
- Environment variables for API base URL

## Correctness Properties

### CP-1: Data Integrity
**Property:** All patient data submitted through the input form must be validated before API submission  
**Test Strategy:** Property-based test that generates random valid and invalid patient data, verifies validation logic catches all invalid cases

### CP-2: Risk Level Consistency
**Property:** Risk level color coding must be consistent across all pages (dashboard, patient detail, analysis results)  
**Test Strategy:** Property-based test that verifies risk level → color mapping is identical in all components

### CP-3: Navigation Integrity
**Property:** All navigation links must resolve to valid routes, no broken links  
**Test Strategy:** Property-based test that generates all possible route combinations and verifies they resolve correctly

### CP-4: API Error Handling
**Property:** All API calls must handle errors gracefully with user-friendly messages  
**Test Strategy:** Property-based test that simulates various API failure scenarios (network errors, 4xx, 5xx) and verifies appropriate error messages display

### CP-5: Chart Data Rendering
**Property:** Charts must render correctly for all valid data shapes (empty, single point, multiple points)  
**Test Strategy:** Property-based test that generates various data shapes and verifies charts render without errors

## Dependencies

- Existing project structure with React + Vite + Tailwind setup
- API backend at specified base URL
- Recharts library for visualizations
- React Router for routing
- Axios for HTTP requests

## Out of Scope

- User authentication/authorization
- Backend API implementation
- Database design
- Mobile native apps
- Offline functionality
- Real-time data updates via WebSockets
