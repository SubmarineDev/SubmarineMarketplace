import mock from '../mock'

// ** Utils
import { paginateArray } from '../utils'

const data = [
  {
    id: 1,
    key: "Korrie O'Crevy",
    value: 'Nuclear Power Engineer',
    status: 2
  },
  {
    id: 2,
    key: 'Bailie Coulman',
    value: 'VP Quality Control',
    status: 2
  },
  {
    id: 3,
    key: 'Stella Ganderton',
    value: 'Operator',
    status: 5
  },
  {
    id: 4,
    key: 'Dorolice Crossman',
    value: 'Cost Accountant',
    status: 2
  },
  {
    id: 5,
    key: 'Harmonia Nisius',
    value: 'Senior Cost Accountant',
    status: 2
  },
  {
    id: 6,
    key: 'Genevra Honeywood',
    value: 'Geologist',
    status: 1
  },
  {
    id: 7,
    key: 'Eileen Diehn',
    value: 'Environmental Specialist',
    status: 3
  },
  {
    id: 8,
    key: 'Richardo Aldren',
    value: 'Senior Sales Associate',
    status: 3
  },
  {
    id: 9,
    key: 'Allyson Moakler',
    value: 'Safety Technician',
    status: 5
  },
  {
    id: 10,
    key: 'Merline Penhalewick',
    value: 'Junior Executive',
    status: 2
  },
  {
    id: 11,
    key: 'De Falloon',
    value: 'Sales Representative',
    status: 4
  },
  {
    id: 12,
    key: 'Cyrus Gornal',
    value: 'Senior Sales Associate',
    status: 4
  },
  {
    id: 13,
    key: 'Tallou Balf',
    value: 'Staff Accountant',
    status: 4
  },
  {
    id: 14,
    key: 'Othilia Extill',
    value: 'Associate Professor',
    status: 2
  },
  {
    id: 15,
    key: 'Wilmar Bourton',
    value: 'Administrative Assistant',
    status: 5
  },
  {
    id: 16,
    key: 'Robinson Brazenor',
    value: 'General Manager',
    status: 5
  },
  {
    id: 17,
    key: 'Nadia Bettenson',
    value: 'Environmental Tech',
    status: 1
  },
  {
    id: 18,
    key: 'Titus Hayne',
    value: 'Web Designer',
    status: 1
  },
  {
    id: 19,
    key: 'Roxie Huck',
    value: 'Administrative Assistant',
    status: 4
  },
  {
    id: 20,
    key: 'Latashia Lewtey',
    value: 'Actuary',
    status: 1
  },
  {
    id: 21,
    key: 'Natalina Tyne',
    value: 'Software Engineer',
    status: 2
  },
  {
    id: 22,
    key: 'Faun Josefsen',
    value: 'Analog Circuit Design manager',
    status: 3
  },
  {
    id: 23,
    key: 'Rosmunda Steed',
    value: 'Assistant Media Planner',
    status: 5
  },
  {
    id: 24,
    key: 'Scott Jiran',
    value: 'Graphic Designer',
    status: 1
  },
  {
    id: 25,
    key: 'Carmita Medling',
    value: 'Accountant',
    status: 3
  },
  {
    id: 26,
    key: 'Morgen Benes',
    value: 'Senior Sales Associate',
    status: 4
  },
  {
    id: 27,
    key: 'Onfroi Doughton',
    value: 'Civil Engineer',
    status: 3
  },
  {
    id: 28,
    key: 'Kliment McGinney',
    value: 'Chief Design Engineer',
    status: 4
  },
  {
    id: 29,
    key: 'Devin Bridgland',
    value: 'Tax Accountant',
    status: 3
  },
  {
    id: 30,
    key: 'Gilbert McFade',
    value: 'Biostatistician',
    status: 2
  },
  {
    id: 31,
    key: 'Teressa Bleakman',
    value: 'Senior Editor',
    status: 5
  },
  {
    id: 32,
    key: 'Marcelia Alleburton',
    value: 'Safety Technician',
    status: 2
  },
  {
    id: 33,
    key: 'Aili De Coursey',
    value: 'Environmental Specialist',
    status: 5
  },
  {
    id: 34,
    key: 'Charlton Chatres',
    value: 'Analyst Programmer',
    status: 3
  },
  {
    id: 35,
    key: 'Nat Hugonnet',
    value: 'Financial Advisor',
    status: 4
  },
  {
    id: 36,
    key: 'Lorine Hearsum',
    value: 'Payment Adjustment Coordinator',
    status: 4
  },
  {
    id: 37,
    key: 'Sheila-kathryn Haborn',
    value: 'Environmental Specialist',
    status: 3
  },
  {
    id: 38,
    key: 'Alma Harvatt',
    value: 'Administrative Assistant',
    status: 1
  },
  {
    id: 39,
    key: 'Beatrix Longland',
    value: 'VP Quality Control',
    status: 2
  },
  {
    id: 40,
    key: 'Hammad Condell',
    value: 'Project Manager',
    status: 4
  },
  {
    id: 41,
    key: 'Parker Bice',
    value: 'Technical Writer',
    status: 5
  },
  {
    id: 42,
    key: 'Lowrance Orsi',
    value: 'Biostatistician',
    status: 1
  },
  {
    id: 43,
    key: 'Ddene Chaplyn',
    value: 'Environmental Tech',
    status: 2
  },
  {
    id: 44,
    key: 'Washington Bygraves',
    value: 'Human Resources Manager',
    status: 1
  },
  {
    id: 45,
    key: 'Meghann Bodechon',
    value: 'Operator',
    status: 4
  },
  {
    id: 46,
    key: 'Moshe De Ambrosis',
    value: 'Recruiting Manager',
    status: 5
  },
  {
    id: 47,
    key: 'Had Chatelot',
    value: 'Cost Accountant',
    status: 4
  },
  {
    id: 48,
    key: 'Georgia McCrum',
    value: 'Registered Nurse',
    status: 1
  },
  {
    id: 49,
    key: 'Krishnah Stilldale',
    value: 'VP Accounting',
    status: 1
  },
  {
    id: 50,
    key: 'Mario Umbert',
    value: 'Research Assistant',
    status: 1
  },
  {
    id: 51,
    key: 'Edvard Dixsee',
    value: 'Graphic Designer',
    status: 3
  },
  {
    id: 52,
    key: 'Tammie Davydoch',
    value: 'VP Quality Control',
    status: 3
  },
  {
    id: 53,
    key: 'Benito Rodolico',
    value: 'Safety Technician',
    status: 5
  },
  {
    id: 54,
    key: 'Marco Pennings',
    value: 'Compensation Analyst',
    status: 3
  },
  {
    id: 55,
    key: "Tommie O'Corr",
    value: 'Quality Engineer',
    status: 1
  },
  {
    id: 56,
    key: 'Cybill Poyle',
    value: 'Cost Accountant',
    status: 1
  },
  {
    id: 57,
    key: 'Norry Stoller',
    value: 'Human Resources Manager',
    status: 4
  },
  {
    id: 58,
    key: 'Wendi Somerlie',
    value: 'Systems Administrator',
    status: 5
  },
  {
    id: 59,
    key: 'Ferdie Georgeon',
    value: 'Geologist',
    status: 2
  },
  {
    id: 60,
    key: 'Jules Auten',
    value: 'Desktop Support Technician',
    status: 4
  },
  {
    id: 61,
    key: 'Nichole Dacres',
    value: 'Mechanical Systems Engineer',
    status: 3
  },
  {
    id: 62,
    key: 'Holly Edgworth',
    value: 'Junior Executive',
    status: 5
  },
  {
    id: 63,
    key: 'Henriette Croft',
    value: 'Food Chemist',
    status: 5
  },
  {
    id: 64,
    key: 'Annetta Glozman',
    value: 'Staff Accountant',
    status: 5
  },
  {
    id: 65,
    key: 'Cletis Cervantes',
    value: 'Health Coach',
    status: 1
  },
  {
    id: 66,
    key: 'Christos Kiley',
    value: 'Geologist',
    status: 1
  },
  {
    id: 67,
    key: 'Silvain Siebert',
    value: 'VP Sales',
    status: 5
  },
  {
    id: 68,
    key: 'Sharla Ibberson',
    value: 'Payment Adjustment Coordinator',
    status: 1
  },
  {
    id: 69,
    key: 'Ripley Rentcome',
    value: 'Physical Therapy Assistant',
    status: 2
  },
  {
    id: 70,
    key: 'Chrisse Birrane',
    value: 'Chemical Engineer',
    status: 5
  },
  {
    id: 71,
    key: 'Georges Tesyro',
    value: 'Human Resources Manager',
    status: 1
  },
  {
    id: 72,
    key: 'Bondon Hazard',
    value: 'Geological Engineer',
    status: 4
  },
  {
    id: 73,
    key: 'Aliza MacElholm',
    value: 'VP Sales',
    status: 2
  },
  {
    id: 74,
    key: 'Lucas Witherdon',
    value: 'Senior Quality Engineer',
    status: 3
  },
  {
    id: 75,
    key: 'Pegeen Peasegod',
    value: 'Web Designer',
    status: 3
  },
  {
    id: 76,
    key: 'Elyn Watkinson',
    value: 'Structural Analysis Engineer',
    status: 1
  },
  {
    id: 77,
    key: 'Babb Skirving',
    value: 'Analyst Programmer',
    status: 4
  },
  {
    id: 78,
    key: 'Shelli Ondracek',
    value: 'Financial Advisor',
    status: 3
  },
  {
    id: 79,
    key: 'Stanislaw Melloy',
    value: 'Sales Associate',
    status: 2
  },
  {
    id: 80,
    key: 'Seamus Eisikovitsh',
    value: 'Legal Assistant',
    status: 1
  },
  {
    id: 81,
    key: 'Tammie Wattins',
    value: 'Web Designer',
    status: 2
  },
  {
    id: 82,
    key: 'Aila Quailadis',
    value: 'Technical Writer',
    status: 4
  },
  {
    id: 83,
    key: 'Myrvyn Gilogly',
    value: 'Research Associate',
    status: 4
  },
  {
    id: 84,
    key: 'Hanna Langthorne',
    value: 'Analyst Programmer',
    status: 3
  },
  {
    id: 85,
    key: 'Ruby Gimblet',
    value: 'Registered Nurse',
    status: 2
  },
  {
    id: 86,
    key: 'Louis Paszak',
    value: 'Programmer',
    status: 5
  },
  {
    id: 87,
    key: 'Glennie Riolfi',
    value: 'Computer Systems Analyst',
    status: 3
  },
  {
    id: 88,
    key: 'Jemimah Morgan',
    value: 'Staff Accountant',
    status: 1
  },
  {
    id: 89,
    key: 'Talya Brandon',
    value: 'Food Chemist',
    status: 1
  },
  {
    id: 90,
    key: 'Renate Shay',
    value: 'Recruiter',
    status: 1
  },
  {
    id: 91,
    key: 'Julianne Bartosik',
    value: 'Senior Cost Accountant',
    status: 3
  },
  {
    id: 92,
    key: 'Yvonne Emberton',
    value: 'Recruiter',
    status: 4
  },
  {
    id: 93,
    key: 'Danya Faichnie',
    value: 'Social Worker',
    status: 4
  },
  {
    id: 94,
    key: 'Ronica Hasted',
    value: 'Software Consultant',
    status: 4
  },
  {
    id: 95,
    key: 'Edwina Ebsworth',
    value: 'Human Resources Assistant',
    status: 1
  },
  {
    id: 96,
    key: 'Alaric Beslier',
    value: 'Tax Accountant',
    status: 4
  },
  {
    id: 97,
    key: 'Reina Peckett',
    value: 'Quality Control Specialist',
    status: 4
  },
  {
    id: 98,
    key: 'Olivette Gudgin',
    value: 'Paralegal',
    status: 2
  },
  {
    id: 99,
    key: 'Evangelina Carnock',
    value: 'Cost Accountant',
    status: 4
  },
  {
    id: 100,
    key: 'Glyn Giacoppo',
    value: 'Software Test Engineer',
    status: 2
  }
]

mock.onGet('/api/datatables/initial-data').reply(() => {
  return [200, data]
})

mock.onGet('/api/datatables/data').reply(config => {
  // eslint-disable-next-line object-curly-newline
  const { q = '', perPage = 10, page = 1 } = config
  /* eslint-enable */

  const queryLowered = q.toLowerCase()
  const filteredData = data.filter(
    item =>
      /* eslint-disable operator-linebreak, implicit-arrow-linebreak */
      item.key.toLowerCase().includes(queryLowered) ||
      item.value.toLowerCase().includes(queryLowered)
  )
  /* eslint-enable  */

  return [
    200,
    {
      allData: data,
      invoices: paginateArray(filteredData, perPage, page),
      total: filteredData.length
    }
  ]
})
