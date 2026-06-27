const fs = require('fs');
const file = 'services/mockData/posts.ts';
let content = fs.readFileSync(file, 'utf8');
let counter = 0;
content = content.replace(/user:\s*Object\.values\(mockUsers\)\[.*?\],/g, () => {
    let index = counter++;
    return `user: Object.values(mockUsers)[${index} % Object.values(mockUsers).length],`;
});
fs.writeFileSync(file, content);
console.log('Fixed users in posts.ts');
