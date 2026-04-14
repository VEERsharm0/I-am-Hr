export const MOCK_JOBS = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechVision Inc.',
    location: 'San Francisco, CA (Remote)',
    salary: '$120k - $150k',
    type: 'Full-time',
    experience: '3-5 Years',
    description: 'We are looking for a highly skilled Senior Frontend Developer with expertise in React, Next.js, and modern CSS to build scalable and performant UI components.',
    skills: ['React', 'TypeScript', 'Tailwind', 'Next.js'],
    postedAt: '2 days ago',
    applicantsCount: 45
  },
  {
    id: '2',
    title: 'Product Designer',
    company: 'Creative Studios',
    location: 'New York, NY',
    salary: '$90k - $120k',
    type: 'Full-time',
    experience: '2-4 Years',
    description: 'Join our design team to create intuitive and beautiful user experiences. You will work closely with product managers and engineers.',
    skills: ['Figma', 'UI/UX', 'Prototyping', 'User Research'],
    postedAt: '5 hours ago',
    applicantsCount: 12
  },
  {
    id: '3',
    title: 'Backend Engineer',
    company: 'DataFlow Systems',
    location: 'Austin, TX (Hybrid)',
    salary: '$110k - $140k',
    type: 'Contract',
    experience: '5+ Years',
    description: 'Seeking a backend expert to maintain and scale our microservices architecture. Strong knowledge of Node.js and PostgreSQL is required.',
    skills: ['Node.js', 'PostgreSQL', 'Docker', 'AWS'],
    postedAt: '1 week ago',
    applicantsCount: 89
  },
  {
    id: '4',
    title: 'Marketing Manager',
    company: 'GrowthHackers',
    location: 'London, UK (Remote)',
    salary: '£60k - £80k',
    type: 'Full-time',
    experience: '3-5 Years',
    description: 'Drive our digital marketing initiatives, manage campaigns across platforms, and analyze performance metrics to optimize ROI.',
    skills: ['SEO', 'Content Strategy', 'Google Ads', 'Analytics'],
    postedAt: '3 days ago',
    applicantsCount: 34
  },
  {
    id: '5',
    title: 'Data Analyst',
    company: 'FinServe',
    location: 'Chicago, IL',
    salary: '$80k - $100k',
    type: 'Full-time',
    experience: '1-3 Years',
    description: 'Turn complex data into actionable insights for our financial teams. Proficiency in SQL, Python, and Tableau is required.',
    skills: ['SQL', 'Python', 'Tableau', 'Excel'],
    postedAt: 'Just now',
    applicantsCount: 2
  }
];

export const MOCK_CATEGORIES = [
  { id: 1, name: 'IT & Software', count: 120, icon: 'Laptop' },
  { id: 2, name: 'Marketing', count: 85, icon: 'Megaphone' },
  { id: 3, name: 'Finance', count: 42, icon: 'Briefcase' },
  { id: 4, name: 'Design', count: 64, icon: 'Palette' },
  { id: 5, name: 'Sales', count: 93, icon: 'TrendingUp' },
];

export const MOCK_COMPANIES = [
  { id: '1', name: 'TechVision Inc.', logo: 'T', openJobs: 12, location: 'San Francisco, CA', industry: 'Software Development', description: 'TechVision Inc. is a leading provider of innovative software solutions. Our mission is to empower businesses through scalable technology and modern design.', website: 'www.techvision.example.com', size: '500-1000 Employees', founded: '2010' },
  { id: '2', name: 'Creative Studios', logo: 'C', openJobs: 5, location: 'New York, NY', industry: 'Design Agency', description: 'We are a digital design agency that creates beautiful, award-winning experiences for the world\'s top brands.', website: 'www.creativestudios.example.com', size: '50-200 Employees', founded: '2015' },
  { id: '3', name: 'DataFlow Systems', logo: 'D', openJobs: 8, location: 'Austin, TX', industry: 'Data Analytics', description: 'DataFlow Systems specializes in big data processing and real-time analytics platforms for Enterprise clients.', website: 'www.dataflow.example.com', size: '200-500 Employees', founded: '2018' },
  { id: '4', name: 'GrowthHackers', logo: 'G', openJobs: 3, location: 'London, UK', industry: 'Digital Marketing', description: 'Driving explosive growth for startups through targeted digital campaigns and data-driven marketing strategies.', website: 'www.growthhackers.example.com', size: '10-50 Employees', founded: '2020' },
  { id: '5', name: 'CloudTech Solutions', logo: 'C', openJobs: 24, location: 'Seattle, WA', industry: 'Cloud Computing', description: 'We provide robust cloud infrastructure and DevOps solutions to accelerate software delivery and operations.', website: 'www.cloudtech.example.com', size: '1000-5000 Employees', founded: '2008' },
  { id: '6', name: 'DesignWorks App', logo: 'D', openJobs: 1, location: 'Remote', industry: 'Design Tools', description: 'Building the next generation of collaborative design tools for remote teams.', website: 'www.designworks.example.com', size: '10-50 Employees', founded: '2022' },
  { id: '7', name: 'FintechGlobal', logo: 'F', openJobs: 15, location: 'London, UK', industry: 'Financial Services', description: 'Modernizing global banking infrastructure with secure, high-speed API platforms.', website: 'www.fintechglobal.example.com', size: '500-1000 Employees', founded: '2016' },
  { id: '8', name: 'AI Innovations', logo: 'A', openJobs: 42, location: 'San Francisco, CA', industry: 'Artificial Intelligence', description: 'Pioneering artificial general intelligence and machine learning models to solve complex real-world problems.', website: 'www.ai-innovations.example.com', size: '200-500 Employees', founded: '2019' }
];
