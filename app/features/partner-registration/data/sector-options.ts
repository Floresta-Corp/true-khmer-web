export interface OptionItem {
	value: string
	label: string
}

export const partnerSectorOptions: OptionItem[] = [
	// Technology
	{ value: "InformationTechnology", label: "Information Technology" },
	{ value: "SoftwareDevelopment", label: "Software Development" },
	{ value: "ITConsulting", label: "IT Consulting" },
	{ value: "CloudServices", label: "Cloud Services" },
	{ value: "Cybersecurity", label: "Cybersecurity" },
	{ value: "DataAnalytics", label: "Data Analytics & Business Intelligence" },
	{
		value: "ArtificialIntelligence",
		label: "Artificial Intelligence & Machine Learning",
	},
	{ value: "Blockchain", label: "Blockchain & Cryptocurrency" },

	// Finance & Real Estate
	{ value: "Banking", label: "Banking & Financial Services" },
	{ value: "Insurance", label: "Insurance" },
	{ value: "InvestmentManagement", label: "Investment Management" },
	{ value: "Accounting", label: "Accounting & Auditing" },
	{ value: "FinTech", label: "Financial Technology (FinTech)" },
	{ value: "RealEstate", label: "Real Estate" },
	{ value: "PropertyManagement", label: "Property Management" },
	{ value: "Construction", label: "Construction" },

	// Healthcare & Sciences
	{ value: "Healthcare", label: "Healthcare & Medical Services" },
	{ value: "Pharmaceuticals", label: "Pharmaceuticals" },
	{ value: "BioTechnology", label: "Biotechnology" },
	{ value: "MedicalDevices", label: "Medical Devices & Equipment" },
	{ value: "HealthTech", label: "Health Technology" },

	// Consumer Goods & Services
	{ value: "Retail", label: "Retail & E-commerce" },
	{ value: "ConsumerGoods", label: "Consumer Goods & FMCG" },
	{ value: "FoodBeverage", label: "Food & Beverage" },
	{ value: "Hospitality", label: "Hospitality & Tourism" },
	{ value: "Entertainment", label: "Entertainment & Media" },
	{ value: "Gaming", label: "Gaming & Gambling" },

	// Manufacturing & Industry
	{ value: "Manufacturing", label: "Manufacturing" },
	{ value: "Automotive", label: "Automotive & Transportation" },
	{ value: "Aerospace", label: "Aerospace & Defense" },
	{ value: "Electronics", label: "Electronics & Semiconductors" },
	{ value: "Textiles", label: "Textiles & Apparel" },

	// Energy & Resources
	{ value: "Energy", label: "Energy & Utilities" },
	{ value: "Oil", label: "Oil & Gas" },
	{ value: "RenewableEnergy", label: "Renewable Energy" },
	{ value: "Mining", label: "Mining & Metals" },
	{ value: "Agriculture", label: "Agriculture & Forestry" },

	// Professional Services
	{ value: "LegalServices", label: "Legal Services" },
	{ value: "ConsultingServices", label: "Consulting Services" },
	{ value: "HumanResources", label: "Human Resources" },
	{ value: "Marketing", label: "Marketing & Advertising" },
	{ value: "Education", label: "Education & Training" },

	// Infrastructure & Logistics
	{ value: "Telecommunications", label: "Telecommunications" },
	{ value: "Transportation", label: "Transportation & Logistics" },
	{ value: "Warehousing", label: "Warehousing & Storage" },
	{ value: "Infrastructure", label: "Infrastructure & Public Utilities" },

	// Miscellaneous
	{ value: "NonProfit", label: "Non-Profit & NGO" },
	{ value: "Government", label: "Government & Public Administration" },
	{ value: "Defense", label: "Defense & Security" },
	{ value: "ResearchDevelopment", label: "Research & Development" },
	{ value: "Other", label: "Other" },
]

