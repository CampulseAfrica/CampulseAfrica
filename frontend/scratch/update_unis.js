const fs = require('fs');
const file = 'services/mockData/users.ts';
let content = fs.readFileSync(file, 'utf8');

const newUnis = `export const mockUniversities: Record<string, University> = {
  uniben: { id: 'uni-1', name: 'University of Benin', shortName: 'UNIBEN', location: 'Benin City, Edo State' },
  unilag: { id: 'uni-2', name: 'University of Lagos', shortName: 'UNILAG', location: 'Lagos, Lagos State' },
  abu: { id: 'uni-3', name: 'Ahmadu Bello University', shortName: 'ABU', location: 'Zaria, Kaduna State' },
  ui: { id: 'uni-4', name: 'University of Ibadan', shortName: 'UI', location: 'Ibadan, Oyo State' },
  oau: { id: 'uni-5', name: 'Obafemi Awolowo University', shortName: 'OAU', location: 'Ile-Ife, Osun State' },
  unn: { id: 'uni-6', name: 'University of Nigeria', shortName: 'UNN', location: 'Nsukka, Enugu State' },
  uniport: { id: 'uni-7', name: 'University of Port Harcourt', shortName: 'UNIPORT', location: 'Port Harcourt, Rivers State' },
  uniabuja: { id: 'uni-8', name: 'University of Abuja', shortName: 'UNIABUJA', location: 'Abuja, FCT' },
  unilorin: { id: 'uni-9', name: 'University of Ilorin', shortName: 'UNILORIN', location: 'Ilorin, Kwara State' },
  unical: { id: 'uni-10', name: 'University of Calabar', shortName: 'UNICAL', location: 'Calabar, Cross River State' },
  cu: { id: 'uni-11', name: 'Covenant University', shortName: 'CU', location: 'Ota, Ogun State' },
  unijos: { id: 'uni-12', name: 'University of Jos', shortName: 'UNIJOS', location: 'Jos, Plateau State' },
  futa: { id: 'uni-13', name: 'Federal University of Technology, Akure', shortName: 'FUTA', location: 'Akure, Ondo State' },
  buk: { id: 'uni-14', name: 'Bayero University', shortName: 'BUK', location: 'Kano, Kano State' },
  uniuyo: { id: 'uni-15', name: 'University of Uyo', shortName: 'UNIUYO', location: 'Uyo, Akwa Ibom State' },
  biu: { id: 'uni-16', name: 'Benson Idahosa University', shortName: 'BIU', location: 'Benin City, Edo State' },
};`;

content = content.replace(/export const mockUniversities: Record<string, University> = \{[\s\S]*?\n\};\n/m, newUnis + '\n\n');
fs.writeFileSync(file, content);
console.log('Updated mockUniversities');
