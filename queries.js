// import fetch from "node-fetch";

export class MyProfile {
  baseURL = 'https://01.kood.tech/api/graphql-engine/v1/graphql';

  constructor() {}

  async initUser(login) {
    this.login = login;
    this.limit = 50;
    this.id = await this.#getUser();
  }

  async getData(query, offset, field) {
    let data = await fetch(this.baseURL, {
      method: 'POST',
      body: JSON.stringify({
        query: query,
        variables: {
          limit: this.limit,
          offset: offset,
        },
      }),
    })
      .then((r) =>
        r.json().then((r) => {
          if (r.errors) {
            throw new Error(r.errors.map((e) => e.message).join(', '));
          }
          return r.data;
        })
      )
      .catch((e) => console.log(e));

    if (data[field].length === this.limit) {
      offset = offset + this.limit;
      const res = await this.getData(query, offset, field);
      return data[field].concat(res);
    }
    return data[field];
  }

  #getUser = async () => {
    const query = `
    query userData($limit: Int, $offset: Int) {
        user (where: { login: { _eq: "${this.login}"}}
        order_by: {id: asc}
        limit: $limit
        offset: $offset) {
            id
            login
           }
    }`;
    const u = await this.getData(query, 0, 'user');
    return u[0].id;
  };

  async GetSkills() {
    const query = `query getSkills($limit: Int, $offset: Int) {
  transaction(
    where: {_and: [ {type: {_nin: ["xp", "up", "down"]}}, {user: {id: {_eq: ${this.id}}}}]}
    order_by: {createdAt: asc}
    limit: $limit
    offset: $offset
  ) {
    amount
    type
    object {
      name
    }
  }
}`;

    const data = await this.getData(query, 0, 'transaction');
    let skills = {};
    data.forEach((ob) => {
      const key = ob.type.replaceAll('skill_', '');
      if (!skills[key] || skills[key] < ob.amount) {
        skills[key] = ob.amount;
      }
    });

    let skillsForTask = {};
    data.forEach((ob) => {
      const key = ob.type.replaceAll('skill_', '');
      if (!skillsForTask[ob.object.name]) {
        skillsForTask[ob.object.name] = [];
      }
      skillsForTask[ob.object.name].push({
        type: key,
        amount: ob.amount,
      });
    });
    console.log(skills, skillsForTask);
    return [skills, skillsForTask];
  }

  async GetXP() {
    const query = `query getXP($limit: Int, $offset: Int) {
    transaction(
    where: {_and: [ {type: {_in: ["xp", "up", "down"]}}, {user: {id: {_eq: ${this.id}}}}]}
    order_by: {createdAt: asc}
    limit: $limit
    offset: $offset
    ){
    amount
    path
    type
    }
    }
    `;
    const data = await this.getData(query, 0, 'transaction');

    const XP = {};
    const up = data
      .filter((ob) => ob.type === 'up')
      .reduce((prev, cur) => prev + cur.amount, 0);
    XP.done = Math.round(up / 1000);

    const down = data.filter((ob) => ob.type === 'down');

    const downPoints = down.reduce((prev, cur) => prev + cur.amount, 0);
    XP.received = Math.ceil(downPoints / 10000) / 100;

    let unique = new Set();
    down.filter((ob) => {
      unique.add(ob.path);
    });
    unique.add('/johvi/div-01/piscine-js');

    const totalXP = data.filter((ob) => ob.type === 'xp');

    const piscineGO = totalXP
      .filter((ob) => ob.path.startsWith('/johvi/piscine-go'))
      .reduce((prev, cur) => prev + cur.amount, 0);
    XP.piscineGo = Math.ceil(piscineGO / 1000);

    const piscineJS = totalXP
      .filter((ob) => ob.path.startsWith('/johvi/div-01/piscine-js/'))
      .reduce((prev, cur) => prev + cur.amount, 0);
    XP.piscineJS = Math.ceil(piscineJS / 1000);

    let max = {};
    totalXP
      .filter((ob) => unique.has(ob.path))
      .forEach((ob) => {
        if (!max[ob.path] || max[ob.path] < ob.amount) {
          max[ob.path] = ob.amount;
        }
      });
    max = Object.values(max).reduce((p, c) => p + c);
    XP.div01 = Math.ceil(max / 1000);

    return XP;
  }

  async GetAttempts() {
    const query = `query getAttempts($limit: Int, $offset: Int) {
      result (
      where: {_and: [{type: {_eq: "tester"}}, {user: {id: {_eq: ${this.id}}}}]}
      order_by: {createdAt: asc}
      limit: $limit
      offset: $offset
      ) {
      createdAt
      path
      grade
      object {
        name
        }
      }
    }`;
    const data = await this.getData(query, 0, 'result');
    let Attempts = {};

    data.forEach((ob) => {
      if (Attempts[ob.object.name]) {
        if (ob.grade === 0) {
          Attempts[ob.object.name]['attempts']++;
          Attempts[ob.object.name]['createdAt'] = ob.createdAt;
        } else if (!Attempts[ob.object.name]['isOne']) {
          Attempts[ob.object.name]['attempts']++;
          Attempts[ob.object.name]['createdAt'] = ob.createdAt;
          Attempts[ob.object.name]['isOne'] = true;
        }
      } else {
        Attempts[ob.object.name] = {
          name: ob.object.name,
          createdAt: ob.grade > 0 ? ob.createdAt : null,
          path: ob.path,
          attempts: 1,
        };
      }
    });
    const attGo = Object.values(Attempts).filter((ob) =>
      ob.path.startsWith('/johvi/piscine-go/')
    );
    const attJS = Object.values(Attempts).filter((ob) =>
      ob.path.startsWith('/johvi/div-01/piscine-js/')
    );

    return [attGo, attJS];
  }
}
