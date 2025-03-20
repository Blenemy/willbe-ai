import {
  Briefcase,
  Crown,
  User,
  Users,
  Building,
  Handshake,
  Landmark,
} from "lucide-react";

const seniorityList = [
  { value: "owner", label: "Owner / Partner", icon: Crown },
  { value: "cxo", label: "CXO", icon: Briefcase },
  { value: "vp", label: "Vice President", icon: Users },
  { value: "director", label: "Director", icon: Building },
  { value: "experienced-manager", label: "Experienced Manager", icon: User },
  { value: "entry-manager", label: "Entry Level Manager", icon: User },
  { value: "strategic", label: "Strategic", icon: Briefcase },
  { value: "senior", label: "Senior", icon: Users },
  { value: "entry", label: "Entry Level", icon: User },
  { value: "training", label: "In Training", icon: User },
];

const companyTypeList = [
  { value: "Public company", label: "Public company", icon: Crown },
  { value: "Privately held", label: "Privately held", icon: Briefcase },
  { value: "Non profit", label: "Non profit", icon: Users },
  {
    value: "Educational institution",
    label: "Educational institution",
    icon: Building,
  },
  { value: "Partnership", label: "Partnership", icon: Handshake },
  { value: "Self employed", label: "Self employed", icon: User },
  { value: "Self owned", label: "Self owned", icon: Briefcase },
  { value: "Government agency", label: "Government agency", icon: Landmark },
];

export const formConfig = [
  {
    category: "🗃️ Basic data",
    fields: [
      {
        name: "first_name",
        label: "First Name",
        type: "text",
        placeholder: "Enter first name",
      },
      {
        name: "last_name",
        label: "Last Name",
        type: "text",
        placeholder: "Enter last name",
      },
      {
        name: "language",
        label: "Language",
        type: "text",
        placeholder: "Enter language",
      },
    ],
  },
  {
    category: "👔 Professional profile",
    fields: [
      {
        name: "job_title",
        label: "Job Title",
        type: "text",
        placeholder: "Enter job title",
      },
      {
        name: "past_job_title",
        label: "Past Job Title",
        type: "text",
        placeholder: "Enter past job title",
      },
      {
        name: "department",
        label: "Department",
        type: "text",
        placeholder: "Enter department",
      },
      {
        name: "job_tenure_from",
        label: "Job Tenure (From)",
        type: "text",
        placeholder: "Years from",
      },
      {
        name: "job_tenure_to",
        label: "Job Tenure (To)",
        type: "text",
        placeholder: "Years to",
      },
    ],
  },
  {
    category: "🧓 Seniority",
    fields: [
      {
        name: "seniority",
        label: "Include Seniority",
        type: "multi-select",
        options: seniorityList,
      },
      {
        name: "seniority_exclude",
        label: "Exclude Seniority",
        type: "multi-select",
        options: seniorityList,
      },
    ],
  },
  {
    category: "⏳ Experience",
    fields: [
      {
        name: "experience_years_from",
        label: "Experience (From)",
        type: "text",
        placeholder: "Years from",
      },
      {
        name: "experience_years_to",
        label: "Experience (To)",
        type: "text",
        placeholder: "Years to",
      },
    ],
  },
  {
    category: "📢 LinkedIn activity",
    fields: [
      {
        name: "posted_on_linkedin",
        label: "Posted on LinkedIn",
        type: "switch",
      },
      { name: "mentioned_in_news", label: "Mentioned in News", type: "switch" },
      {
        name: "viewed_your_profile",
        label: "Viewed Your Profile",
        type: "switch",
      },
      {
        name: "following_your_company",
        label: "Following Your Company",
        type: "switch",
      },
      { name: "past_colleague", label: "Past Colleague", type: "switch" },
      {
        name: "shared_experiences",
        label: "Shared Experiences",
        type: "switch",
      },
      { name: "changed_jobs", label: "Changed Jobs", type: "switch" },
    ],
  },
  {
    category: "🕸️ Network",
    fields: [
      {
        name: "network_distance",
        label: "Network Distance",
        type: "select",
        options: [
          { value: "1st", label: "1st" },
          { value: "2nd", label: "2nd" },
          { value: "3rd", label: "3rd" },
        ],
      },
    ],
  },
  {
    category: "🏢 Company details",
    fields: [
      {
        name: "current_company",
        label: "Current Company",
        type: "text",
        placeholder: "Enter current company",
      },
      {
        name: "past_company",
        label: "Past Company",
        type: "text",
        placeholder: "Enter past company",
      },
      {
        name: "company_industry",
        label: "Company Industry",
        type: "text",
        placeholder: "Enter industry",
      },
      {
        name: "company_location",
        label: "Company Location",
        type: "text",
        placeholder: "Enter location",
      },
      {
        name: "company_type",
        label: "Company Type",
        type: "multi-select",
        options: companyTypeList,
      },
      {
        name: "company_headcount_from",
        label: "Company Headcount (From)",
        type: "text",
        placeholder: "Min employees",
      },
      {
        name: "company_headcount_to",
        label: "Company Headcount (To)",
        type: "text",
        placeholder: "Max employees",
      },
      {
        name: "company_tenure_from",
        label: "Company Tenure (From)",
        type: "text",
        placeholder: "Years from",
      },
      {
        name: "company_tenure_to",
        label: "Company Tenure (To)",
        type: "text",
        placeholder: "Years to",
      },
    ],
  },
  {
    category: "🎓 Education",
    fields: [
      {
        name: "school",
        label: "School",
        type: "text",
        placeholder: "Enter school name",
      },
    ],
  },
  {
    category: "🏷️ Keywords & Personas",
    fields: [
      {
        name: "keywords",
        label: "Keywords",
        type: "text",
        placeholder: "Enter keywords",
      },
      {
        name: "persona",
        label: "Persona",
        type: "text",
        placeholder: "Enter persona",
      },
    ],
  },
];
