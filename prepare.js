const subTech = ['go', 'html', 'css', 'js', 'docker', 'sql'];

export const PrepareSkills = (allSkills) => {
  let tech = {};
  let skills = {};
  Object.keys(allSkills).forEach((sk) => {
    if (subTech.indexOf(sk) >= 0) {
      tech[sk] = allSkills[sk];
    } else {
      skills[sk] = allSkills[sk];
    }
  });
  const sumTech = Object.values(tech).reduce((a, b) => a + b, 0);
  const sumSkills = Object.values(skills).reduce((a, b) => a + b, 0);
  let perTech = {};
  let perSkills = {};
  Object.keys(tech).forEach((k) => {
    perTech[k] = Math.round((tech[k] * 100) / sumTech);
  });
  Object.keys(skills).forEach((k) => {
    perSkills[k] = Math.round((skills[k] * 100) / sumSkills);
  });
  return [perTech, perSkills];
};
