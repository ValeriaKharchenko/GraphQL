import { MyProfile } from './queries.js';
import { SetBar, SetLine, SetPie } from './charts.js';
import { PrepareSkills, SplitType } from './prepare.js';

async function run() {
  const urlParams = new URLSearchParams(window.location.search);
  const login = urlParams.get('login') || 'Val_Khar';
  const profile = new MyProfile();
  await profile.initUser(login);
  // await profile.initUser('3mil');
  let userField = document.getElementById('user');
  userField.innerHTML = profile.login + '<br>' + profile.id;

  const skills = await profile.GetSkills();
  const techPie = PrepareSkills(skills[0]);

  let skillsField = document.getElementById('skills');
  Object.keys(techPie[1]).forEach((sk) => {
    let row = document.createElement('li');
    row.innerText = sk + ': ' + skills[0][sk] + '%';
    skillsField.appendChild(row);
  });
  let techsField = document.getElementById('techs');
  Object.keys(techPie[0]).forEach((sk) => {
    let row = document.createElement('li');
    row.innerText = sk + ': ' + skills[0][sk] + '%';
    techsField.appendChild(row);
  });

  const xp = await profile.GetXP();
  const xpList = document.getElementById('xp');
  const auditList = document.getElementById('audits');
  xpList.innerHTML = `<li>Piscine GO: ${xp.piscineGo}</li>
                      <li>Piscine JS: ${xp.piscineJS}</li>
                      <li>Div01: ${xp.div01}</li>`;

  auditList.innerHTML = `<li>Done: ${xp.done}</li>
                        <li>Received: ${xp.received}</li>`;

  const attempts = await profile.GetAttempts();
  SetLine('go-line', attempts[0], 'Attempts before "Bim!" in Go-piscine');
  SetLine('js-line', attempts[1], 'Attempts before "Bim!" in JS-piscine');

  SetPie('tech-pie', techPie[0], 'Current level of tech-knowledge');
  SetPie('skill-pie', techPie[1], 'Current level of skills');

  const techBar = SplitType(skills[1]);
  SetBar('skill-bar', techBar[0], 'Knowledge per task');
  SetBar('tech-bar', techBar[1], 'Knowledge per task');
}

run();