export const partnerEmployeePositionOptions: OptionItem[] = [
	{
		value: "Chief Executive Officer (CEO)",
		label: "Chief Executive Officer (CEO)",
	},
	{
		value: "Chief Technology Officer (CTO)",
		label: "Chief Technology Officer (CTO)",
	},
	{
		value: "Chief Financial Officer (CFO)",
		label: "Chief Financial Officer (CFO)",
	},
	{
		value: "Chief Marketing Officer (CMO)",
		label: "Chief Marketing Officer (CMO)",
	},
	{
		value: "Chief Operating Officer (COO)",
		label: "Chief Operating Officer (COO)",
	},
	{ value: "President", label: "President" },
	{
		value: "Executive Vice President (EVP)",
		label: "Executive Vice President (EVP)",
	},
	{
		value: "Senior Vice President (SVP)",
		label: "Senior Vice President (SVP)",
	},
	{ value: "Vice President (VP)", label: "Vice President (VP)" },
	{ value: "Director", label: "Director" },
	{ value: "Senior Director", label: "Senior Director" },
	{ value: "Associate Director", label: "Associate Director" },
	{ value: "General Manager", label: "General Manager" },
	{ value: "Regional Manager", label: "Regional Manager" },
	{ value: "Department Manager", label: "Department Manager" },
	{ value: "Product Manager", label: "Product Manager" },
	{ value: "Project Manager", label: "Project Manager" },
	{ value: "Program Manager", label: "Program Manager" },
	{ value: "Team Lead", label: "Team Lead" },
	{ value: "Principal Engineer", label: "Principal Engineer" },
	{ value: "Staff Engineer", label: "Staff Engineer" },
	{ value: "Senior Engineer", label: "Senior Engineer" },
	{ value: "Software Engineer", label: "Software Engineer" },
	{ value: "Junior Engineer", label: "Junior Engineer" },
	{ value: "Intern", label: "Intern" },
	{ value: "Senior Analyst", label: "Senior Analyst" },
	{ value: "Business Analyst", label: "Business Analyst" },
	{ value: "Data Analyst", label: "Data Analyst" },
	{ value: "Senior Consultant", label: "Senior Consultant" },
	{ value: "Consultant", label: "Consultant" },
	{ value: "Solution Architect", label: "Solution Architect" },
	{ value: "Enterprise Architect", label: "Enterprise Architect" },
	{ value: "Scrum Master", label: "Scrum Master" },
	{ value: "Product Owner", label: "Product Owner" },
	{ value: "HR Business Partner", label: "HR Business Partner" },
	{ value: "Recruiter", label: "Recruiter" },
	{ value: "Office Manager", label: "Office Manager" },
	{ value: "Administrative Assistant", label: "Administrative Assistant" },
	{ value: "Executive Assistant", label: "Executive Assistant" },
	{ value: "Customer Success Manager", label: "Customer Success Manager" },
	{ value: "Sales Manager", label: "Sales Manager" },
	{ value: "Account Executive", label: "Account Executive" },
	{ value: "Marketing Manager", label: "Marketing Manager" },
	{ value: "Content Strategist", label: "Content Strategist" },
	{ value: "Graphic Designer", label: "Graphic Designer" },
	{ value: "UX/UI Designer", label: "UX/UI Designer" },
	{ value: "Legal Counsel", label: "Legal Counsel" },
	{ value: "Compliance Officer", label: "Compliance Officer" },
	{ value: "Influencer", label: "Influencer" },
	{ value: "Other", label: "Other" },
]

