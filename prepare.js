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

export const SplitType = (data) => {
  // console.log(data);
  let tech = {};
  let skills = {};
  Object.keys(data).forEach((key) => {
    data[key].forEach((ob) => {
      if (subTech.indexOf(ob.type) >= 0) {
        if (!tech[key]) {
          tech[key] = [];
        }
        tech[key].push({
          type: ob.type,
          amount: ob.amount,
        });
      } else {
        if (!skills[key]) {
          skills[key] = [];
        }
        skills[key].push({
          type: ob.type,
          amount: ob.amount,
        });
      }
    });
  });
  return [tech, skills];
};
