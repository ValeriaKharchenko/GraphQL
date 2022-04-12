import { MyProfile } from './queries.js';
import { PrepareSkills } from './prepare.js';
import { SetLine, SetPie } from './charts.js';

async function run() {
  const profile = new MyProfile();
  await profile.initUser('Val_Khar');
  let userField = document.getElementById('user');
  userField.innerHTML = profile.login + '<br>' + profile.id;

  const skills = await profile.GetSkills();
  let skillsField = document.getElementById('skills');
  Object.keys(skills).forEach((sk) => {
    let row = document.createElement('li');
    row.innerText = sk + ': ' + skills[sk] + '%';
    skillsField.appendChild(row);
  });
  const xp = await profile.GetXP();
  const xpDiv = document.getElementById('xp');
  xpDiv.innerHTML = `<ul><li>Audits done: ${xp.done}</li>
<li>Audits received: ${xp.received}</li>
<li>Piscine GO: ${xp.piscineGo}</li>
<li>Piscine JS: ${xp.piscineJS}</li>
<li>Div01: ${xp.div01}</li>
</ul>`;
  const attempts = await profile.GetAttempts();
  SetLine('go-line', attempts[0]);
  SetLine('js-line', attempts[1]);
  const tech = PrepareSkills(skills);
  SetPie('tech-pie', tech[0]);
  SetPie('skill-pie', tech[1]);
}

run();