export const memberOccupationOptions: OptionItem[] = [
	// Technology & IT
	{ value: "SoftwareEngineer", label: "Software Engineer/Developer" },
	{ value: "WebDeveloper", label: "Web Developer" },
	{ value: "MobileDeveloper", label: "Mobile App Developer" },
	{ value: "DevOpsEngineer", label: "DevOps Engineer" },
	{ value: "SystemsAdministrator", label: "Systems Administrator" },
	{ value: "NetworkEngineer", label: "Network Engineer" },
	{ value: "DatabaseAdministrator", label: "Database Administrator" },
	{ value: "DataScientist", label: "Data Scientist/Analyst" },
	{ value: "AIResearcher", label: "AI/Machine Learning Specialist" },
	{ value: "CyberSecuritySpecialist", label: "Cybersecurity Specialist" },
	{ value: "ProductManager", label: "IT Product Manager" },
	{ value: "QAEngineer", label: "Quality Assurance Engineer" },
	{ value: "UXDesigner", label: "UX/UI Designer" },

	// Business & Management
	{ value: "ExecutiveManagement", label: "Executive (CEO, CTO, CFO, etc.)" },
	{ value: "GeneralManager", label: "General Manager" },
	{ value: "ProjectManager", label: "Project Manager" },
	{ value: "BusinessAnalyst", label: "Business Analyst" },
	{ value: "ProductOwner", label: "Product Owner" },
	{ value: "OperationsManager", label: "Operations Manager" },
	{ value: "HRManager", label: "HR Manager/Specialist" },
	{ value: "OfficeAdministrator", label: "Office Administrator" },
	{ value: "ExecutiveAssistant", label: "Executive Assistant" },

	// Finance & Accounting
	{ value: "Accountant", label: "Accountant" },
	{ value: "FinancialAnalyst", label: "Financial Analyst" },
	{ value: "FinancialAdvisor", label: "Financial Advisor" },
	{ value: "InvestmentBanker", label: "Investment Banker" },
	{ value: "InsuranceAgent", label: "Insurance Agent/Broker" },
	{ value: "TaxConsultant", label: "Tax Consultant" },
	{ value: "Auditor", label: "Auditor" },

	// Legal
	{ value: "Lawyer", label: "Lawyer/Attorney" },
	{ value: "LegalConsultant", label: "Legal Consultant" },
	{ value: "ParaLegal", label: "Paralegal" },
	{ value: "LegalSecretary", label: "Legal Secretary" },

	// Healthcare
	{ value: "Physician", label: "Physician/Doctor" },
	{ value: "Nurse", label: "Nurse" },
	{ value: "Pharmacist", label: "Pharmacist" },
	{ value: "Dentist", label: "Dentist" },
	{ value: "MentalHealthProfessional", label: "Mental Health Professional" },
	{ value: "PhysicalTherapist", label: "Physical Therapist" },
	{ value: "VeterinaryMedicine", label: "Veterinary Medicine" },

	// Education
	{ value: "Teacher", label: "Teacher/Educator" },
	{ value: "Professor", label: "Professor/Academic" },
	{ value: "Researcher", label: "Researcher" },
	{ value: "EducationalAdministrator", label: "Educational Administrator" },
	{ value: "TrainingSpecialist", label: "Training Specialist" },
	{ value: "Librarian", label: "Librarian" },

	// Creative & Media
	{ value: "GraphicDesigner", label: "Graphic Designer" },
	{ value: "ContentWriter", label: "Content Writer/Copywriter" },
	{ value: "Journalist", label: "Journalist" },
	{ value: "Photographer", label: "Photographer" },
	{ value: "VideoProducer", label: "Video Producer/Editor" },
	{ value: "MarketingSpecialist", label: "Marketing Specialist" },
	{ value: "PRSpecialist", label: "Public Relations Specialist" },

	// Engineering & Technical Fields
	{ value: "CivilEngineer", label: "Civil Engineer" },
	{ value: "MechanicalEngineer", label: "Mechanical Engineer" },
	{ value: "ElectricalEngineer", label: "Electrical Engineer" },
	{ value: "ChemicalEngineer", label: "Chemical Engineer" },
	{ value: "ArchitecturalDesigner", label: "Architect/Architectural Designer" },
	{ value: "Surveyor", label: "Surveyor" },

	// Sales & Customer Service
	{ value: "SalesRepresentative", label: "Sales Representative" },
	{ value: "AccountManager", label: "Account Manager" },
	{ value: "CustomerServiceRep", label: "Customer Service Representative" },
	{ value: "RetailSales", label: "Retail Sales Associate" },

	// Hospitality & Service Industry
	{ value: "Chef", label: "Chef/Cook" },
	{ value: "HotelManagement", label: "Hotel Management" },
	{ value: "EventPlanner", label: "Event Planner" },
	{ value: "TourismOperator", label: "Tourism Operator" },

	// Transportation & Logistics
	{ value: "Pilot", label: "Pilot" },
	{ value: "CommercialDriver", label: "Commercial Driver" },
	{ value: "LogisticsCoordinator", label: "Logistics Coordinator" },
	{ value: "SupplyChainManager", label: "Supply Chain Manager" },

	// Other Professional Categories
	{ value: "SocialWorker", label: "Social Worker" },
	{ value: "Counselor", label: "Counselor" },
	{ value: "NonprofitWorker", label: "Non-Profit Worker" },
	{ value: "GovernmentOfficial", label: "Government Official/Civil Servant" },
	{ value: "MilitaryPersonnel", label: "Military Personnel" },
	{ value: "Tradesperson", label: "Tradesperson (Plumber, Electrician, etc.)" },
	{ value: "AgricultureWorker", label: "Agriculture/Farming Professional" },
	{ value: "Consultant", label: "Consultant" },
	{ value: "Entrepreneur", label: "Entrepreneur/Business Owner" },
	{ value: "Freelancer", label: "Freelancer" },
	{ value: "Student", label: "Student" },
	{ value: "Retired", label: "Retired" },
	{ value: "Other", label: "Other" },
]

export const genderoptions: OptionItem[] = [
	{ value: "Male", label: "Male" },
	{ value: "Female", label: "Female" },
	{ value: "Other", label: "Other" },
]

export const titleOptions: OptionItem[] = [
	{ value: "Mr", label: "Mr." },
	{ value: "Ms", label: "Ms." },
	{ value: "Mrs", label: "Mrs." },
	{ value: "Dr", label: "Dr." },
	{ value: "Prof", label: "Prof." },
]

